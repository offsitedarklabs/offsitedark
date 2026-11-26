---
title: "RoguePlanet: Defender quarantine LPE (CVE-2026-50656)"
slug: "rogueplanet-defender-lpe-zero-day"
date: 2026-06-10
type: news
category: news
tags: [microsoft, defender, privilege-escalation, windows, cve, lpe]
excerpt: "Published 10 June 2026 with no CVE. Assigned CVE-2026-50656 on 16 June. Fixed in Malware Protection Engine 1.1.26060.3008. Not in KEV."
source: "Microsoft"
sourceUrl: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-50656"
draft: false
---

## What it is

[RoguePlanet](https://github.com/MSNightmare/RoguePlanet) was published 10 June 2026 by the researcher then using the name MSNightmare, the day after the June cumulatives. Cyderes Howler Cell reproduced it on a fully patched Windows 11 host that same day. A standard user ends up as `NT AUTHORITY\SYSTEM` by racing Defender’s quarantine pipeline: oplocks, NTFS junctions, a volume shadow copy, and the Windows Error Reporting QueueReporting task. No kernel corruption and no administrator group membership.

On 10 June that was accurate as “no CVE, no engine fix.” It is not accurate now.

## The fix

[MSRC CVE-2026-50656](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-50656), released 16 June 2026. Microsoft Defender / Malware Protection Engine. CWE-59. Microsoft’s CVSS 3.1 is 7.8 with `AC:L`. NVD’s primary score, record status Modified as of 25 October 2026, is 7.0 with `AC:H`. Microsoft’s secondary score on NVD stays 7.8.

| | |
|---|---|
| Last affected engine | 1.1.26050.11 |
| First fixed engine | 1.1.26060.3008 |
| NVD affected range | 1.1.0.0 before 1.1.26060.3008 |
| Exploited, per MSRC | No |
| Publicly disclosed, per MSRC | Yes |

The CVE record still carries a temporal `RL:U` on the CNA vector (record updated 19 November 2026). The FAQ on the advisory is the engine floor above. Use the FAQ.

```powershell
Get-MpComputerStatus | Select-Object AMEngineVersion, AMProductVersion, RealTimeProtectionEnabled
```

`AMEngineVersion` needs to be at least `1.1.26060.3008`.

The published sample is detected as `Exploit:Win32/DfndrRugPlnt.BB`. Cyderes treats that signature as sample-specific. The engine update is the fix. The author noted the race is unreliable, and that the published tool fails for a standard user on Windows Server because that user cannot mount an ISO. The advisory does not say Server is unaffected.

## Checked 26 November 2026

| Item | Result |
|------|--------|
| CISA KEV catalog 2026.11.25 | Not listed |
| FIRST EPSS, 25 November 2026 | Score 0.00368, percentile 0.22779 |
| Public code | [MSNightmare/RoguePlanet](https://github.com/MSNightmare/RoguePlanet) |

## What to alert on

These names are from the published tool. A rewrite would change them. The parent-process check does not depend on the names.

| Indicator | Why it is useful |
|-----------|------------------|
| `\\.\pipe\RoguePlanet` | Named pipe in the published binary |
| `%TEMP%\RP_*\wdtest_temp` and `%TEMP%\RP_*\System32\wermgr.exe` | Working tree the published tool creates |
| `MsMpEng.exe` spawning `conhost.exe`, `cmd.exe`, or `powershell.exe` as SYSTEM | Defender is not supposed to hand an interactive shell to a user session |
| A user process triggering the WER QueueReporting task | The published chain uses Task Scheduler COM for that |

## Cluster

Same author, April through September 2026. Rows are the status of each tool’s own Signal, not a claim that one engine build closes the others.

| Tool | CVE | Status |
|------|-----|--------|
| [BlueHammer](/signals/bluehammer-defender-lpe-cve-2026-33825) | CVE-2026-33825 | Platform 4.18.26030.3011. KEV 22 April 2026 |
| [RedSun](/signals/redsun-defender-lpe-cve-2026-41091) | CVE-2026-41091 | May 2026 out-of-band. KEV |
| [UnDefend](/signals/undefend-defender-dos-cve-2026-45498) | CVE-2026-45498 | May 2026 out-of-band. KEV |
| [YellowKey](/signals/yellowkey-bitlocker-bypass-cve-2026-45585) | CVE-2026-45585 | 9 June 2026 cumulative |
| [GreenPlasma](/signals/greenplasma-ctfmon-lpe-cve-2026-45586) | CVE-2026-45586 | 9 June 2026 cumulative |
| [MiniPlasma](/signals/miniplasma-cldflt-lpe-cve-2020-17103) | CVE-2020-17103 | 9 June 2026 cumulative |
| RoguePlanet | CVE-2026-50656 | Engine 1.1.26060.3008. Not in KEV |
| [GreatXML](/signals/greatxml-bitlocker-bypass-zero-day) | No advisory uses this name | See that Signal |
| [ShieldBreak](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414) / [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414) | CVE-2026-69414 | Later engine line |

## Sources

- [MSRC — CVE-2026-50656](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-50656)
- [Cyderes Howler Cell](https://www.cyderes.com/howler-cell/rogueplanet-windows-zero-day)
- [BleepingComputer, 10 June 2026](https://www.bleepingcomputer.com/news/microsoft/microsoft-defender-rogueplanet-zero-day-grants-system-privileges/)
- [FIRST EPSS](https://api.first.org/data/v1/epss?cve=CVE-2026-50656)
