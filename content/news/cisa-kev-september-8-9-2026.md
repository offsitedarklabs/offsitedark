---
title: "CISA KEV September 8–9: N-central, Windows, Citrix, FMC, Chrome"
slug: "cisa-kev-september-8-9-2026"
date: 2026-09-09
type: news
category: news
tags: [cisa, kev, bod-26-04, citrix, fortinet, chromium, cisco, n-able, windows]
excerpt: "Eight KEV rows in two days: Magento, N-central, two exploited Windows EoPs, then Fortinet heap overflow, Citrix NetScaler auth bypass, Chrome V8 OOB write, Cisco FMC root."
source: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/09/09/cisa-adds-four-known-exploited-vulnerabilities-catalog"
draft: false
---

## Summary

CISA added **four** Known Exploited Vulnerabilities on **2026-09-08** and **four more** on **2026-09-09**. That is on top of the [late-August / Sep 2–4 cluster](/signals/cisa-kev-september-2026-cluster) already indexed here. BOD **26-04** still requires federal civilian agencies to prioritize KEV items on publicly exposed assets that yield total control, and to **check for compromise before trusting the patch**.

Dedicated OFFSITE.DARK write-ups cover the highest-blast-radius new rows: [N-central CVE-2026-86218](/signals/n-able-ncentral-rce-cve-2026-86218), [Windows CVE-2026-85880 / CVE-2026-81963](/signals/windows-september-2026-alpc-updatestack-zero-days), [Cisco FMC CVE-2026-20079](/signals/cisco-fmc-auth-bypass-cve-2026-20079), and the already-published [StyleSmuggler](/signals/stylesmuggler-adobe-commerce-rce-cve-2026-75650). The rest of this card is Citrix, Fortinet, and the second Chromium V8 KEV of the week.

## Timeline

| Date | Action |
|------|--------|
| 2026-09-08 | KEV: CVE-2026-75650, CVE-2026-81963, CVE-2026-85880, CVE-2026-86218 |
| 2026-09-08 | Microsoft September Patch Tuesday (record ~974 CVEs); [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414) published the same afternoon |
| 2026-09-09 | KEV: CVE-2025-25249, CVE-2026-19490, CVE-2026-87491, CVE-2026-20079 |

## September 8 four

| CVE | Product | Class (CISA wording) | Notes |
|-----|---------|----------------------|--------|
| CVE-2026-75650 | Adobe Commerce / Magento | Template-engine special-element neutralization | [StyleSmuggler](/signals/stylesmuggler-adobe-commerce-rce-cve-2026-75650) — APSB26-146 / VULN-39341 |
| CVE-2026-81963 | Microsoft Windows | Link following | Update Stack LPE, exploited |
| CVE-2026-85880 | Microsoft Windows | Heap-based buffer overflow | ALPC EoP, AppContainer escape, exploited |
| CVE-2026-86218 | N-able N-central | Static code injection | [Dedicated signal](/signals/n-able-ncentral-rce-cve-2026-86218) — HF4 2026.3.1.14 |

## September 9 four

| CVE | Product | Class (CISA wording) | Notes |
|-----|---------|----------------------|--------|
| CVE-2025-25249 | Fortinet multiple products | Heap-based buffer overflow | FortiOS / FortiSwitchManager (see versions below) |
| CVE-2026-19490 | Citrix NetScaler ADC/Gateway | Authentication bypass (alternate path) | CVSS v4 **9.3**; Gateway/AAA (+ SAML on newer builds) |
| CVE-2026-87491 | Google Chromium V8 | Out-of-bounds write | Chrome **153.0.8010.36 / .37**; seventh Chrome zero-day of 2026 |
| CVE-2026-20079 | Cisco FMC / SCC Firewall Management | Authentication bypass (alternate path) | [Dedicated signal](/signals/cisco-fmc-auth-bypass-cve-2026-20079) |

### Citrix NetScaler (CVE-2026-19490)

