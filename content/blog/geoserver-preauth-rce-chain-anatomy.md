---
title: "Anatomy of the GeoServer Pre-Auth RCE Chains (CVE-2026-129245 & WatchTowr Telemetry)"
slug: "geoserver-preauth-rce-chain-anatomy"
date: 2026-11-25
type: research
category: infra
tags: [geoserver, rce, java, xml-injection, ssrf, deserialization, auth-bypass]
excerpt: "How two independent security teams chained six GeoServer vulnerabilities—from oversized storedQuery_id path disclosure and x/WFS prefix bypass through GetFeatureById XInclude read and static remember-me cookie forgery to HSQLDB and SQLite RCE."
draft: false
wip: false
---

Two independent disclosures converged on GeoServer in late November 2026, turning a set of configuration defaults and OWS routing gaps into complete unauthenticated remote code execution chains. **Jonah Burgess (CryptoCat, Rapid7)** reported a five-CVE sequence on **2 August 2026**, while **Niels Teusink (Eye Security)** independently reported a three-CVE sequence on **29 September 2026**, observing more than **3,000** internet-accessible GeoServer deployments ahead of disclosure. Although upstream maintainers shipped fixes in **GeoServer 2.27.7, 2.28.6, and 3.0.2** (and **GeoTools 33.7, 34.6, 35.2**) before coordinated advisory release on **23–24 November**, **watchTowr** honeypots captured live in-the-wild stored-query probes across its global honeypot network on **25 November**.

See the Signal summary in [GeoServer Pre-Auth RCE Chain Exploited in Probing](/signals/geoserver-preauth-rce-chain-cve-2026-129245).

## Two Converging Exploitation Paths

> **Verification note (27 November 2026):** When checked, NVD had no record yet for CVE-2026-120704, -120705, -129242, -129243, -129244 or -129245. The 9.2 score for CVE-2026-129245 matches GitHub's advisory `GHSA-hgm3-wq4h-8vvq`. The other scores in this essay are as stated in the sources below and have not been checked against NVD.

```text
Unauthenticated HTTP Request
  |
  +--> [Optional] CVE-2026-129244 (4,092-char storedQuery_id) -> leaks GEOSERVER_DATA_DIR path
  |
  +--> [If WFS secured] CVE-2026-129243 (x/WFS prefix) -> bypasses OWS service security rules
  |
  +--> CVE-2026-120705 (WFS GetFeatureById XML injection + xi:include)
  |      reads GEOSERVER_DATA_DIR/security/config.xml (remember-me key)
  |      reads GEOSERVER_DATA_DIR/security/usergroup/default/users.xml (admin digest)
  |
  +--> CVE-2026-129245 (static/leaked remember-me key "geoserver" + admin hash)
         forges valid SPRING_SECURITY_REMEMBER_ME_COOKIE -> Full ADMIN session
           |
           +--> Rapid7 path: CVE-2026-129242 -> HSQLDB JDBC getObject() deserialization RCE
           +--> Eye Security path: CVE-2026-120704 -> SQLite enable_load_extension + load_extension() RCE
```

### Stage 1: Leaking Data Directory & Bypassing Service Restrictions

- **Path disclosure (`CVE-2026-129244`, CVSS 4.0 `6.9`):** Passing an oversized **`4,092`-character `storedQuery_id`** parameter inside a WFS request triggers a filesystem exception reflecting the exact server path to `GEOSERVER_DATA_DIR`, eliminating guesswork across custom container or Linux layouts.
- **OWS service security bypass (`CVE-2026-129243`, CVSS 4.0 `8.8`):** Even when administrators lock down WFS endpoints or `CreateStoredQuery` / `DescribeFeatureType` operations behind service security rules, `gs-ows` evaluated security policies on exact service strings while still dispatching prefixed service paths such as **`x/WFS`**, letting unauthenticated clients reach restricted WFS endpoints.

### Stage 2: Unescaped XML Template Injection to Arbitrary File Read (`CVE-2026-120705`)

The WFS 2.0 stored query `GetFeatureById` interpolated caller-supplied `ID` parameters directly into an XML template before reparsing it **without disabling external entities or `XInclude` (`xi:include`) processing**.

When a layer is anonymously readable, injecting an `<xi:include href="file:///..." parse="text"/>` directive causes GeoServer to evaluate the local file and echo its contents inside the error output; even when anonymous layers are absent, the XML parser still resolves `file://` or attacker-chosen `http(s)://` SSRF targets blindly. In Rapid7's and Eye Security's chains, this primitive extracts two critical files:

1. `security/config.xml` — revealing the remember-me signing secret.
2. `security/usergroup/default/users.xml` — revealing the administrator username (`admin`) and salted password hash/representation.

