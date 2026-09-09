---
title: "GreenSection: NVIDIA Shared Section Out-of-Bounds Write"
slug: "greensection-nvidia-shared-section"
date: 2026-08-30
type: news
category: news
tags: [nvidia, memory-corruption, windows, dwm, vulkan, opengl, nightcrawler]
excerpt: "NightmareEclipse PoC: world-writable NVIDIA BaseNamedObjects section reused at runtime for OOB write; crash in nvoglv64, cross-session / DWM risk; vendor still investigating."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/NightmareEclipse/GreenSection"
draft: false
---

## Summary

[GreenSection](https://github.com/MSNightmare/GreenSection) (Nightcrawler mirror under NightmareEclipse) is a **memory-corruption** research drop published **2026-08-29 / 2026-08-30** against NVIDIA user-mode graphics components. Unlike the author’s Defender/EDR LPE tools, this one does **not** claim an immediate SYSTEM shell. The write-up describes a global section in `\BaseNamedObjects` that multiple NVIDIA user-mode components map with **full read/write for Everyone**, holding structures that are checked at some execution points but **reused unsafely at runtime**, producing an out-of-bounds write.

The public PoC is a **crash demonstration** against `nvoglv64` (OpenGL/Vulkan present path). The author notes the primitive is useful across the user-to-user boundary and may reach `dwm.exe`, and explicitly invites others to finish a full exploit. NVIDIA was still investigating as of **2026-09-07** press coverage; no public patch was indexed.

OFFSITE.DARK indexes the public claim and crash surface. We do not reproduce the PoC.

## Key Findings

| Finding | Detail |
|---------|--------|
| Vendor | NVIDIA user-mode graphics stack (OpenGL / Vulkan path named in the crash) |
| Class | Out-of-bounds write via shared section (CWE-787) |
| ACL claim | Global section mapped R/W to everyone |
| Immediate SYSTEM | No — author says not a finished LPE |
| Cross-session / DWM | Claimed possible; not demonstrated as a complete chain in the drop |
| Crash module | `nvoglv64!DrvPresentBuffers` (author-supplied stack) |
| Trigger condition (high level) | A process using Vulkan or OpenGL is running |
| Patch status (as of 2026-09-07) | Investigation ongoing; no public fix indexed |

## Defensive reading of the primitive

World-writable named sections in `\BaseNamedObjects` are a classic Windows integrity bug class: any local user can reshape data that privileged or other-session processes later trust. Even without a public SYSTEM chain, this is:

- a **stability** issue (deterministic crash of GPU user-mode code);
- a **cross-user** corruption candidate on multi-session hosts (RDS, shared workstations);
- a possible **compositor** integrity issue if `dwm.exe` consumes the same section.

Hunt on the section name published in the README as an IOC for the **research sample’s target object**, not as a how-to.

## Cluster context

GreenSection is the NVIDIA-facing member of the same NightmareEclipse cluster that produced [PrettyPrague](/signals/prettyprague-avast-sandbox-lpe), [HardBreacher](/signals/hardbreacher-kaspersky-endpoint-lpe), [FalconFlank](/signals/falconflank-crowdstrike-falcon-lpe), [ShieldBreak](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414), and [ShieldCrash](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414). It is a different bug class (shared-section memory safety) than those sandbox/remediation LPEs.

## Impact

- Local unprivileged process can crash NVIDIA OpenGL/Vulkan user-mode code on a machine that has already started a 3D app.
- If the OOB write is later turned into a reliable exploit, blast radius includes other users’ GPU processes and potentially DWM — i.e. the interactive desktop, not just a demo calculator.
- No CVE and no driver advisory indexed at write time: vulnerability-management scanners will not close this by CVE match alone.

## Mitigation

1. Watch NVIDIA GPU driver security bulletins for a named-section / `BaseNamedObjects` ACL fix; apply Game Ready / Studio / datacenter driver security releases when they land.
2. Until then: least-privilege interactive users; avoid shared high-value RDS hosts with untrusted local accounts.
3. EDR: alert on unexpected opens of NVIDIA global sections from non-NVIDIA processes.
4. Do not treat “no SYSTEM in the README” as “no risk” — the author framed this as an unfinished primitive.

## Related Signals

- [ShieldBreak — Defender patch bypass](/signals/shieldbreak-defender-patch-bypass-cve-2026-69414)
- [ShieldCrash — incomplete 69414 patch](/signals/shieldcrash-defender-incomplete-patch-cve-2026-69414)
- [FalconFlank — CrowdStrike Falcon LPE](/signals/falconflank-crowdstrike-falcon-lpe)
- [PrettyPrague — Avast sandbox LPE](/signals/prettyprague-avast-sandbox-lpe)

## Sources

- [GitHub — MSNightmare/GreenSection](https://github.com/MSNightmare/GreenSection)
- [Project Nightcrawler — NightmareEclipse/GreenSection](https://git.projectnightcrawler.dev/NightmareEclipse/GreenSection)
- [igor’sLAB — patch-status roundup](https://www.igorslab.de/en/nightmare-eclipse-releases-pocs-against-nvidia-crowdstrike-avast-patch-status-varies/) (2026-09-08)
