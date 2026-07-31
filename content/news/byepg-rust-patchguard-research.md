---
title: "ByePg Pure-Rust PatchGuard Research Port on Nightcrawler"
slug: "byepg-rust-patchguard-research"
date: 2026-07-29
type: news
category: news
tags: [windows, kernel, patchguard, research, rust, nightcrawler, driver]
excerpt: "invalid/ByePg mirrors a pure-Rust WDK #PF/PatchGuard observation driver on Project Nightcrawler — research continuation of can1357’s 2019 technique, not a new NightmareEclipse drop."
source: "Project Nightcrawler"
sourceUrl: "https://git.projectnightcrawler.dev/invalid/ByePg"
draft: false
---

## Summary

On **2026-07-29**, Project Nightcrawler gained **`invalid/ByePg`** — a **pure-Rust** WDK x64 kernel-driver research project that implements a **PatchGuard observation/handling** path by hooking the **#PF IDT gate**, marking kernel pages NX, and optionally patching private-symbol RVAs (`KiSwInterruptDispatch`, `KiMcaDeferredRecoveryService`) from a locally generated PDB config.

This is **not** a new NightmareEclipse / MSNightmare cluster release. It continues the lineage of **[can1357/ByePg](https://github.com/can1357/byepg)** (2019) — exception/bugcheck-path research used to reason about PatchGuard — now reimplemented in `#![no_std]` Rust with build/service scripts. The Nightcrawler README marks it **authorized research only** (test-signed VM, crash dumps enabled).

OFFSITE.DARK indexes the forge appearance for watchlisting; we do not endorse loading unsigned kernel code outside controlled labs.

## Technical Details

| Aspect | Detail |
|--------|--------|
| Repo | [git.projectnightcrawler.dev/invalid/ByePg](https://git.projectnightcrawler.dev/invalid/ByePg) |
| Language | Rust (kernel cdylib) + PowerShell build/service scripts |
| Scope | IDT #PF hook, four-level paging self-map, NX marking of kernel pages, PatchGuard-shaped DPC/timer/worker decisions, Mode 0/1/2 runtime |
| Not implemented | LA57 five-level paging validation (scan is a no-op) |
| Validation claim | Clean-boot 120-minute Mode=0 longruns on four-level paging test VM |

Modes (service `Parameters`):

| Mode | Behavior |
|------|----------|
| 0 | Full |
| 1 | HookOnly |
| 2 | Observe (default when unset) |

## Cluster / source context

NightmareEclipse’s nine indexed tools (through [LegacyHive](/signals/legacyhive-profsvc-hive-load-zero-day)) remain unchanged. ByePg is a **separate contributor** (`invalid`) publishing kernel research on the same forge — useful as a signal that Nightcrawler continues to host Windows internals tooling beyond the MSNightmare mirrors.

## Impact (defensive)

- Dual-use kernel research: PatchGuard observation can aid both legitimate OS research and rootkit development.
- Watchlist Nightcrawler for new kernel-driver repos the same way you watch for PoC mirrors.
- Production endpoints should already block egress to research forges per policy ([Project Nightcrawler tools note](/tools/project-nightcrawler)).

## Mitigation / lab hygiene

1. Run only on dedicated test-signed VMs with dumps enabled.
2. Do not deploy to production or shared corp images.
3. Treat PDB-derived private-symbol configs as host-specific; never ship them as universal offsets.
4. EDR: alert on unexpected test-signed drivers and IDT/#PF hooking patterns from non-vendor modules.

## Sources

- [Project Nightcrawler — invalid/ByePg](https://git.projectnightcrawler.dev/invalid/ByePg)
- [GitHub — can1357/ByePg (original)](https://github.com/can1357/byepg)
- [can.ac — ByePg write-up (2019)](https://blog.can.ac/2019/10/19/byepg-defeating-patchguard-using-exception-hooking/)
- [OFFSITE.DARK — LegacyHive (latest NightmareEclipse)](/signals/legacyhive-profsvc-hive-load-zero-day)
