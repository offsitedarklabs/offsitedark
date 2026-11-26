---
title: "Elixir Struct-Gadget RCE: Anatomy of the Hex.pm Breach, Ash, and db_connection (CVE-2026-129514)"
slug: "elixir-erlang-term-struct-gadget-rce"
date: 2026-11-24
type: research
category: infra
tags: [elixir, erlang, hex, deserialization, rce, ecto, ash, supply-chain]
excerpt: "Why Plug.Crypto.non_executable_binary_to_term/2 with [:safe] did not stop unauthenticated RCE on Hex.pm (CVE-2026-129514, CVSS 4.0 10.0), how forged __struct__ maps chained through error inspection, Ecto.Query.DynamicExpr, and DBConnection.Stream :log apply/3, and how Ash and db_connection were exposed."
draft: false
wip: false
---

On **23 November 2026**, the **Hex.pm** package registry suffered a brief, high-severity production intrusion after an attacker sent **69 exploit requests** over 13 minutes (`18:16–18:29 UTC`) targeting all six web nodes via **CVE-2026-129514** (**GHSA-9pmm-hf4r-27pg**, CVSS 4.0 **10.0** Critical). Maintainers deployed hotfix commit **`379b0a2`** by **18:31 UTC**, rotating infrastructure secrets, database passwords, and session/access-token signing keys immediately while preparing a coordinated registry signing-key rollover.

Beyond a single registry incident, `CVE-2026-129514` exposed a subtle semantic mismatch across the Elixir ecosystem: why BEAM deserialization modes widely assumed to be "safe" (`[:safe]` and `Plug.Crypto.non_executable_binary_to_term/2`) still construct arbitrary in-memory Elixir structs—and why companion flaws immediately surfaced in **Ash (`CVE-2026-124283`)** and **`db_connection` (`CVE-2026-133555`)**.

See the Signal briefing in [Hex.pm Registry Breached via Forged Elixir Struct RCE](/signals/hex-pm-erlang-term-rce-cve-2026-129514).

## The Deserialization Trust Fallacy on the BEAM

In Erlang/Elixir, `:erlang.binary_to_term(bin, [:safe])` prevents two notorious attacks:

1. **Atom table exhaustion** (rejecting payloads that attempt to allocate unknown atoms).
2. **Serialized executable closures** when combined with `Plug.Crypto.non_executable_binary_to_term/2`, which walks the parsed term to reject references and anonymous functions (`fun`).

What `[:safe]` and `non_executable_binary_to_term/2` **do not restrict** are arbitrary Erlang maps whose keys are already loaded atoms in the running BEAM VM—including **`%{__struct__: SomeLoadedModule, ...}`**. Under Elixir's runtime representation, a struct is simply a map carrying `:__struct__`. Constructing that map via `binary_to_term` bypasses the target module's constructor (`__struct__/0`), field defaults, type validation, and `@enforce_keys` invariants altogether.

Whenever an endpoint parses client-supplied Erlang External Term Format (`application/vnd.hex+erlang` on Hex.pm, or Erlang-term pagination cursors in Ash), any loaded struct module implementing a polymorphic Elixir protocol—most notably **`Inspect`** or **`Enumerable`**—becomes an attacker-controllable gadget.

## The Hex.pm Gadget Chain (`CVE-2026-129514`)

```text
HTTP POST /...  Content-Type: application/vnd.hex+erlang
  |
  +--> HexpmWeb.ErlangFormat.decode/1 calls Plug.Crypto.non_executable_binary_to_term/2
  |      Decodes crafted ETF payload containing:
  |      %Ecto.Query.DynamicExpr{
  |        binding: %DBConnection.Stream{ opts: [log: {otp_mod, otp_fun, [inner_mfa]}] }
  |      }
  |
  +--> Plug.MethodOverride calls body_params["_method"] -> Access.get/3 -> fetch/2
  |      Raises UndefinedFunctionError with forged struct in top stack frame
  |
  +--> Error tracking (Sentry, Bandit Exception.format/3, JSON logger) runs inspect/1
  |      Inspect.Ecto.Query.DynamicExpr calls Enum.map/2 on unchecked :binding
  |      Enumerable.DBConnection.Stream -> DBConnection.reduce/3 -> declare/4
  |
  +--> Query encoding fails -> error path calls :log hook:
         apply(otp_mod, otp_fun, [entry | args]) -> OTP stdlib trampoline applies inner MFA -> RCE
```

