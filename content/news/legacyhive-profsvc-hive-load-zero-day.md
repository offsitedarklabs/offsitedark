---
title: "LegacyHive: User Profile Service Arbitrary Hive Load Zero-Day"
slug: "legacyhive-profsvc-hive-load-zero-day"
date: 2026-07-14
type: news
category: news
tags: [microsoft, windows, zero-day, privilege-escalation, profsvc, registry, hive, lpe, local]
excerpt: "MSNightmare ninth drop — stripped ProfSvc PoC redirects UsrClass.dat across user boundaries on July 2026-patched Windows; Cyderes reproduced; no CVE, no Microsoft OS patch as of 2026-07-31."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/NightmareEclipse/LegacyHive"
draft: false
---

## Summary

[LegacyHive](https://git.projectnightcrawler.dev/NightmareEclipse/LegacyHive) is the **ninth** public Windows security drop from the researcher operating as **MSNightmare** / **Nightmare-Eclipse** (also Chaotic Eclipse, Dead Eclipse). Published **July 14, 2026** — hours after Microsoft’s July Patch Tuesday — it targets the **Windows User Profile Service (`ProfSvc`)**, which runs at **SYSTEM** integrity and loads user registry hives at logon.

Unlike earlier cluster tools that shipped finished SYSTEM or BitLocker paths, LegacyHive publishes a **registry hive loading primitive**: the PoC coerces profile initialization into mounting an **unintended `UsrClass.dat`** into a low-privileged user’s `HKU\…_Classes` namespace. No memory corruption is involved — the chain abuses offline hive configuration, Object Manager path redirection, and synchronized profile load timing.

The public PoC is **deliberately stripped**. It requires credentials for a second standard user plus a third username (which may be an administrator). The researcher states the unreleased original needed neither, and was not limited to `UsrClass.dat` — claiming any hive could be loaded. Cyderes Howler Cell independently reproduced the published PoC on Windows 11 and confirmed cross-user hive redirection via a planted registry marker.

**As of 2026-07-31:** **no CVE** (NVD keyword search returns none), **no MSRC Update Guide advisory** naming LegacyHive / ProfSvc hive-load abuse, and **no Microsoft Windows cumulative or OOB security update** documented as a root-cause fix. Microsoft told SecurityWeek and BleepingComputer it is aware and investigating. ACROS Security / 0patch has published an **unofficial** micropatch (not a Microsoft OS update). Community Microsoft Defender for Endpoint hunting queries exist; this indexing found **no** Microsoft Defender Antimalware Platform / engine advisory that claims LegacyHive sample detection or ProfSvc hardening. OFFSITE.DARK indexes Project Nightcrawler and third-party analysis only; we did not discover or weaponize this flaw.

## Key Findings

| Finding | Detail |
|---------|--------|
| Component | Windows User Profile Service (`ProfSvc`) |
| Class | Arbitrary registry hive load / cross-user namespace boundary break |
| Public PoC outcome | Target `UsrClass.dat` mounted into low-priv user’s classes root |
| Full LPE chain | **Not** in public release — primitive only |
| Public PoC constraints | Second-user credentials + third username; `UsrClass.dat` only |
| Researcher claim (unreleased) | No extra credentials; any hive loadable |
| Patch status (as of 2026-07-31) | **Unpatched** by Microsoft OS updates; author README still claims functional after July 2026 PT; Cyderes Win11 reproduction; MSRC July CVRF has no LegacyHive/ProfSvc hive-load entry |
| CVE | **None assigned** |
| Unofficial mitigation | 0patch micropatch (ACROS Security) — third-party, not Microsoft |
| Defender | No verified Microsoft platform/engine fix; MDE hunting queries (community) |

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
| **LegacyHive** | **ProfSvc hive load** | **No CVE — unpatched (as of 2026-07-31)** |

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
| CVE | **None assigned** (NVD keyword “LegacyHive” / ProfSvc hive searches empty as of 2026-07-31) |
| Vendor | Microsoft aware / investigating (SecurityWeek; BleepingComputer spokesperson statements) |
| MSRC Update Guide | No LegacyHive / ProfSvc arbitrary-hive-load advisory found; July 2026 CVRF contains **no** `LegacyHive` / `ProfSvc` / `UsrClass` strings |
| Related but distinct | July 2026 CVRF lists **CVE-2026-50425** (*Windows Internal System User Profile* — **use-after-free** EoP). Different class from LegacyHive’s hive-path / Object Manager abuse; **do not treat as a LegacyHive fix** |
| Public PoC | Yes — Project Nightcrawler / GitHub `MSNightmare/LegacyHive` |
| Microsoft OS patch | **No** root-cause Windows cumulative / OOB fix known as of 2026-07-31; README still claims PoC works on July 2026-patched desktop and server SKUs |
| Microsoft Defender | No verified Antimalware Platform / engine update advertised as detecting LegacyHive or hardening ProfSvc for this issue; community MDE Advanced Hunting queries published (Kevin Beaumont / GossiTheDog) |
| Unofficial mitigations | ACROS Security **0patch** micropatch (reported mid/late July 2026) — injects in-memory behavior so the published chain loads a temporary profile hive instead of the target user’s; **not** a Microsoft update — verify independently under change control |

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
| GUID-named dirs at volume root staging `ntuser.dat` / `usrclass.dat`; `offreg.dll` loads outside system paths; shell-folder values pointing at `\.\globalroot` / `\BaseNamedObjects` | Patterns called out in public MDE hunting queries for the published PoC |

Tune on the **combination** (cross-SID suspended profile load + hive path anomalies), not isolated APIs. Do not confuse hunting queries or third-party EDR rules with a Microsoft OS or Defender platform root-cause fix.

## Mitigation

1. **No Microsoft root-cause OS patch as of 2026-07-31** — treat as active zero-day on July 2026-patched Windows desktop and server until MSRC ships and documents a fix for this class of abuse.
2. Prioritize **behavioral EDR** for the CreateProcessWithLogonW / suspended-benign-binary / foreign-hive mount pattern above; evaluate community MDE Advanced Hunting queries where Defender for Endpoint is deployed.
3. Reduce multi-user blast radius: separate high-value admin sessions from shared RDP/VDI pools where operationally feasible.
4. Restrict **Create symbolic links** and closely monitor Object Manager link creation in restricted namespaces where policy allows.
5. Alert on unexpected offline access to profile hive files (`NTUSER.DAT`, `UsrClass.dat`) by non-system processes.
6. Track MSRC / Windows Update for a future OS security update; track Defender platform notes separately — do not assume a signature update equals a ProfSvc fix.
7. Evaluate **0patch** (or other unofficial micropatches) only after change-control review; they are not Microsoft cumulative updates and do not replace vendor remediation when it ships.
8. Assume **cluster reuse** — prior Nightmare-Eclipse tools are already in intrusion chains; correlate LegacyHive primitives with BlueHammer/RedSun/UnDefend/RoguePlanet TTPs.

## Timeline

| Date | Event |
|------|-------|
| 2026-04-03 | First Nightmare-Eclipse cluster release (BlueHammer) |
| 2026-06-09–11 | June Patch Tuesday wave; RoguePlanet + GreatXML unpatched drops |
| 2026-07-14 | July Patch Tuesday (record volume; industry reporting of exploited zeros in-band) |
| 2026-07-14 | LegacyHive published on GitHub / mirrored to Project Nightcrawler |
| 2026-07-15 | Cyderes Howler Cell analysis + Win11 reproduction published |
| 2026-07 | Microsoft: aware / investigating (SecurityWeek; BleepingComputer) |
| ~2026-07-21 | Industry coverage of free unofficial 0patch micropatches (BleepingComputer) |
| 2026-07-31 | OFFSITE.DARK re-verification: still no CVE / no Microsoft OS fix (see Updates) |

## Updates

- **2026-07-14** — Original disclosure / stripped PoC published; author states PoC is functional on all currently supported desktop and server installs with July 2026 patches ([GitHub MSNightmare/LegacyHive README](https://github.com/MSNightmare/LegacyHive); [Project Nightcrawler mirror](https://git.projectnightcrawler.dev/NightmareEclipse/LegacyHive)).
- **2026-07-14** — CrowdStrike July Patch Tuesday analysis notes LegacyHive as a separate unpatched ProfSvc privilege-escalation disclosure the same day; “no CVE has been assigned, and no patch is available” at time of writing ([CrowdStrike](https://www.crowdstrike.com/en-us/blog/patch-tuesday-analysis-july-2026/)).
- **2026-07-15** — Cyderes Howler Cell publishes technical analysis and Windows 11 reproduction; states no CVE, Microsoft advisory, or patch addresses LegacyHive ([Cyderes](https://www.cyderes.com/howler-cell/legacyhive-windows-user-profile-loading-vulnerability)).
- **2026-07-15** — The Register coverage of disclosure; later update quotes Microsoft as aware and investigating ([The Register](https://www.theregister.com/security/2026/07/15/microsofts-serial-tormentor-drops-legacyhive-0-day/5271723)).
- **2026-07** — SecurityWeek publishes Microsoft spokesperson statement: aware, actively investigating validity/applicability; supports CVD ([SecurityWeek](https://www.securityweek.com/nightmare-eclipse-drops-legacyhive-windows-zero-day/)).
- **2026-07-20** — LevelBlue SpiderLabs overview: works on July 2026-patched Windows desktop/server; “as of writing, Microsoft has yet to publicly acknowledge or release a patch” in that piece ([LevelBlue](https://www.levelblue.com/blogs/spiderlabs-blog/legacyhive-nightmare-eclipses-latest-zero-day-drop-with-a-stripped-poc)) — note SecurityWeek/BleepingComputer later carried explicit Microsoft statements.
- **2026-07-21** — BleepingComputer: Microsoft still has no CVE / no security updates; quotes Microsoft investigating; documents free unofficial **0patch** micropatches from ACROS Security for Windows 10 2004+ and Windows Server 2022+ (in-memory; no reboot claimed); also notes community MDE detection queries from Kevin Beaumont ([BleepingComputer](https://www.bleepingcomputer.com/news/security/windows-legacyhive-zero-day-flaw-gets-free-unofficial-patches/)).
- **Prior OFFSITE.DARK / chat history (~2026-07-14–15 publish; Nightcrawler checks ~2026-07-23 and 2026-07-31 recon)** — Article text and Nightcrawler README still described LegacyHive as unpatched; no author note claiming a Microsoft fix.
- **Last verified: 2026-07-31** — Re-check findings:
  - **Still unpatched** by Microsoft Windows OS updates (no documented cumulative / OOB / Preview fix for this ProfSvc hive-load class).
  - **Still no CVE** in NVD for “LegacyHive”; MSRC July 2026 CVRF has **zero** matches for LegacyHive / ProfSvc / UsrClass / “User Profile Service” / “registry hive.”
  - July CVRF **does** include unrelated **CVE-2026-50425** (Internal System User Profile **UAF**) — not LegacyHive.
  - No August 2026 MSRC CVRF document available yet.
  - Author README on GitHub / Nightcrawler unchanged on patch claim (July 2026-patched systems still asserted vulnerable); Nightcrawler last README update remains **2026-07-14**.
  - **Defender:** no primary-source Microsoft Antimalware Platform / engine release notes verified that advertise LegacyHive detection or ProfSvc hardening; hunting remains behavioral / community KQL.
  - **0patch:** unofficial micropatch coverage remains the main documented interim code-level mitigation (per BleepingComputer / ACROS statements) — distinct from Windows Update.

## Sources

- [Project Nightcrawler — NightmareEclipse/LegacyHive](https://git.projectnightcrawler.dev/NightmareEclipse/LegacyHive) (primary PoC source)
- [GitHub — MSNightmare/LegacyHive](https://github.com/MSNightmare/LegacyHive) (upstream origin mirrored by Nightcrawler)
- [Cyderes Howler Cell — LegacyHive: Windows User Profile Service Arbitrary Hive Loading](https://www.cyderes.com/howler-cell/legacyhive-windows-user-profile-loading-vulnerability) (reproduction + detection)
- [SecurityWeek — Nightmare Eclipse Drops LegacyHive Windows Zero-Day](https://www.securityweek.com/nightmare-eclipse-drops-legacyhive-windows-zero-day/) (Microsoft investigating statement)
- [BleepingComputer — Windows LegacyHive zero-day flaw gets free, unofficial patches](https://www.bleepingcomputer.com/news/security/windows-legacyhive-zero-day-flaw-gets-free-unofficial-patches/) (Microsoft statement; 0patch; MDE hunting note)
- [The Register — Microsoft’s serial tormentor drops LegacyHive 0-day](https://www.theregister.com/security/2026/07/15/microsofts-serial-tormentor-drops-legacyhive-0-day/5271723)
- [CrowdStrike — July 2026 Patch Tuesday analysis (LegacyHive note)](https://www.crowdstrike.com/en-us/blog/patch-tuesday-analysis-july-2026/)
- [LevelBlue SpiderLabs — LegacyHive stripped PoC overview](https://www.levelblue.com/blogs/spiderlabs-blog/legacyhive-nightmare-eclipses-latest-zero-day-drop-with-a-stripped-poc)
- [LevelBlue SpiderLabs — Hunting profile initialization abuse](https://www.levelblue.com/blogs/spiderlabs-blog/legacyhive-hunting-windows-profile-initialization-abuse-through-offline-registry-manipulation)
- [GossiTheDog — LegacyHive MDE Advanced Hunting queries](https://github.com/GossiTheDog/ThreatHunting/blob/master/AdvancedHuntingQueries/LegacyHive.kql)
- [MSRC — July 2026 Security Updates CVRF](https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Jul) (no LegacyHive / ProfSvc hive-load entry; CVE-2026-50425 is a distinct UAF)
- [NVD CVE API](https://nvd.nist.gov/) (keyword search “LegacyHive” — no results as of 2026-07-31)
- [OFFSITE.DARK — RoguePlanet cluster index](/signals/rogueplanet-defender-lpe-zero-day)
