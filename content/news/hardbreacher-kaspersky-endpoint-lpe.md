---
title: "HardBreacher: Kaspersky Endpoint Security Local Privilege Escalation"
slug: "hardbreacher-kaspersky-endpoint-lpe"
date: 2026-08-29
type: news
category: news
tags: [kaspersky, endpoint, privilege-escalation, windows, lpe, nightcrawler]
excerpt: "NightmareEclipse PoC against Kaspersky Endpoint Security UI process — SYSTEM-class disruption; Kaspersky says an automatic database update already closes it."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/explore/repos"
draft: false
---

## Summary

**HardBreacher** is a local privilege-escalation proof-of-concept NightmareEclipse published over the **2026-08-29** weekend against **Kaspersky Endpoint Security**. SecurityWeek (Eduard Kovacs, **2026-08-31**) is the primary independent write-up: the author described the public PoC as “duct taped,” and said that taking over the **UI process** lets an attacker stop Kaspersky from functioning, grant or block file access it should not control, and leave the OS in a “hot mess” if the chain succeeds.

Kaspersky told SecurityWeek the underlying issue **has been resolved**. The fix is delivered via **automatic update**; operators can force a database update manually. That is a product-content / component update path, not a Windows OS patch.

OFFSITE.DARK indexes the press confirmation and Nightcrawler cluster context. We did not obtain or reproduce the PoC.

## Key Findings

| Finding | Detail |
|---------|--------|
| Product | Kaspersky Endpoint Security (Windows) |
| Class | Local privilege escalation / security-product integrity break |
| Author framing | Control of the UI process → product malfunction + unauthorized file grant/block |
| PoC quality (author) | Rough; “just managed to make it work” |
| Published | Weekend of 2026-08-29 |
| Vendor status | Patched via automatic (or manual) database update |
| Network RCE | No |

## What matters for operators

Security products that run privileged UI or helper processes are a recurring NightmareEclipse theme (Defender remediation, Avast sandbox, Falcon Office-macro cleanup). HardBreacher’s public claim is that **owning the Kaspersky UI process** is enough to invert the product’s access-control decisions. Even a messy PoC is a signal that endpoint-security process isolation and UI/service privilege separation need review.

Vendor speed here was the opposite of Microsoft’s ShieldBreak timeline: Kaspersky asserted a **content update** close within days of the drop, while Microsoft’s engine 1.1.26080.3 arrived 2026-09-03 and is already contested by [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414).

## Cluster context

| Tool | Vendor | Status (as indexed) |
|------|--------|---------------------|
| [ShieldBreak](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414) | Microsoft Defender | CVE-2026-69414 — engine 1.1.26080.3 (2026-09-03) |
| [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414) | Microsoft Defender | Incomplete 69414 patch — SYSTEM file read claimed |
| [PrettyPrague](/signals/prettyprague-avast-sandbox-lpe) | Avast / Gen Digital | Fix in product updates |
| **HardBreacher** | Kaspersky | Automatic database update |
| [FalconFlank](/signals/falconflank-crowdstrike-falcon-lpe) | CrowdStrike | Workaround (disable Office macro-removal) |
| [GreenSection](/signals/greensection-nvidia-shared-section) | NVIDIA | Investigating |

## Impact

- Unpatched Kaspersky Endpoint Security hosts: local user may disrupt AV policy and file-access mediation, not merely crash a tray icon.
- “Hot mess” OS state after success implies **availability and integrity** impact on the endpoint, which is operationally equivalent to disabling the security stack during an intrusion.
- Content-update patches can leave **air-gapped or update-deferred** fleets exposed longer than the vendor headline suggests.

## Mitigation

1. Confirm Kaspersky databases / component updates after 2026-08-29 on every Endpoint Security build; trigger a manual update on lagged rings.
2. Hunt for unexpected modification of Kaspersky UI/service processes and sudden policy flips (allow/block) without admin change tickets.
3. Air-gapped KSC/KES deployments: schedule an out-of-band content pull.
4. Do not assume Windows Patch Tuesday covers this — it is a Kaspersky product update.

## Related Signals

- [PrettyPrague — Avast sandbox LPE](/signals/prettyprague-avast-sandbox-lpe)
- [ShieldBreak — Defender patch bypass](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414)
- [ShieldCrash — incomplete 69414 patch](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414)
- [FalconFlank — CrowdStrike Falcon LPE](/signals/falconflank-crowdstrike-falcon-lpe)
- [LegacyHive](/signals/legacyhive-profsvc-hive-load-zero-day)

## Sources

- [SecurityWeek — Nightmare Eclipse Drops HardBreacher](https://www.securityweek.com/nightmare-eclipse-drops-hardbreacher-kaspersky-product-exploit/) (2026-08-31)
- [Project Nightcrawler explore](https://git.projectnightcrawler.dev/explore/repos) — Kaspersky Endpoint 0day listing (updated 2026-08-29)
