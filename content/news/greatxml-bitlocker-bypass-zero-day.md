---
title: "GreatXML: WinRE Defender Offline Scan BitLocker Bypass"
slug: "greatxml-bitlocker-bypass-zero-day"
date: 2026-06-11
type: news
category: news
tags: [microsoft, bitlocker, zero-day, windows, winre, defender, physical-access, bypass, unattend]
excerpt: "MSNightmare PoC plants unattend.xml and Recovery artifacts on the WinRE partition — Shift+Restart into Defender offline-scan state spawns a shell with BitLocker volume access; no CVE, contested reproduction."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/NightmareEclipse/GreatXML"
draft: false
---

## Summary

[GreatXML](https://git.projectnightcrawler.dev/NightmareEclipse/GreatXML) is a **BitLocker security feature bypass** published June 11, 2026 by the researcher operating as **MSNightmare** (formerly Nightmare-Eclipse). The PoC abuses the **Windows Recovery Environment (WinRE)** trust boundary left open when **Microsoft Defender Offline Scan** has previously run on a machine. By staging a crafted **`unattend.xml`** answer file and a modified **`Recovery`** directory at the root of the hidden recovery partition, an attacker with physical access can reboot into WinRE via **Shift + Restart** and trigger answer-file processing that spawns an **interactive command shell with unrestricted access to the BitLocker-protected OS volume**.

This is **not** a cryptographic break of BitLocker. The technique chains legitimate WinPE/WinRE setup automation — Windows answer files, offline-servicing passes, and Defender's offline-scan boot state — rather than exploiting memory corruption or kernel bugs. The researcher described the finding as an **accidental discovery** completed in roughly four hours, published hours after [RoguePlanet](/signals/rogueplanet-defender-lpe-zero-day) on the same cluster timeline.

**No CVE** has been assigned and **no vendor patch** addresses the root cause as of this entry. Independent reproduction is **contested**: security researcher Will Dormann reported that Shift-reboot alone does not enter Defender offline-scan mode on tested Windows 11 lineages, and that triggering an offline scan typically requires an authenticated admin session — access sufficient to disable BitLocker directly. Cyderes Howler Cell and ThreatLocker published defensive analysis treating the WinRE trust boundary as a real design-level concern regardless of trigger reliability.

OFFSITE.DARK indexes the public PoC and third-party analysis only.

## Technical Details

| Aspect | Detail |
|--------|--------|
| CVE | None assigned |
| Component | WinRE — Windows answer file processing + Defender Offline Scan boot state |
| Attack vector | Physical access (recovery partition write + WinRE boot) |
| Root cause | WinRE processes planted `unattend.xml` during offline-scan context with BitLocker volume mounted |
| Staging | `unattend.xml` + `Recovery` directory copied to recovery partition root |
| Trigger | Shift + Restart into WinRE; prior Defender Offline Scan on target (researcher claim) |
| PoC payload | `windowsPE` pass `RunSynchronousCommand` launches `conhost.exe` via WinPE script |
| Patch status | Unpatched; no MSRC advisory indexed |

### WinRE trust boundary

WinRE is a minimal Windows PE-based runtime used for repair, reset, and **Microsoft Defender Offline Scan**. Defender Offline must inspect the main OS partition from outside the running system — meaning WinRE boots with the BitLocker-protected volume **reachable** without the normal pre-boot authentication gate. Because WinRE shares setup infrastructure with Windows deployment, it also honors **unattend answer files** for automated configuration during servicing passes.

GreatXML weaponizes that overlap: a malicious answer file placed where WinRE discovery logic expects it can execute arbitrary commands while the encrypted volume is accessible in the offline-scan boot context.

### Reproduction sequence (PoC author)

**Path A — prior Defender Offline Scan on target (researcher claim):**

1. Copy repository **`unattend.xml`** and the **`Recovery`** directory to the **root of the recovery partition** (requires write access to the hidden recovery volume — typically admin-equivalent or physical disk access).
2. Reboot to WinRE using **Shift + click Restart** from the login screen or Start menu.
3. If staging and offline-scan state align, WinRE processes the planted answer file and spawns a shell with access to the BitLocker-protected volume.

**Path B — Defender Offline Scan never run:**

1. Attacker must **log in** and initiate Defender Offline Scan through Defender's interface (schedules scan on next WinRE boot), **or** find another way to enter WinRE in offline-scan state without authentication (researcher believes this is feasible; independent testers dispute automatic entry via Shift-reboot alone).
2. Follow staging steps above on subsequent WinRE boot.

### Answer file mechanics

The published `unattend.xml` uses [schneegans unattend-generator](https://schneegans.de/windows/unattend-generator/) structure. The critical execution path is in the **`windowsPE`** pass:

```xml
<RunSynchronousCommand wcm:action="add">
  <Order>1</Order>
  <Path>cmd.exe /c >>X:\pe.cmd (echo:start X:\Windows\System32\conhost.exe)</Path>
</RunSynchronousCommand>
<RunSynchronousCommand wcm:action="add">
  <Order>2</Order>
  <Path>cmd.exe /c "X:\pe.cmd"</Path>
</RunSynchronousCommand>
```

During WinPE/WinRE boot, this writes and executes a script that launches **`conhost.exe`** — yielding an interactive console in the recovery environment while the main volume remains mounted and readable. Additional passes (`specialize`, `oobeSystem`) include cleanup scripts that remove planted `unattend.xml` artifacts from `C:\Windows\Panther\` after execution, reducing forensic visibility on the OS volume.

The companion **`Recovery`** directory modifies WinRE reagent configuration so the planted answer file is discovered during the offline-scan boot workflow.

### Trust-chain implications

| Layer | GreatXML effect |
|-------|-----------------|
| BitLocker encryption | Not broken — keys remain protected at rest |
| Pre-boot gate | Bypassed via WinRE recovery path during offline-scan state |
| Prior offline scan | Researcher claims persistent vulnerable state without re-auth |
| Admin prerequisite for staging | Recovery partition write generally requires elevated or physical disk access |
| TPM+PIN mode | WinRE path may still expose volume depending on offline-scan mount policy |

## CVE

| Field | Value |
|-------|-------|
| CVE | **None assigned** |
| Vendor status | No MSRC advisory indexed as of June 2026 |
| Public PoC | Yes — GitHub, Project Nightcrawler, Church of Malware mirrors |
| Patched | No root-cause fix known |

## Impact

- **Offline data access** on BitLocker-protected devices if an attacker can write to the recovery partition and trigger WinRE in the correct Defender offline-scan context.
- **Physical-access and post-compromise scenarios** — staging requires recovery-partition modification; triggering without prior offline scan may require admin session per independent testers.
- **Persistent recovery-partition tampering** — planted artifacts survive OS credential rotation and may re-trigger on future WinRE boots until the recovery image is rebuilt.
- **Cluster signal** — eighth distinct Windows security surface from the same researcher (Defender LPE ×4, BitLocker bypass ×2, CTF LPE, Cloud Files regression); published immediately after RoguePlanet in the June 2026 release wave.

## Mitigation

1. **No root-cause patch exists** — treat recovery-partition integrity as part of BitLocker defense-in-depth.
2. Monitor for **`unattend.xml`** or **`ReAgent.xml`** creation or modification on the recovery partition or under `Recovery\WindowsRE\`.
3. Watch **Microsoft-Windows-Windows Defender/Operational Event ID 2030** (Defender offline scan scheduled for next reboot) on high-value endpoints.
4. Restrict **physical access**; use **firmware/BIOS boot passwords** and **TPM+PIN** BitLocker policy where operational policy allows.
5. Periodically **rebuild WinRE** from trusted media and verify recovery-partition contents on sensitive laptops (travel/field fleets).
6. Apply **June 2026 Patch Tuesday** and subsequent cumulative updates — while no GreatXML-specific fix is indexed, cluster hardening may reduce adjacent WinRE abuse paths.
7. Cross-reference [YellowKey](/signals/yellowkey-bitlocker-bypass-cve-2026-45585) mitigations for WinRE trust re-sealing after recovery-image changes.

## Sources

- [Project Nightcrawler — NightmareEclipse/GreatXML](https://git.projectnightcrawler.dev/NightmareEclipse/GreatXML) (primary PoC source)
- [GitHub — MSNightmare/GreatXML](https://github.com/MSNightmare/GreatXML) (public mirror)
- [Cyderes Howler Cell — GreatXML: Windows Zero-Day Turns Defender Offline Scan Into BitLocker Backdoor](https://www.cyderes.com/howler-cell/greatxml-windows-zero-day)
- [ThreatLocker — GreatXML: Exploiting the WinRE trust boundary behind BitLocker](https://www.threatlocker.com/blog/greatxml-exploiting-the-winre-trust-boundary-behind-bitlocker)
- [The Register — Nightmare Eclipse drops claimed BitLocker bypass](https://www.theregister.com/security/2026/06/11/nightmare-eclipse-drops-claimed-bitlocker-bypass-for-microsoft-windows/5254371)
- [OFFSITE.DARK — RoguePlanet cluster index](/signals/rogueplanet-defender-lpe-zero-day)
