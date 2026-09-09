---
title: "Windows ALPC and Update Stack Zero-Days Exploited (CVE-2026-85880 / CVE-2026-81963)"
slug: "windows-september-2026-alpc-updatestack-zero-days"
date: 2026-09-08
type: news
category: news
tags: [microsoft, windows, alpc, zero-day, privilege-escalation, cve-2026-85880, cve-2026-81963, kev, patch-tuesday]
excerpt: "September 2026 Patch Tuesday patched two exploited local EoPs — ALPC heap overflow CVE-2026-85880 and Update Stack link-following CVE-2026-81963 — CISA KEV the same day."
source: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/09/08/cisa-adds-four-known-exploited-vulnerabilities-catalog"
draft: false
---

## Summary

Microsoft’s **2026-09-08** Patch Tuesday was a record drop (press cites **972–974** CVEs). Two of those IDs were already **exploited in the wild**:

- **CVE-2026-85880** — heap-based buffer overflow in **Windows Advanced Local Procedure Call (ALPC)**. CVSS **7.8**. An attacker who can already run code, including inside a **low-privilege AppContainer**, can elevate to **SYSTEM** with no additional user interaction. Volexity and Proofpoint are credited; MSRC lists exploitation detected.
- **CVE-2026-81963** — improper link resolution (CWE-59) in the **Windows Update Stack**. CVSS **7.8**. A local low-privilege user follows a link into a privileged Update Stack path and reaches SYSTEM. Tenable notes this is the **first exploited Update Stack zero-day** in a line of Update Stack EoPs since 2022. Credits include Romain Deperne (Airbus Helicopters) and MSTIC.

CISA added both to the KEV catalog the same day, together with [StyleSmuggler](/signals/stylesmuggler-adobe-commerce-rce-cve-2026-75650) and [N-central CVE-2026-86218](/signals/n-able-ncentral-rce-cve-2026-86218). Coverage cites a federal due date around **2026-09-22** — confirm the live KEV row.

This is **local privilege escalation**, not a pre-auth remote bug. It still matters: AppContainer/sandbox escape plus Update Stack LPE are the second stage after a browser or Office foothold.

Separately, about two hours after the patches landed, NightmareEclipse published [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414). That is **not** in this Patch Tuesday bundle; Microsoft’s CVE-2026-69414 engine close-out is still contested.

OFFSITE.DARK indexes MSRC, CISA, and defender summaries. We do not reproduce either EoP.

## Key Findings

| Finding | Detail |
|---------|--------|
| CVE-2026-85880 | ALPC heap overflow; AppContainer → SYSTEM; exploited |
| CVE-2026-81963 | Update Stack link-following; local user → SYSTEM; exploited |
| Class | Local elevation of privilege (both) |
| User interaction | None, once local code is running |
| Patch | September 2026 Windows security updates (2026-09-08) |
| CISA KEV | 2026-09-08 |
| Patch Tuesday volume | ~974 CVEs (record); 113–119 Critical in press counts |
| Other PT priorities (not KEV here) | DNS/DHCP/WDS RCEs called out by Action1 / CrowdStrike (e.g. CVE-2026-62878, CVE-2026-62893) |

## Conceptual chain

```text
Local code as a standard user or AppContainer process
        ↓
CVE-2026-85880 — malformed ALPC message overflows a privileged handler
   or
CVE-2026-81963 — Update Stack follows an attacker-controlled link
        ↓
NT AUTHORITY\SYSTEM
```

ALPC is the LPC successor used across Windows for privileged IPC. A heap overflow there from an AppContainer is a **sandbox escape**, not merely another local SYSTEM PoC. Update Stack LPE is the same class as other Windows servicing-path bugs: the update machinery runs privileged and trusts a path the user can influence.

Microsoft has not named the operators or confirmed successful breaches beyond “exploitation detected.”

## Impact

- Endpoints that skip September 2026 updates remain in a **known-exploited LPE** pair. EDR that assumes AppContainer is a hard wall is wrong for 85880 until patched.
- Update Stack EoP is especially ugly on rings that delay monthly updates but still run the servicing stack continuously.
- The record CVE count is an operations problem: do not let 974 IDs bury the two KEV rows.

## Mitigation

1. Deploy the **September 2026** Windows security updates. Verify the KBs for your SKU actually installed; this is not an engine-only Defender drop.
2. Hunt for unexpected SYSTEM children of low-integrity / AppContainer processes and for unusual Update Stack file operations from non-service accounts around 2026-09-08.
3. Keep [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414) on the Defender engine watchlist; Patch Tuesday does not close that claim.
4. Prioritize internet-facing Windows roles separately (DNS, DHCP, WDS RCEs in the same bundle) even though they are not this KEV pair.
5. Federal civilian agencies: KEV plus BOD 26-04 pre-patch compromise checks.

## Related Signals

- [ShieldCrash — incomplete ShieldBreak patch](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414)
- [CISA KEV September 8–9](/signals/cisa-kev-september-8-9-2026)
- [N-able N-central RCE](/signals/n-able-ncentral-rce-cve-2026-86218)
- [StyleSmuggler Magento RCE](/signals/stylesmuggler-adobe-commerce-rce-cve-2026-75650)

## Sources

- [CISA — four KEV additions (2026-09-08)](https://www.cisa.gov/news-events/alerts/2026/09/08/cisa-adds-four-known-exploited-vulnerabilities-catalog)
- [MSRC — CVE-2026-85880](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-85880)
- [MSRC — CVE-2026-81963](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-81963)
- [The Hacker News — record 974 patches, two exploited zero-days](https://thehackernews.com/2026/09/microsoft-patches-record-974-flaws.html) (2026-09-09)
- [CrowdStrike — September 2026 Patch Tuesday analysis](https://www.crowdstrike.com/en-us/blog/patch-tuesday-analysis-september-2026/)