### Stage 3: Default Remember-Me Key & Cookie Forgery (`CVE-2026-129245`)

Spring Security's remember-me mechanism in GeoServer `gs-main` validates an HMAC/signature cookie derived from the server's configured `remember-me` key and the target user's stored password digest—not the plaintext password. Worse, **`CVE-2026-129245`** (CVSS 4.0 **9.2** Critical) stems from GeoServer shipping with a **hard-coded default key value (`"geoserver"`)** in `security/config.xml`. Once `CVE-2026-120705` reads `users.xml` (or if default/known digests exist alongside the static key), an attacker mints a valid **`ADMIN` remember-me cookie** without ever cracking the administrator password.

### Stage 4: Two Distinct Admin-to-OS Code Execution Sinks

Once authenticated as administrator, both researchers bypassed GeoServer's Java sandbox via JDBC configuration panels inside `gs-sec-jdbc`:

1. **Rapid7 / CryptoCat (`CVE-2026-129242`, CVSS 4.0 `8.6`):** Configured an administrative JDBC user/role service pointing to HSQLDB whose `getObject()` path triggers **unsafe Java deserialization** of attacker-supplied gadget bytes, achieving OS command execution as the GeoServer service account (`Crypto-Cat/geoserver-unauth-rce-poc`).
2. **Eye Security (`CVE-2026-120704`, CVSS 3.1 `7.2`, `GHSA-wc3v-48j7-xf57`):** Configured a JDBC connection backed by SQLite with **`enable_load_extension=true`**, uploaded a compiled native library (`.so` on Linux or `.dll` on Windows), and triggered SQLite's **`load_extension()`** function to execute arbitrary native code inside the GeoServer JVM process.

## Why WatchTowr Telemetry Matters Now

Within 48 hours of advisory publication, watchTowr documented automated multi-IP scanners testing exposed GeoServer instances on **25 November** by creating and immediately deleting WFS stored queries (`CVE-2026-120705` alongside `CVE-2026-129243` `x/WFS` service bypasses, with follow-up commentary also noting `CVE-2026-129244`). Because both `CVE-2026-129245` cookie forgery and follow-on JDBC RCE require **zero user interaction** and a full public chain repository already exists, automated exploitation waves typically transition rapidly from stored-query validation probes to credential harvesting and shell deployment—mirroring historical waves against GeoServer `CVE-2024-36401`.

## Hardening & Remediation Beyond Version Bumps

1. **Upgrade and rotate exposed passwords:** Upgrade to **GeoServer 2.27.7, 2.28.6, or 3.0.2** (and **GeoTools 33.7 / 34.6 / 35.2**). Patched builds stop reading the remember-me secret from `security/config.xml`, instead generating random per-node startup secrets (invalidating old cookies automatically; clusters share a secret via **`GEOSERVER_REMEMBERME_KEY`**). Rotate every admin and user password if prior exposure is possible, since leaked `users.xml` digests remain vulnerable to offline cracking. If upgrading is temporarily blocked, disable `rememberme` in the `web` filter chain, randomize the legacy `security/config.xml` key, and block `service` parameters containing `/` at the reverse proxy.
2. **Network-isolate WFS and Admin endpoints:** GeoServer deployments serving public WMS map tiles rarely need internet-facing WFS `CreateStoredQuery`, JDBC configuration, or `/geoserver/web` login exposure.
3. **Audit stored queries & JDBC configs:** Inspect **`GEOSERVER_DATA_DIR/wfs/query/`**, **`workspaces/*/wfs/query/`**, and `security/usergroup/` XML configurations for anomalous JDBC connections (`org.hsqldb.*`, `org.sqlite.*`, `enable_load_extension`) or temporary stored-query artifacts.

## Sources

- [GeoServer Vulnerability Update (23 Nov 2026)](https://geoserver.org/vulnerability/2026/11/23/cve-update.html)
- [Eye Security — Unauthenticated RCE in GeoServer](https://labs.eye.security/unauthenticated-remote-code-execution-vulnerability-in-geoserver/)
- [CryptoCat — Unauthenticated GeoServer RCE Chain](https://cryptocat.me/blog/research/analysis/geoserver_preauth_rce/)
- [watchTowr — GeoServer CVE-2026-129245 FAQ](https://watchtowr.com/intelligence/geoserver-cve-2026-129245-faq/)
- [GitHub Advisory GHSA-hgm3-wq4h-8vvq (`CVE-2026-129245`)](https://github.com/geoserver/geoserver/security/advisories/GHSA-hgm3-wq4h-8vvq)
- [CCCS Advisory AV26-1207](https://www.cyber.gc.ca/en/alerts-advisories/geoserver-security-advisory-av26-1207)
