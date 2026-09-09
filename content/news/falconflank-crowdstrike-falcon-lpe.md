---
title: "FalconFlank: CrowdStrike Falcon Sensor Local Privilege Escalation"
slug: "falconflank-crowdstrike-falcon-lpe"
date: 2026-09-03
type: news
category: news
tags: [crowdstrike, falcon, zero-day, privilege-escalation, windows, lpe, edr, nightcrawler]
excerpt: "NightmareEclipse PoC abuses Falcon’s Microsoft Office malicious-macro remediation path for SYSTEM LPE on Win11 25H2 / Server 2025; CrowdStrike investigating, workaround is to disable that policy."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/NightmareEclipse/FalconFlank"
draft: false
---

## Summary

[FalconFlank](https://git.projectnightcrawler.dev/NightmareEclipse/FalconFlank) is a local privilege-escalation proof-of-concept published **2026-09-03** by NightmareEclipse / MSNightmare against **CrowdStrike Falcon Sensor**. The author states the chain abuses Falcon’s **Microsoft Office file malicious macro removal** remediation on fully updated Windows 11 25H2 and Windows Server 2025 with Falcon **Phase 3 Optimal Protection**, and that detections for the published sample should already exist — testers would need exclusions or a rewritten loader.

This is not remote code execution. It requires code already running as a local user, plus the Office-macro remediation policy enabled. CrowdStrike told press it is investigating; the interim control named in third-party coverage is to **disable that Office malicious-macro remediation policy** until a sensor fix ships.

OFFSITE.DARK indexes the Nightcrawler drop and vendor-status reporting. We did not discover or weaponize this flaw.

## Key Findings

| Finding | Detail |
|---------|--------|
| Product | CrowdStrike Falcon Sensor (Windows) |
| Class | Local privilege escalation (user → SYSTEM) |
| Trigger surface | Office malicious-macro file remediation |
| Claimed lab target | Win11 25H2 / Server 2025, Phase 3 Optimal Protection |
| Network RCE | No |
| Published | 2026-09-03 on Project Nightcrawler |
| Vendor status (as of 2026-09-07 coverage) | Investigation ongoing; workaround recommended |
| Author note | Expect Falcon detections on the unmodified PoC |

## What is claimed

Falcon’s Office-macro remediation is a privileged, automated response path: the sensor acts on a file the product has already classified as malicious. The published write-up treats that privileged handler as the integrity-crossing step. Details of the loader technique are omitted here; the defensive fact is that **EDR self-remediation of Office documents is now a documented LPE surface** on this cluster.

CrowdStrike detections for the stock binary do not close the class of bug. The author explicitly flags obfuscation / alternate DLL-load methods as the way a tester (or an adapter) would slip the sample.

## Cluster context

FalconFlank is the CrowdStrike-facing member of the late-August / early-September NightmareEclipse AV/EDR expansion, alongside [ShieldBreak](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414) / [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414) (Defender), [PrettyPrague](/signals/prettyprague-avast-sandbox-lpe) (Avast), [HardBreacher](/signals/hardbreacher-kaspersky-endpoint-lpe) (Kaspersky), and [GreenSection](/signals/greensection-nvidia-shared-section) (NVIDIA).

## Impact

- Hosts that turned on Falcon’s Office macro-removal feature for defense-in-depth gain a **new local SYSTEM path** if the published class of bug is real and unpatched.
- Enterprises that treat Falcon as the containment layer after a phishing macro still need a **local-code-execution** story; this PoC is that second stage, not the initial foothold.
- Sample-specific Falcon detections are a speed bump, not a patch.

## Mitigation

1. Until CrowdStrike ships a sensor fix: disable **Microsoft Office file malicious macro removal** on Windows Falcon policies if operationally acceptable; keep other macro-blocking (ASR, Office cloud policy, Mark-of-the-Web) in place.
2. Hunt for unexpected SYSTEM activity immediately after Falcon Office-file remediation events.
3. Do not add the published PoC to exclusions outside isolated labs.
4. Track CrowdStrike detection and sensor-build notes for FalconFlank / Office-macro remediation hardening.
5. Treat Nightcrawler appearance as a watchlist item; block forge egress where policy requires.

## Related Signals

- [ShieldBreak — Defender patch bypass](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414)
- [ShieldCrash — incomplete 69414 patch](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414)
- [PrettyPrague — Avast sandbox LPE](/signals/prettyprague-avast-sandbox-lpe)
- [HardBreacher — Kaspersky Endpoint LPE](/signals/hardbreacher-kaspersky-endpoint-lpe)
- [RoguePlanet](/signals/rogueplanet-defender-lpe-zero-day)

## Sources

- [Project Nightcrawler — NightmareEclipse/FalconFlank](https://git.projectnightcrawler.dev/NightmareEclipse/FalconFlank)
- [igor’sLAB — Nightmare Eclipse PoCs against NVIDIA, CrowdStrike, and Avast](https://www.igorslab.de/en/nightmare-eclipse-releases-pocs-against-nvidia-crowdstrike-avast-patch-status-varies/) (2026-09-08)
- SecurityWeek vendor-status roundup (2026-09-07)
