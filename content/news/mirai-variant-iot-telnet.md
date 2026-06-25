---
title: "Mirai Variant Targets IoT Telnet"
slug: "mirai-variant-iot-telnet"
date: 2026-06-15
type: news
category: news
tags: [mirai, iot, botnet, telnet]
excerpt: "Modified Mirai strain scanning telnet with updated credentials and DGA C2."
source: "vx-underground"
sourceUrl: "https://vx-underground.org/"
draft: false
---

## Summary

A modified Mirai botnet variant has re-entered active scanning campaigns, targeting IoT and embedded devices exposed on TCP/23 (telnet) with an expanded credential dictionary and domain generation algorithm (DGA) command-and-control infrastructure. The strain diverges from stock Mirai in its C2 resilience model — static hardcoded IPs have been replaced with daily-rotating DGA domains, complicating sinkhole and blocklist strategies.

IoT botnets remain the cheapest distributed compute available to attackers. This variant's credential refresh suggests operators are mining breach compilations and vendor default-password databases released in Q1–Q2 2026.

## Technical Details

### Infection Chain

1. Scan phase — compromised bots and scanner nodes probe random IPv4 ranges on port 23.
2. Brute-force — dictionary attack against telnet login prompts; success rate concentrates on cameras, DVRs, routers, and industrial gateways still shipping telnet-enabled firmware.
3. Dropper delivery — architecture-specific ELF binaries (`mips`, `arm`, `arm7`, `m68k`, `sh4`) fetched via wget/curl embedded in shell one-liners.
4. Persistence — process name masquerading (`/bin/busybox`, `[kworker]`), watchdog process respawn, and crontab entries on Linux-based firmware.
5. C2 registration — bot resolves DGA domain, registers with controller, receives attack command queue.

### DGA Characteristics

Observed DGA seeds produce 4–6 character second-level domains under rotating TLDs including `.top`, `.xyz`, `.icu`, and `.cc`. Domain generation uses date-seeded PRNG — predictable if seed algorithm is recovered from binary.

Example pattern (illustrative, rotate daily):

```
[a-z]{4,6}.(top|xyz|icu)
```

Sinkhole operators should monitor passive DNS for burst registration clusters rather than individual domain blocklists.

### Credential Dictionary Updates

Compared to 2023 Mirai credential sets, this variant adds:

- Vendor-specific defaults from 2025–2026 IoT breach dumps
- `root:root`, `admin:admin` permutations with locale suffixes
- ISP-provisioned router defaults (Huawei, ZTE, TP-Link OEM firmware)
- Industrial HMI defaults (`operator:operator`, `user:user`)

## Indicators of Compromise

| Type | Value |
|------|-------|
| Port scan | High-volume TCP/23 from residential and VPS origins |
| Outbound | HTTP GET to DGA domains resolving to bulletproof hosting |
| Process | Unexpected `wget`/`curl` child of telnetd or dropbear |
| Traffic | UDP flood / SYN flood command bursts post-C2 registration |

Hash samples vary by build — submit unknown ELF binaries from edge devices to internal sandboxes rather than relying on static IOC lists.

## Impact

Residential: Compromised routers and cameras become DDoS cannon fodder and residential proxy nodes.

Enterprise: OT gateways with telnet enabled for legacy maintenance become lateral movement bridges between IT and OT segments.

Service providers: Upstream bandwidth consumption during attack windows; reputation damage if customer CPE participates in outbound floods.

## Mitigation

1. Disable telnet everywhere — SSH with key auth only; many vendors still expose telnet on factory defaults.
2. Block outbound DGA TLD patterns at recursive DNS and firewall egress.
3. Segment IoT/OT — no telnet reachable from internet; no IoT VLAN with route to corporate AD.
4. Monitor TCP/23 — any inbound telnet attempt on non-OT networks is an anomaly.
5. Firmware audit — replace end-of-life devices that cannot disable telnet.

## Timeline

| Date | Event |
|------|-------|
| 2026-06-12 | Elevated TCP/23 scan volume reported by honeypot operators |
| 2026-06-14 | vx-underground indexes sample binaries and C2 DGA analysis |
| 2026-06-15 | Variant attributed to modified Mirai lineage with DGA C2 |

## Sources

- [vx-underground](https://vx-underground.org/)
- Community honeypot telemetry (GreyNoise, Shodan trend data)
