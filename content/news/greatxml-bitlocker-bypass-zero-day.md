---
title: "GreatXML: claimed WinRE BitLocker bypass"
slug: "greatxml-bitlocker-bypass-zero-day"
date: 2026-06-11
type: news
category: news
tags: [microsoft, bitlocker, windows, winre, defender, physical-access]
excerpt: "11 June 2026 PoC. No MSRC advisory uses the name GreatXML. A later BitLocker CVE, CVE-2026-50661, is a different record and is not this patch. Independent reproduction was already contested on day one."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/NightmareEclipse/GreatXML"
draft: false
---

## What it is

[GreatXML](https://git.projectnightcrawler.dev/NightmareEclipse/GreatXML) was published 11 June 2026, the day after RoguePlanet. The claim: if Microsoft Defender Offline Scan has run on a machine, an attacker who can write `unattend.xml` and a `Recovery` directory to the hidden recovery partition can reboot into WinRE and get a console while the BitLocker volume is mounted. That is a trust-boundary claim about WinRE setup, not a break of the BitLocker cipher.

Staging needs a write to the recovery partition, which is administrator-equivalent or physical disk access. The author said Shift+Restart is enough when an offline scan has already run. Will Dormann reported that Shift+Restart does not enter Defender offline-scan mode on the Windows 11 builds he tested, and that starting an offline scan normally takes an authenticated administrator, who can already suspend BitLocker. Cyderes and ThreatLocker still treat the WinRE answer-file path as a design problem even if the trigger is unreliable.

## What it is not

No MSRC advisory uses the name GreatXML. Two later BitLocker records are easy to mix up with it. Neither one identifies this tool.

| CVE | Date | What the advisory actually says |
|-----|------|----------------------------------|
| CVE-2026-50507 | 9 June 2026 cumulative | Another BitLocker bypass in that month’s release. [BleepingComputer](https://www.bleepingcomputer.com/news/microsoft/microsoft-june-2026-patch-tuesday-fixes-6-zero-days-200-flaws/) and Will Dormann associate it with Jonas Lykkegaard’s bitskrieg report, not with GreatXML |
| CVE-2026-50661 | 14 July 2026 | Physical BitLocker security-feature bypass, CWE-693. Microsoft CVSS 3.1 6.1. NVD primary 4.6 (`C:H/I:N/A:N`). Fixed builds include 24H2 before 10.0.26100.8875, 25H2 before 10.0.26200.8875, 26H1 before 10.0.28000.2525, Server 2025 before 10.0.26100.33158. The text does not name GreatXML |

Do not close a GreatXML hunt by installing the July cumulative and calling it done. Install it anyway. It fixes CVE-2026-50661.

## Checked 26 November 2026

| Item | Result |
|------|--------|
| KEV / EPSS under the name GreatXML | None. There is no CVE to look up |
| CVE-2026-50661 in KEV catalog 2026.11.25 | Not listed |
| CVE-2026-50661 EPSS, 25 November 2026 | Score 0.00481, percentile 0.33960. Exploited, per MSRC: No |
| Public code | [NightmareEclipse/GreatXML](https://git.projectnightcrawler.dev/NightmareEclipse/GreatXML), [MSNightmare/GreatXML](https://github.com/MSNightmare/GreatXML) |

Things that are still worth alerting on, because they are the artifacts the published tool writes:

- `unattend.xml` or `ReAgent.xml` created on the recovery partition or under `Recovery\WindowsRE\`
- Microsoft-Windows-Windows Defender/Operational event 2030 (offline scan scheduled for the next boot) on a machine that should not be doing that
- A recovery partition whose contents no longer match the WinRE image you deployed

TPM+PIN does not depend on this PoC being reliable. [YellowKey](/signals/yellowkey-bitlocker-bypass-cve-2026-45585) is the June cumulative’s named BitLocker fix from the same author. Rebuild WinRE from trusted media on laptops that leave the building, and compare the partition to that image.

## Sources

- [Project Nightcrawler](https://git.projectnightcrawler.dev/NightmareEclipse/GreatXML)
- [Cyderes](https://www.cyderes.com/howler-cell/greatxml-windows-zero-day)
- [ThreatLocker](https://www.threatlocker.com/blog/greatxml-exploiting-the-winre-trust-boundary-behind-bitlocker)
- [The Register, 11 June 2026](https://www.theregister.com/security/2026/06/11/nightmare-eclipse-drops-claimed-bitlocker-bypass-for-microsoft-windows/5254371)
- [MSRC — CVE-2026-50661](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-50661)
- [BleepingComputer, June 2026 Patch Tuesday](https://www.bleepingcomputer.com/news/microsoft/microsoft-june-2026-patch-tuesday-fixes-6-zero-days-200-flaws/)
