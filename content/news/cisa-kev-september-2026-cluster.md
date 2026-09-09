---
title: "CISA KEV September 2026: PaperCut, SMA1000, Artifactory, Chromium"
slug: "cisa-kev-september-2026-cluster"
date: 2026-09-04
type: news
category: news
tags: [cisa, kev, bod-26-04, papercut, sonicwall, jfrog, chromium, litellm]
excerpt: "Late-August / early-September KEV burst: PaperCut pair, seven mixed internet-edge and app CVEs on Sep 2, Chromium V8 on Sep 4 — BOD 26-04 still the federal clock."
source: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/09/02/cisa-adds-seven-known-exploited-vulnerabilities-catalog"
draft: false
---

## Summary

CISA’s Known Exploited Vulnerabilities catalog took three notable additions around the 2026-08-31 → 2026-09-04 window. Binding Operational Directive **26-04** still requires federal civilian agencies to prioritize KEV items on publicly exposed assets that yield total control after exploitation, and to **check for compromise before trusting the patch**.

This signal is the **index card** for that week. Dedicated OFFSITE.DARK write-ups exist for the three highest-blast-radius pairs ([PaperCut](/signals/papercut-ng-mf-auth-bypass-rce-cve-2026-81578), [SonicWall SMA1000](/signals/sonicwall-sma1000-ssrf-rce-cve-2026-83548), [JFrog Artifactory](/signals/jfrog-artifactory-auth-bypass-cve-2026-82329)). The rest of the Sep 2 seven plus Chromium V8 are summarized here.

## Timeline

| Date | Action |
|------|--------|
| 2026-08-31 | KEV: CVE-2026-81578, CVE-2026-82078 (PaperCut NG/MF) |
| 2026-09-02 | KEV: seven CVEs (Switchvox, Starlette, Kestra, LiteLLM, Artifactory, SMA1000 ×2) |
| 2026-09-04 | KEV: CVE-2026-85046 (Google Chromium V8 type confusion) |

## September 2 seven

| CVE | Product | Class (CISA wording) | Notes |
|-----|---------|----------------------|--------|
| CVE-2026-9586 | Sangoma Switchvox | SQL injection | PBX / UC edge |
| CVE-2026-48710 | Kludex Starlette | HTTP request/response smuggling | ASGI stack under FastAPI et al. |
| CVE-2026-49869 | Kestra OSS | OS command injection | Workflow orchestration; CVSS 10.0 in secondary trackers |
| CVE-2026-59822 | BerriAI LiteLLM | Improper authentication | Distinct from [CVE-2026-42208 SQLi](/signals/litellm-proxy-sqli-cve-2026-42208) |
| CVE-2026-82329 | JFrog Artifactory | Improper authentication | [Dedicated signal](/signals/jfrog-artifactory-auth-bypass-cve-2026-82329) |
| CVE-2026-83548 | SonicWall SMA1000 | SSRF | [Dedicated signal](/signals/sonicwall-sma1000-ssrf-rce-cve-2026-83548) |
| CVE-2026-83549 | SonicWall SMA1000 | OS command injection | Chained with 83548 |

## Chromium V8 (September 4)

**CVE-2026-85046** is a **type confusion** in Google Chromium V8, scored high (coverage cites CVSS **8.8**) and added to KEV with evidence of exploitation. Browser/V8 KEVs are usually drive-by or in-the-wild exploit kit material. Patch Chrome / Edge / Electron shells that embed the affected V8; do not wait for a separate “enterprise CVE process” if auto-updates are off.

## LiteLLM: second KEV in 2026

OFFSITE.DARK already indexed **CVE-2026-42208** (pre-auth SQLi on the proxy, fixed 1.83.7). **CVE-2026-59822** is a **different** LiteLLM issue — improper authentication — now KEV-listed. Estates that patched 42208 still need a version that closes 59822. Treat internet-exposed LiteLLM proxies as **AI-gateway edge**, not an internal toy.

## Operator order of operations

1. Internet-exposed: PaperCut admin, SMA1000, Artifactory/Access, Switchvox, Kestra, LiteLLM, Starlette/FastAPI front doors — patch and **assume scan/exploit traffic already happened**.
2. Endpoints: Chromium-family browsers, including embedded runtimes.
3. BOD 26-04 shops: document pre-patch compromise checks, not just the version bump.
4. Cross-check [StyleSmuggler](/signals/stylesmuggler-adobe-commerce-rce-cve-2026-75650) even if it is not in this particular KEV listing — same week, same “edge app RCE” bucket.

## Related Signals

- [PaperCut NG/MF](/signals/papercut-ng-mf-auth-bypass-rce-cve-2026-81578)
- [SonicWall SMA1000](/signals/sonicwall-sma1000-ssrf-rce-cve-2026-83548)
- [JFrog Artifactory](/signals/jfrog-artifactory-auth-bypass-cve-2026-82329)
- [StyleSmuggler Magento](/signals/stylesmuggler-adobe-commerce-rce-cve-2026-75650)
- [LiteLLM proxy SQLi](/signals/litellm-proxy-sqli-cve-2026-42208)

## Sources

- [CISA — two KEV additions (2026-08-31)](https://www.cisa.gov/news-events/alerts/2026/08/31/cisa-adds-two-known-exploited-vulnerabilities-catalog)
- [CISA — seven KEV additions (2026-09-02)](https://www.cisa.gov/news-events/alerts/2026/09/02/cisa-adds-seven-known-exploited-vulnerabilities-catalog)
- [CISA — one KEV addition, Chromium V8 (2026-09-04)](https://www.cisa.gov/news-events/alerts/2026/09/04/cisa-adds-one-known-exploited-vulnerability-catalog)
