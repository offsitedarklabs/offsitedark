---
title: "LegacyHive: User Profile Service Arbitrary Hive Load Zero-Day"
slug: "legacyhive-profsvc-hive-load-zero-day"
date: 2026-07-14
type: news
category: news
tags: [microsoft, windows, zero-day, privilege-escalation, profsvc, registry, hive, lpe, local]
excerpt: "MSNightmare ninth drop — stripped ProfSvc PoC redirects UsrClass.dat across user boundaries on July 2026-patched Windows; Cyderes reproduced; no CVE, no patch."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/NightmareEclipse/LegacyHive"
draft: false
---

## Summary

[LegacyHive](https://git.projectnightcrawler.dev/NightmareEclipse/LegacyHive) is the **ninth** public Windows security drop from the researcher operating as **MSNightmare** / **Nightmare-Eclipse** (also Chaotic Eclipse, Dead Eclipse). Published **July 14, 2026** — hours after Microsoft’s July Patch Tuesday — it targets the **Windows User Profile Service (`ProfSvc`)**, which runs at **SYSTEM** integrity and loads user registry hives at logon.

Unlike earlier cluster tools that shipped finished SYSTEM or BitLocker paths, LegacyHive publishes a **registry hive loading primitive**: the PoC coerces profile initialization into mounting an **unintended `UsrClass.dat`** into a low-privileged user’s `HKU\…_Classes` namespace. No memory corruption is involved — the chain abuses offline hive configuration, Object Manager path redirection, and synchronized profile load timing.

The public PoC is **deliberately stripped**. It requires credentials for a second standard user plus a third username (which may be an administrator). The researcher states the unreleased original needed neither, and was not limited to `UsrClass.dat` — claiming any hive could be loaded. Cyderes Howler Cell independently reproduced the published PoC on Windows 11 and confirmed cross-user hive redirection via a planted registry marker.

**No CVE**, **no MSRC advisory**, and **no vendor patch** address the root cause as of indexed analysis. Microsoft told SecurityWeek it is investigating. OFFSITE.DARK indexes Project Nightcrawler and third-party analysis only; we did not discover or weaponize this flaw.

## Key Findings

| Finding | Detail |
|---------|--------|
| Component | Windows User Profile Service (`ProfSvc`) |
| Class | Arbitrary registry hive load / cross-user namespace boundary break |
| Public PoC outcome | Target `UsrClass.dat` mounted into low-priv user’s classes root |
| Full LPE chain | **Not** in public release — primitive only |
| Public PoC constraints | Second-user credentials + third username; `UsrClass.dat` only |
| Researcher claim (unreleased) | No extra credentials; any hive loadable |
| Patch status | Unpatched on July 2026-updated desktop and server SKUs (author claim; Cyderes Win11 reproduction) |
| CVE | None assigned |

## Cluster context

LegacyHive continues the Nightmare-Eclipse pattern: publish against Microsoft security guarantees immediately after Patch Tuesday, no coordinated disclosure, mirrors on GitHub and [Project Nightcrawler](https://git.projectnightcrawler.dev/NightmareEclipse).

| Tool | Surface | Status |
|------|---------|--------|
| [BlueHammer](/signals/bluehammer-defender-lpe-cve-2026-33825) | Defender signature update | CVE-2026-33825 — patched; CISA KEV |
| [RedSun](/signals/redsun-defender-lpe-cve-2026-41091) | Defender remediation write | CVE-2026-41091 — patched; CISA KEV |
| [UnDefend](/signals/undefend-defender-dos-cve-2026-45498) | Defender DoS / disable | CVE-2026-45498 — patched; CISA KEV |
| [YellowKey](/signals/yellowkey-bitlocker-bypass-cve-2026-45585) | BitLocker / WinRE | CVE-2026-45585 — patched June 2026 |
| [GreenPlasma](/signals/greenplasma-ctfmon-lpe-cve-2026-45586) | CTFMON | CVE-2026-45586 — patched June 2026 |
| [MiniPlasma](/signals/miniplasma-cldflt-lpe-cve-2020-17103) | `cldflt.sys` regression | CVE-2020-17103 — patched June 2026 |
| [RoguePlanet](/signals/rogueplanet-defender-lpe-zero-day) | Defender quarantine race | No CVE — unpatched |
| [GreatXML](/signals/greatxml-bitlocker-bypass-zero-day) | WinRE / Defender Offline | No CVE — unpatched |
| **LegacyHive** | **ProfSvc hive load** | **No CVE — unpatched** |

## What is the vulnerability?

Normal profile load maps each user’s hives from trusted paths under that user’s profile into that user’s `HKEY_USERS` namespace. LegacyHive breaks that boundary.

Cyderes describes three cooperating mechanisms:

1. **Offline `NTUSER.DAT` modification** — rewrite the authenticated user’s unloaded hive (Offline Registry Library) so **Local AppData** points at an attacker-controlled Object Manager path, then swap the modified hive in.
2. **Object Manager symbolic link redirection** — links under `\BaseNamedObjects\Restricted` steer the path `ProfSvc` trusts during load.
3. **Synchronized batch oplock** — pause profile I/O at the right moment so the redirected path is used before Windows continues.

Together, the User Profile Service loads a **target user’s `UsrClass.dat`** into the **low-privileged user’s** classes root instead of the expected hive.

### Public PoC workflow (high level)

Howler Cell documents six operator-visible stages (no step-by-step weaponization here):

1. Validate second-user credentials and target username.
2. Build Object Manager namespace / symbolic links used for path redirection.
3. Authenticate / impersonate the low-privileged user; offline-edit `NTUSER.DAT` Local AppData.
4. Stage a copy of the target `UsrClass.dat`, place a batch oplock, and force a profile load via `CreateProcessWithLogonW` with `LOGON_WITH_PROFILE` (child often a common binary such as `notepad.exe` left `CREATE_SUSPENDED`).
5. On oplock fire, adjust redirection so `ProfSvc` mounts the target hive into the wrong user’s namespace.
6. Confirm by reading a target-only registry marker through the low-priv user’s classes root.

**Impact of the public release:** cross-user registry data access (application class registrations, Explorer-related keys, and related per-user hive content) — a **building block** for larger escalation, persistence, or security-product tampering chains, not a finished SYSTEM shell in the stripped PoC.

## CVE / vendor status

| Field | Value |
|-------|-------|
| CVE | **None assigned** |
| Vendor | Microsoft investigating (SecurityWeek statement, July 2026) |
| Public PoC | Yes — Project Nightcrawler / GitHub `MSNightmare/LegacyHive` |
| Patched | No root-cause fix known; claimed functional after July 2026 Patch Tuesday |
| Unofficial mitigations | Third-party micropatches reported in industry coverage (e.g. 0Patch) — verify independently |

## Impact

- **Cross-user confidentiality break** on multi-user hosts: shared workstations, RDP session hosts, VDI — where user separation is the primary control.
- **Registry primitive**, not a finished LPE in the public tree — defenders should assume private / re-weaponized variants without credential and hive-type limits.
- **Highest exposure** where many profiles coexist on one machine; lowest on single-user locked-down endpoints (still relevant post-compromise with stolen local credentials).
- **Cluster signal** — ninth distinct surface from the same actor after Defender ×4, BitLocker ×2, CTF, Cloud Files regression; timed to maximize unpatched window after July updates.

## Detection

Static hashes are weak (source-distributed PoC). Hunt behavior:

| Signal | Why it matters |
|--------|----------------|
| Object Manager symlinks under `\BaseNamedObjects\Restricted` from user context | Rare for legitimate apps; central to published redirection |
| Offline rewrite of `NTUSER.DAT` / Local AppData outside provisioning | No benign user-context explanation |
| `CreateProcessWithLogonW` + `LOGON_WITH_PROFILE` + `CREATE_SUSPENDED` launching a common binary under a different SID | High-fidelity EDR combo for the published PoC |
| `UsrClass.dat` belonging to user A mounted under user B’s `HKU\…_Classes` | Impact artifact itself |

Tune on the **combination** (cross-SID suspended profile load + hive path anomalies), not isolated APIs.

## Mitigation

1. **No root-cause patch** — treat as active zero-day on July 2026-patched Windows desktop and server until Microsoft ships a fix.
2. Prioritize **behavioral EDR** for the CreateProcessWithLogonW / suspended-benign-binary / foreign-hive mount pattern above.
3. Reduce multi-user blast radius: separate high-value admin sessions from shared RDP/VDI pools where operationally feasible.
4. Restrict **Create symbolic links** and closely monitor Object Manager link creation in restricted namespaces where policy allows.
5. Alert on unexpected offline access to profile hive files (`NTUSER.DAT`, `UsrClass.dat`) by non-system processes.
6. Track MSRC / Defender platform advisories; evaluate vendor micropatches only after change-control review.
7. Assume **cluster reuse** — prior Nightmare-Eclipse tools are already in intrusion chains; correlate LegacyHive primitives with BlueHammer/RedSun/UnDefend/RoguePlanet TTPs.

## Timeline

| Date | Event |
|------|-------|
| 2026-04-03 | First Nightmare-Eclipse cluster release (BlueHammer) |
| 2026-06-09–11 | June Patch Tuesday wave; RoguePlanet + GreatXML unpatched drops |
| 2026-07-14 | July Patch Tuesday (record volume; three exploited zeros per industry reporting) |
| 2026-07-14 | LegacyHive published on GitHub / mirrored to Project Nightcrawler |
| 2026-07-15 | Cyderes Howler Cell analysis + Win11 reproduction published |
| 2026-07 | Microsoft: aware / investigating (SecurityWeek) |

## Sources

- [Project Nightcrawler — NightmareEclipse/LegacyHive](https://git.projectnightcrawler.dev/NightmareEclipse/LegacyHive) (primary PoC source)
- [GitHub — MSNightmare/LegacyHive](https://github.com/MSNightmare/LegacyHive) (upstream origin mirrored by Nightcrawler)
- [Cyderes Howler Cell — LegacyHive: Windows User Profile Service Arbitrary Hive Loading](https://www.cyderes.com/howler-cell/legacyhive-windows-user-profile-loading-vulnerability) (reproduction + detection)
- [SecurityWeek — Nightmare Eclipse Drops LegacyHive Windows Zero-Day](https://www.securityweek.com/nightmare-eclipse-drops-legacyhive-windows-zero-day/)
- [CrowdStrike — July 2026 Patch Tuesday analysis (LegacyHive note)](https://www.crowdstrike.com/en-us/blog/patch-tuesday-analysis-july-2026/)
- [LevelBlue SpiderLabs — LegacyHive stripped PoC overview](https://www.levelblue.com/blogs/spiderlabs-blog/legacyhive-nightmare-eclipses-latest-zero-day-drop-with-a-stripped-poc)
- [OFFSITE.DARK — RoguePlanet cluster index](/signals/rogueplanet-defender-lpe-zero-day)
