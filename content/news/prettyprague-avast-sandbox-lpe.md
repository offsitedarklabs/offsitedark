---
title: "PrettyPrague: Avast Sandbox Elevation of Privilege"
slug: "prettyprague-avast-sandbox-lpe"
date: 2026-08-30
type: news
category: news
tags: [avast, gen-digital, sandbox, privilege-escalation, windows, lpe, nightcrawler]
excerpt: "NightmareEclipse PoC claims SYSTEM via Avast Antivirus sandbox on patched Win11 25H2, including SAM dump; Gen Digital says a fix is in product updates."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/NightmareEclipse/PrettyPrague"
draft: false
---

## Summary

[PrettyPrague](https://git.projectnightcrawler.dev/NightmareEclipse/PrettyPrague) is a local elevation-of-privilege proof-of-concept published **2026-08-30** by NightmareEclipse against **Gen Digital Avast Antivirus**. The author claims the chain works against fully patched Avast on Windows 11 25H2, abuses a vulnerability in the **Avast sandbox**, dumps the **SAM** database, and spawns a SYSTEM shell. The README also speculates that sibling Gen Digital products (AVG, Norton) may share the surface.

Gen Digital confirmed to SecurityWeek that a vulnerability existed in some of its products, including Avast Antivirus, and stated the issue has since been **fixed in software updates**. Widespread exploitation has not been confirmed in the coverage indexed here.

OFFSITE.DARK indexes the Nightcrawler drop and vendor confirmation. We did not discover or weaponize this flaw.

## Key Findings

| Finding | Detail |
|---------|--------|
| Product | Avast Antivirus (author: any version at drop time); possible Gen Digital family overlap |
| Class | Local privilege escalation via sandbox |
| Claimed outcome | SYSTEM shell + SAM dump |
| Lab claim | Fully patched Avast + Windows 11 25H2 |
| Published | 2026-08-30 |
| Vendor status (as of 2026-09-07) | Fix released (Gen Digital / SecurityWeek) |
| Network RCE | No — local code execution required |

## What is claimed

Antimalware sandboxes run privileged inspection of untrusted files. PrettyPrague’s public claim is that a logic/trust bug in that sandbox lets a local user coerce privileged Avast components into dumping credential material and launching a SYSTEM shell. Implementation details of the PoC are omitted here.

The interesting vendor fact is speed: unlike [ShieldBreak](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414) (Microsoft shipped engine 1.1.26080.3 on 2026-09-03; [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414) already contests that close-out) and [FalconFlank](/signals/falconflank-crowdstrike-falcon-lpe) (workaround-only), Gen Digital is reported as **already patched**.

## Cluster context

PrettyPrague sits in the same late-August / early-September NightmareEclipse AV/EDR cluster as [HardBreacher](/signals/hardbreacher-kaspersky-endpoint-lpe), [GreenSection](/signals/greensection-nvidia-shared-section), [FalconFlank](/signals/falconflank-crowdstrike-falcon-lpe), [ShieldBreak](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414), and [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414).

## Impact

- Unpatched Avast (and possibly related Gen Digital SKUs) become a **SYSTEM escalation path** after a standard-user foothold.
- SAM dump in the published outcome is a **credential-theft** event, not just a demo shell — rotate local/domain secrets if a host ran the vulnerable product after 2026-08-30 without the vendor update.
- Sibling-product speculation (AVG/Norton) means inventory should not stop at the Avast brand.

## Mitigation

1. Apply current Avast / Gen Digital product updates; confirm the PrettyPrague-era sandbox fix is present.
2. Inventory AVG, Norton, and other Gen Digital endpoint SKUs for the same update train.
3. If a host was exposed: treat as potential SAM/credential exposure; rotate local admin and cached secrets; hunt for unexpected SYSTEM shells around Avast sandbox activity.
4. Do not run Nightcrawler samples on production images.

## Related Signals

- [HardBreacher — Kaspersky Endpoint LPE](/signals/hardbreacher-kaspersky-endpoint-lpe)
- [FalconFlank — CrowdStrike Falcon LPE](/signals/falconflank-crowdstrike-falcon-lpe)
- [ShieldBreak — Defender patch bypass](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414)
- [ShieldCrash — incomplete 69414 patch](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414)
- [GreenSection — NVIDIA shared section](/signals/greensection-nvidia-shared-section)

## Sources

- [Project Nightcrawler — NightmareEclipse/PrettyPrague](https://git.projectnightcrawler.dev/NightmareEclipse/PrettyPrague)
- [igor’sLAB — patch-status roundup](https://www.igorslab.de/en/nightmare-eclipse-releases-pocs-against-nvidia-crowdstrike-avast-patch-status-varies/) (2026-09-08)
- SecurityWeek — Gen Digital confirmation of a fix (2026-09-07)