1. **Ingress (`application/vnd.hex+erlang`):** `HexpmWeb.Endpoint` runs `Plug.Parsers` (`HexpmWeb.PlugParser`) before routing and authentication, calling `HexpmWeb.ErlangFormat.decode/1` (`[:safe]`). Any unauthenticated `POST` with that content type feeds a forged struct directly into `conn.params` because every Elixir module and function atom already exists in the running release.
2. **Error sink (`Plug.MethodOverride` + `inspect/1`):** `Plug.MethodOverride` reads `body_params["_method"]`, dispatching `Access.get/3` -> `Ecto.Query.DynamicExpr.fetch/2`, which raises `UndefinedFunctionError` with the forged struct sitting in the stack frame. Error reporting (`Sentry`, `Bandit`'s `Exception.format/3`, and the JSON log formatter) calls `inspect/1`, firing `Inspect.Ecto.Query.DynamicExpr`, which enumerates `:binding` with `Enum.map/2` without verifying it is a list.
3. **Execution sink (`DBConnection.Stream` `:log` MFA):** Placing a `%DBConnection.Stream{}` inside `:binding` triggers `Enumerable` -> `DBConnection.reduce/3` -> `declare/4`. Query encoding fails before checking out a connection, yet the error path still invokes the stream's `:log` option (`{mod, fun, args}`) via **`apply(mod, fun, [entry | args])`** (**CVE-2026-133555**, CVSS 4.0 **8.9**). Because the log entry occupies argument 0, the payload selects an **OTP standard library trampoline** that ignores the leading log entry and applies a trailing MFA list to execute OS commands as the BEAM user.

## Ecosystem Spread: Ash (`CVE-2026-124283`) and `db_connection` (`CVE-2026-133555`)

Auditing downstream Elixir libraries for the same primitive surfaced two critical siblings:

| Library & CVE | CVSS 4.0 | Vulnerable Pattern | Fixed Release |
|---------------|----------|--------------------|---------------|
| **`db_connection` (`CVE-2026-133555`)** | **8.9** High | `DBConnection.Stream` / `PrepareStream` `:log` field accepts arbitrary `{m, f, a}` callbacks reachable from forged structs | **`2.10.3`** (`1.1.0–<2.10.3` affected) |
| **`ash` (`CVE-2026-124283`)** | **8.9** High | Keyset pagination cursors (`Ash.Page.Keyset.filter/4`) decoded client input as Erlang terms; `:ci_string`, `:map`, `:struct`, `:term` sort types passed structs to `AshPostgres` (`inspect/1` RCE or `%Ash.Query.Function.Fragment{}` SQLi) | **`3.38.0`** (`>= 3.31.3, < 3.38.0` affected; workaround: `keyset_signing_secret` on `>= 3.37.0`) |
| **`hexpm` (`CVE-2026-129514`)** | **10.0** Critical | `HexpmWeb.ErlangFormat.decode/1` accepted arbitrary structs before routing/auth | Commit **`379b0a2`** |

## Architectural Hardening Rules for BEAM Services

1. **Replace `binary_to_term` on untrusted HTTP/API boundaries:** Prefer strict schema-validated JSON, Protobuf, or custom binary decoders whenever receiving data across trust boundaries—even inside `[:safe]` / `non_executable_binary_to_term`.
2. **If ETF is unavoidable, enforce structural allowlists:** Recursively reject **every** map containing `:__struct__` (or allowlist solely primitive tuples, lists, binaries, numbers, and plain maps) immediately after decoding, **before** Plug pipelines, exception loggers, or validation layers ever touch or inspect the decoded term.
3. **Never place `{m, f, a}` tuples inside data structs:** Store opaque identifiers or pure enum tags rather than callable MFA tuples on structs that might traverse logging, caching, or serialization pipelines.
4. **Harden Hex clients during key transition:** Change your Hex password, reset Authenticator 2FA via `hex.pm/dashboard/security`, and—until Hex ships its updated CLI (`mix local.hex --force`) and completes the registry signing-key rotation—configure CI/CD and developer environments strictly to **`https://repo.hex.pm`** without third-party mirrors.

## Sources

- [Hex.pm Security Incident Report (24 Nov 2026)](https://hex.pm/blog/security-incident-on-hexpm)
- [GitHub Advisory `GHSA-9pmm-hf4r-27pg` (`CVE-2026-129514`)](https://github.com/hexpm/hexpm/security/advisories/GHSA-9pmm-hf4r-27pg)
- [Hex.pm Fix Commit `379b0a2`](https://github.com/hexpm/hexpm/commit/379b0a2)
- [EEF Advisory — `ash` (`CVE-2026-124283`)](https://cna.erlef.org/cves/CVE-2026-124283.html)
- [GitHub Advisory `GHSA-gmmq-fw75-wq46` (`CVE-2026-133555` / `db_connection`)](https://github.com/elixir-ecto/db_connection/security/advisories/GHSA-gmmq-fw75-wq46)