Citrix patched this **2026-08-21** (CTX696939, alongside memory-overflow CVE-2026-19489). KEV on **2026-09-09** means **exploitation evidence landed after the patch**. Fixed trains cited in public coverage: **14.1-73.32** and **13.1-63.21** (plus matching FIPS/NDcPP builds). Older firmware is in scope if the box is a Gateway (SSL VPN, ICA Proxy, CVPN, RDP Proxy) or AAA vserver; newer firmware often also needs a **SAML action**. Confirm against the live bulletin — do not assume a SAML requirement for 14.1-43.55 and earlier.

NetScaler auth-bypass KEVs have a ransomware history. Internet-facing Gateway/AAA that missed August should be treated as **compromise-until-proven-clean**.

### Fortinet (CVE-2025-25249)

Heap overflow via crafted packets in **FortiOS** (7.6.0–7.6.3, 7.4.0–7.4.8, 7.2.0–7.2.11, 7.0.0–7.0.17, 6.4.0–6.4.16) and **FortiSwitchManager** (7.2.0–7.2.6, 7.0.0–7.0.5). Vendor upgrades cited: FortiOS **7.6.4 / 7.4.9 / 7.2.12 / 7.0.18 / 6.4.17** (or 8.0.0 if you are jumping trains); FortiSwitchManager **7.2.7 / 7.0.6**. FortiSASE 25.2.b was remediated in **25.2.c**; 25.1.a.2 needs a fixed train — confirm **FG-IR-25-084**. The CVE year is **2025**; NVD published into 2026 — do not skip the row because the prefix looks old.

### Chromium V8 (CVE-2026-87491)

Google: OOB write in V8, sandbox-constrained RCE via a crafted HTML page, **exploit exists in the wild**. Fixed in Chrome **153.0.8010.36 / .37** (SKU-dependent). This is **distinct** from last week’s KEV **CVE-2026-85046** (type confusion). Patch Chrome, Edge, and Electron shells; do not wait for a second “enterprise CVE process.” Help Net Security counts this as Chrome’s **seventh** in-the-wild zero-day of 2026.

## Operator order of operations

1. Internet-exposed control planes: **N-central**, **FMC/SCC**, **NetScaler Gateway/AAA**, **FortiOS** management/VPN paths — patch and assume scan traffic.
2. Storefronts: StyleSmuggler if Magento/Commerce is still on 2026-aug without VULN-39341.
3. Endpoints: September Windows updates (85880/81963) plus Chromium 153.0.8010.x.
4. Defender engine: [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414) is **not** in KEV; it is a same-day public incomplete-patch claim.
5. BOD 26-04 shops: document pre-patch compromise checks for every row above.

## Related Signals

- [N-able N-central RCE](/signals/n-able-ncentral-rce-cve-2026-86218)
- [Windows ALPC / Update Stack zero-days](/signals/windows-september-2026-alpc-updatestack-zero-days)
- [Cisco FMC auth bypass](/signals/cisco-fmc-auth-bypass-cve-2026-20079)
- [StyleSmuggler Magento RCE](/signals/stylesmuggler-adobe-commerce-rce-cve-2026-75650)
- [CISA KEV early September cluster](/signals/cisa-kev-september-2026-cluster)
- [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414)

## Sources

- [CISA — four KEV additions (2026-09-08)](https://www.cisa.gov/news-events/alerts/2026/09/08/cisa-adds-four-known-exploited-vulnerabilities-catalog)
- [CISA — four KEV additions (2026-09-09)](https://www.cisa.gov/news-events/alerts/2026/09/09/cisa-adds-four-known-exploited-vulnerabilities-catalog)
- [Citrix CTX696939 — CVE-2026-19490 / CVE-2026-19489](https://support.citrix.com/external/article/CTX696939/netscaler-adc-and-netscaler-gateway-secu.html)
- [Fortinet PSIRT — FG-IR-25-084 (CVE-2025-25249)](https://fortiguard.fortinet.com/psirt/FG-IR-25-084)
- [Help Net Security — Chrome CVE-2026-87491](https://www.helpnetsecurity.com/2026/09/09/google-chrome-cve-2026-87491-zero-day-flaw/)
