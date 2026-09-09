---
title: "Coder Registry Poisoned Terraform Modules via Cloudflare Origin Pool"
slug: "coder-registry-terraform-supply-chain"
date: 2026-09-01
type: news
category: news
tags: [supply-chain, terraform, coder, cloudflare, credentials, ai-agents]
excerpt: "Fourteen-hour 2026-08-31 hijack of registry.coder.com origin IPs served credential-stealing Terraform modules; GHSA-vx42-ghc9-gw65, CVSS 9.0, no CVE."
source: "Cloud Security Alliance"
sourceUrl: "https://github.com/coder/coder/security/advisories/GHSA-vx42-ghc9-gw65"
draft: false
---

## Summary

On **2026-08-31** an unidentified actor used a stolen **Cloudflare API key** belonging to **Coder** (cloud development environments / AI-agent workspaces) to insert unauthorized origin IPs into the pool serving **registry.coder.com**. For about **fourteen hours** (**07:35–21:45 UTC**) some Terraform module fetches were answered by attacker infrastructure instead of Coder’s Google Cloud backends. Modules looked like the real versions; they were not. Extra `data.external` blocks ran at provision time and shipped secrets to a lookalike host.

Coder published advisory **GHSA-vx42-ghc9-gw65** on **2026-09-01** (CVSS v4.0 **9.0**). There is **no CVE**: this was distribution-path compromise, not a Coder application bug. Coder reports its own GCP and product code were not breached; it **cannot** prove every customer was clean because relevant logs sat on the attacker’s origin. Cloud Security Alliance’s **2026-09-07** research note is the long-form defender summary indexed here.

## Key Findings

| Finding | Detail |
|---------|--------|
| Window | 2026-08-31 07:35–21:45 UTC |
| Mechanism | Cloudflare origin-pool poisoning via stolen API key |
| Target | Terraform modules from registry.coder.com |
| Execution | Legitimate Terraform `data.external` during plan/apply |
| Exfil host | `www.coder-infra.com` (registered 2026-08-28) |
| Exfil path | `http://www.coder-infra.com/cli/check` with `X-CLI-Token` |
| Attacker IP (indexed) | 199.91.220.205 |
| Module hunt string | `data.external.telemetry` |
| Patched Coder releases | 2.37.0, 2.36.4, 2.35.7, 2.34.9 |
| Lockfile gap | `.terraform.lock.hcl` hashes **providers**, not remote **modules** |

## What was stolen (Coder / CSA)

Tampered modules could read whatever the **provisioner** could read: environment secrets, cloud and AI-provider API keys, CI credentials, config-file secrets, shell history, user OIDC tokens, SSH keys, one-time external auth tokens, and — if provisioners ran inside `coderd` — Coder database passwords. Coder states **user refresh tokens** were not passed to provisioners.

The AI-agent angle: Coder registry modules install tools such as Claude Code into workspaces. Model-provider keys and MCP credentials were in the same blast radius as classic cloud keys.

## Why version pins did not help

Terraform lockfiles do not currently hash remote registry modules the way they hash providers. An attacker who serves a **different zip under the same version** defeats “we pinned 1.2.3.” This incident is a **CDN/origin** integrity failure, not a malicious new semver from the legitimate publisher.

## Impact

- Any workspace template created or applied during the window may have run attacker code as the provisioner identity.
- Credential rotation is **mandatory** if exposure cannot be ruled out — Coder cannot see the attacker’s logs.
- Vulnerability scanners keyed on CVEs will **miss** this class of event.

## Mitigation

1. Run Coder’s published SQL against every deployment to find modules cached during the window; purge those caches.
2. Search DNS, proxy, and VPC logs for `coder-infra.com` and provisioner logs for `data.external.telemetry`.
3. Rotate cloud, CI, SSH, OIDC, and AI/MCP credentials reachable by provisioners.
4. Upgrade to Coder **2.37.0 / 2.36.4 / 2.35.7 / 2.34.9**.
5. Narrow provisioner IAM so AI-agent workspaces do not inherit the full cloud admin role.

## Related Signals

- [Shai-Hulud npm resurrection](/signals/shai-hulud-npm-111-day-resurrection)
- [JFrog Artifactory auth bypass](/signals/jfrog-artifactory-auth-bypass-cve-2026-82329)
- [PolinRider NK supply chain](/signals/polinrider-north-korea-supply-chain-expansion)
- [Mastra npm crypto stealer](/signals/mastra-npm-crypto-stealer)

## Sources

- [GitHub — Coder GHSA-vx42-ghc9-gw65](https://github.com/coder/coder/security/advisories/GHSA-vx42-ghc9-gw65) (2026-09-01)
- [Cloud Security Alliance — Coder Registry Terraform supply chain](https://labs.cloudsecurityalliance.org/research/csa-research-note-coder-registry-terraform-supply-chain-2026/) (2026-09-07)
