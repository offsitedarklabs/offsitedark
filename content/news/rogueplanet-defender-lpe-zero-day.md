---
title: "RoguePlanet: Defender Quarantine Pipeline LPE Zero-Day"
slug: "rogueplanet-defender-lpe-zero-day"
date: 2026-06-10
type: news
category: news
tags: [microsoft, defender, zero-day, privilege-escalation, windows, toctou, lpe, local]
excerpt: "MSNightmare PoC races Defender's quarantine pipeline via NTFS junctions and oplocks to reach NT AUTHORITY\\SYSTEM — no CVE, no patch, reproduced on fully patched Win11."
source: "Cyderes Howler Cell"
sourceUrl: "https://www.cyderes.com/howler-cell/rogueplanet-windows-zero-day"
draft: false
---

## Summary

[RoguePlanet](https://github.com/MSNightmare/RoguePlanet) is a local privilege escalation zero-day published June 10, 2026 by the researcher operating as **MSNightmare** (formerly Nightmare-Eclipse / Chaotic Eclipse / Dead Eclipse). Hours after Microsoft shipped June 2026 Patch Tuesday fixes for earlier entries in the same exploit cluster (GreenPlasma, YellowKey, MiniPlasma), the seventh tool in the series appeared on GitHub with no coordinated disclosure, **no CVE**, and **no vendor patch** for the root cause.

Cyderes Howler Cell reproduced the chain on a fully patched Windows 11 host. The technique elevates a standard unprivileged user to **NT AUTHORITY\\SYSTEM** without kernel memory corruption, without admin rights, and without disabling Defender — by weaponizing Defender's own real-time scan and quarantine pipeline, NTFS directory junctions, opportunistic locks, Volume Shadow Copy, and the Windows Error Reporting **QueueReporting** scheduled task.

Microsoft Defender signatures detect the published compiled sample as **Exploit:Win32/DfndrRugPlnt.BB**. Cyderes and independent researchers confirm that detection is sample-specific; minor source changes defeat static signatures while the behavioral chain remains viable.

OFFSITE.DARK indexes this entry from [Cyderes Howler Cell analysis](https://www.cyderes.com/howler-cell/rogueplanet-windows-zero-day) and the [public PoC repository](https://github.com/MSNightmare/RoguePlanet). We did not discover or weaponize this flaw.

## Key Findings

| Finding | Detail |
|---------|--------|
| Privilege gain | Standard user → `NT AUTHORITY\\SYSTEM` |
| Root cause class | Design-level TOCTOU race in Defender remediation + NTFS reparse handling |
| Prerequisites | Real-time protection enabled; WER scheduled infrastructure present |
| Patch status | No CVE assigned; no root-cause fix as of indexed analysis |
| Static detection | `Exploit:Win32/DfndrRugPlnt.BB` (compiled PoC only) |
| Reliability | Researcher reports hit-or-miss; 100% on some lab hosts, failure on others |
| Server SKUs | PoC fails for standard users (ISO mount restriction); underlying primitive may still apply |

## The Nightmare-Eclipse Cluster

One researcher, multiple aliases, eight Windows zero-days in roughly ten weeks — all targeting Microsoft Defender or adjacent Windows security components. None went through coordinated disclosure.

| Tool | CVE | Patch status |
|------|-----|--------------|
| [BlueHammer](/signals/bluehammer-defender-lpe-cve-2026-33825) | CVE-2026-33825 | Patched April 2026; CISA KEV |
| [RedSun](/signals/redsun-defender-lpe-cve-2026-41091) | CVE-2026-41091 | Patched May 2026 OOB; CISA KEV |
| [UnDefend](/signals/undefend-defender-dos-cve-2026-45498) | CVE-2026-45498 | Patched May 2026 OOB; CISA KEV |
| [YellowKey](/signals/yellowkey-bitlocker-bypass-cve-2026-45585) | CVE-2026-45585 | Patched June 2026 Patch Tuesday |
| [GreenPlasma](/signals/greenplasma-ctfmon-lpe-cve-2026-45586) | CVE-2026-45586 | Patched June 2026 Patch Tuesday |
| [MiniPlasma](/signals/miniplasma-cldflt-lpe-cve-2020-17103) | CVE-2020-17103 (researcher attribution) | Patched June 2026 Patch Tuesday |
| **RoguePlanet** | **None** | **Unpatched** |
| [GreatXML](/signals/greatxml-bitlocker-bypass-zero-day) | **None** | **Unpatched** |

Prior tools from this cluster have moved beyond proof-of-concept. Huntress documented real-world intrusion chains using BlueHammer, RedSun, and UnDefend. RoguePlanet extends the same primitive family after Microsoft silently hardened `mpengine!SysIO*` APIs in mid-May 2026, breaking many junction-based paths — including an earlier SMB/.vhd(x) remote execution design the researcher originally built.

> *"Microsoft cannot unwrite my code."* — Researcher blog post cited in Cyderes analysis, following GitHub/GitLab account terminations in May 2026.

## What Is the Vulnerability?

RoguePlanet is not a memory safety bug. It is a **sequence vulnerability**: each stage uses legitimate Windows behavior; the unsafe outcome exists only when they are chained.

Cyderes describes the core gap as the interval between when Defender **creates** a quarantine artifact and when it **validates** where that artifact actually landed. During that window:

1. Opportunistic locks pause Defender at a deterministic point in file I/O.
2. NTFS junction swaps redirect Defender's privileged writes into attacker-controlled directories.
3. A captured SYSTEM-owned quarantine file is overwritten with the exploit binary.
4. A final junction makes `%TEMP%\\RP_<uuid>\\System32\\wermgr.exe` resolve identically to `C:\\Windows\\System32\\wermgr.exe`.
5. The **QueueReporting** WER scheduled task — triggerable by an unprivileged user via Task Scheduler COM — executes the planted binary as SYSTEM.

Defender does the privileged file write. WER does the SYSTEM execution. The attacker only orchestrates timing and path redirection.

## Attack Chain (Seven Stages)

### Stage 1 — Dual-mode entry

The binary is self-referential. At startup it checks `IsRunningAsLocalSystem()`:

- **SYSTEM path:** Connect to `\\\\.\\pipe\\RoguePlanet`, locate the interactive session of the user who launched the unprivileged instance, spawn `conhost.exe` into that session under SYSTEM.
- **User path:** Run the full orchestrator chain below.

The named pipe `\\\\.\\pipe\\RoguePlanet` is a high-confidence indicator against the **published PoC** (actors adapting the technique would rename it).

### Stage 2 — I/O saturation (Poseidon subsystem)

On hosts with more than three logical cores, the PoC starts a generator thread plus one worker thread per core, each writing random data to unique temp files in tight loops. Threads wait on an event until the oplock race window opens. Purpose: sustained scheduler and I/O pressure so oplock timing becomes **deterministic in lab conditions** rather than probabilistic.

The `RoguePlanet` named pipe server is created here and held open until the elevated payload connects back.

### Stage 3 — ISO extraction and directory mirror

An ISO is embedded in the binary's data section, written to a UUID-named temp file, and mounted read-only without a drive letter. The PoC references the device via raw NT path `\\Device\\CdRom*`, bypassing Win32 restrictions. The ISO contains a `wermgr.exe` carrying the **EICAR** test signature.

Working directory under `%TEMP%`:

```text
%TEMP%\RP_<uuid>\
  wdtest_temp\          ← quarantine capture zone
  System32\
    wermgr.exe          ← EICAR drop (path mirrors C:\Windows\System32\wermgr.exe)
```

This structural mirroring is deliberate: the scan path passed to Defender becomes `%TEMP%\\RP_\\System32\\wermgr.exe`, indistinguishable in shape from the legitimate WER binary path.

### Stage 4 — EICAR delivery, VSS polling, oplock placement

The EICAR file is written to `System32\\wermgr.exe`. An NTFS **alternate data stream** `:WDFOO` is created via low-level NT APIs (bypassing Win32 ADS restrictions). Poseidon I/O threads are released.

A thread resolves exports from `MpClient.dll` at runtime and triggers a Defender scan through the Defender RPC interface with flags that activate **full remediation**.

Separately, `ShadowCopyFinderThread` polls `\\Device` for new `HarddiskVolumeShadowCopy*` objects created during Defender remediation. Once a shadow copy appears, the exploit constructs the path to the EICAR's `:WDFOO` ADS through that volume and places an **oplock**. When Defender opens the ADS via VSS, the oplock fires — Defender pauses mid-operation with a controlled window for junction swaps.

### Stage 5 — Junction swap chain and quarantine capture

While Defender is paused:

1. Convert `System32` to a junction targeting the mounted ISO — Defender resumes and sees the legitimate-looking ISO `wermgr.exe` instead of the EICAR.
2. Watch `C:\\Windows` recursively for Defender creating `Temp\\TMP` + exactly sixteen trailing characters — signals active quarantine workflow.
3. Swap the junction so `System32` points to `wdtest_temp`.
4. Write a second EICAR through the junction into `wdtest_temp`.
5. Byte-range lock the ISO `wermgr.exe` so Defender cannot remove it; Defender creates a **quarantine placeholder** instead, landing in `wdtest_temp` via the active junction.
6. Monitor size changes in `wdtest_temp` and capture the full path of the **SYSTEM-owned** quarantine artifact.

### Stage 6 — Payload injection and final junction to `C:\\Windows`

Remove the reparse point from the persistent handle to `System32`, reverting to a plain directory. Open the captured quarantine file with write access and overwrite it with the exploit binary from the current process image — retaining SYSTEM ownership and metadata Defender assigned.

Rename working artifacts to random UUID paths via `NtSetInformationFile` / `FileRenameInformationEx`, preserving open handles while freeing original path names. Convert `%TEMP%\\RP_<uuid>` into a junction targeting **`C:\\Windows`**. After this, `%TEMP%\\RP_<uuid>\\System32\\wermgr.exe` transparently resolves like `C:\\Windows\\System32\\wermgr.exe`.

### Stage 7 — WER QueueReporting trigger

Use Task Scheduler COM to trigger **QueueReporting** inside the Windows Error Reporting task folder. The task runs as SYSTEM and invokes `wermgr.exe` at the System32 path — which now resolves to the exploit binary.

The elevated binary enters the SYSTEM branch, connects to `\\\\.\\pipe\\RoguePlanet`, and spawns an interactive SYSTEM shell (`conhost.exe`) in the user's session. The orchestrator's blocking `ConnectNamedPipe` unblocks; success is confirmed.

## PoC Author Notes (GitHub)

From the [MSNightmare/RoguePlanet README](https://github.com/MSNightmare/RoguePlanet):

> The exploit is a race condition, so it's a hit or miss. I have managed to get a 100% success rate on some machines while it struggled to work on others.

> The exploit has been tested in Windows 11 (Official channel + Canary) and Windows 10 with june 2026 patch installed. The PoC however does not work in Windows Server since standard users cannot mount an ISO image… All Windows Server installations are vulnerable as well, you just need to redesign the exploit.

> If the exploit succeeds, a SYSTEM shell will be spawned.

The researcher notes mid-May Defender engine changes to `mpengine!SysIO*` broke the original remote SMB/.vhd(x) design, prompting the LPE rewrite.

## Impact

- **Local privilege escalation** on enterprise workstations where Defender real-time protection is enabled by default.
- **Post-compromise escalation** from any standard user session — relevant to phishing footholds, stolen session tokens, and insider scenarios.
- **Trust inversion**: the endpoint security product becomes the privileged write primitive.
- **Detection gap**: signature coverage on the compiled sample does not close the technique; behavioral monitoring is the primary control until a root-cause patch ships.
- **Cluster continuity**: seventh release in ten weeks from the same actor; prior tools already appear in live attack chains.

Confirmed **not** requiring: kernel exploit, memory corruption, admin group membership, or Defender disablement.

## Detection Indicators

Cyderes recommends behavioral detection over static hashes. High-value signals:

| Indicator | Notes |
|-----------|-------|
| `\\.\pipe\RoguePlanet` | PoC-specific; rename likely in adapted malware |
| `%TEMP%\RP_*\wdtest_temp` | Consistent working-directory artifact |
| `%TEMP%\RP_*\System32\wermgr.exe` | Mirror path for WER binary |
| `MsMpEng.exe` → interactive shell ancestry | `cmd.exe`, `conhost.exe`, `powershell.exe`, `cscript.exe`, `wscript.exe` at SYSTEM from Defender parent is near-certain exploitation |
| VSS enumeration from user processes | `NtQueryDirectoryObject` on `HarddiskVolumeShadowCopy*` outside backup agents |
| Task Scheduler COM trigger of QueueReporting | Unprivileged user firing WER reporting task |
| Defender signature | `Exploit:Win32/DfndrRugPlnt.BB` on known sample |

Filesystem artifact sequence (same process, close timing):

```text
%TEMP%\RP_<uuid>\wdtest_temp
%TEMP%\RP_<uuid>\System32
%TEMP%\RP_<uuid>\System32\wermgr.exe
```

## Mitigation

1. **No root-cause patch exists** — treat as active zero-day exposure on patched Windows 10/11 workstations.
2. Prioritize **behavioral EDR rules** for Defender-spawned interactive shells, WER task abuse, and suspicious `%TEMP%\RP_*` directory trees.
3. **Application allowlisting** (Cyderes/Picus): block unsigned or unexpected binaries executed via WER task paths even when the path string looks like System32.
4. Restrict **ISO mount** permissions for standard users where policy allows (blocks published PoC on Server; not a complete fix on client SKUs).
5. Monitor Task Scheduler COM usage triggering WER folder tasks from non-system contexts.
6. Track Microsoft security advisories for Defender engine updates addressing quarantine path validation.
7. Assume **cluster reuse**: prior Nightmare-Eclipse tools already appear in intrusion chains — isolate and investigate any matching TTPs immediately.

## Timeline

| Date | Event |
|------|-------|
| 2026-04-03 | First Nightmare-Eclipse cluster release |
| 2026-05-21 | RedSun, UnDefend patched OOB; GitHub account terminated May 23 |
| 2026-05 (mid) | Silent `mpengine!SysIO*` hardening breaks junction/SMB RCE path |
| 2026-06-09 | Patch Tuesday fixes GreenPlasma, YellowKey, MiniPlasma |
| 2026-06-10 | RoguePlanet published as MSNightmare on GitHub |
| 2026-06-10 | Cyderes Howler Cell reproduction on patched Windows 11 Pro |
| 2026-06-10 | Microsoft statement: investigating validity (via BleepingComputer) |

## Sources

- [Cyderes Howler Cell — RoguePlanet: Windows Zero-Day Weaponizes Defender Quarantine Pipeline](https://www.cyderes.com/howler-cell/rogueplanet-windows-zero-day) (primary writeup referenced in this entry)
- [GitHub — MSNightmare/RoguePlanet](https://github.com/MSNightmare/RoguePlanet) (public PoC)
- [Cyderes — BlueHammer (CVE-2026-33825)](https://www.cyderes.com/howler-cell/bluehammer-windows-defender-zero-day) (cluster context)
- [Cyderes — RedSun (CVE-2026-41091)](https://www.cyderes.com/howler-cell/redsun-windows-defender-zero-day) (cluster context)
- [BleepingComputer — Microsoft Defender RoguePlanet zero-day](https://www.bleepingcomputer.com/news/microsoft/microsoft-defender-rogueplanet-zero-day-grants-system-privileges/) (vendor response, third-party reproduction)
