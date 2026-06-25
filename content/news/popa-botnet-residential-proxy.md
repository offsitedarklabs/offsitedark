---
title: "Popa Botnet Linked to NetNut Proxy Provider"
slug: "popa-botnet-residential-proxy"
date: 2026-06-18
type: news
category: news
tags: [botnet, iot, proxy, android]
excerpt: "Popa Android TV box botnet (~1.5–2.5M daily IPs) linked to publicly-traded Israeli firm Alarum/NetNut."
source: "Hacker News"
sourceUrl: "https://krebsonsecurity.com/2026/06/popa-botnet-linked-to-publicly-traded-israeli-firm/"
draft: false
---

## Summary

Krebs on Security reported on June 18, 2026 that the Popa botnet — infecting unofficial Android TV streaming boxes via the Vo1d plugin framework — is linked to NetNut, a residential proxy service operated by NASDAQ-listed Alarum Technologies. Research from Synthient and Qurium found Popa SDK traffic forwarding through NetNut's proxy pool with high confidence.

Popa maintains 1.5–2.5 million unique IPs daily across ~250–300 controller addresses — one of the largest residential proxy botnets active in 2026.

## Botnet Architecture

### Infection Vector

Popa spreads through piracy streaming applications on cheap Android TV boxes (MXQ, H96, generic Allwinner/AMLogic devices):

| App (reported) | Role |
|----------------|------|
| CRICFy | Cricket streaming |
| DooFlix | Movie/TV piracy |
| Rapid Streamz | Live TV piracy |
| Various Vo1d plugins | Modular malware loader |

Users purchase sub-$30 "fully loaded" boxes with pre-installed piracy apps — no technical sophistication required for infection.

### Vo1d Plugin Framework

Vo1d provides a plugin SDK embedded in piracy apps. Popa operates as a Vo1d plugin:

1. App installs with bundled Vo1d runtime.
2. Plugin enrolls device with Popa controllers.
3. Device proxies HTTP/S traffic for paying customers.
4. Revenue flows to botnet operators and allegedly NetNut resellers.

### Scale Metrics

| Metric | Value |
|--------|-------|
| Daily unique IPs | 1.5–2.5 million |
| Controller addresses | ~250–300 |
| Publisher apps analyzed | 20+ without user consent |
| Smart TV expansion | LG webOS, Samsung Tizen apps with similar SDKs |

## NetNut / Alarum Connection

### Research Findings

Synthient and Qurium correlated:

- Popa SDK egress IPs matching NetNut residential proxy pool assignments
- TLS fingerprint and routing path overlap
- Temporal correlation between Popa enrollment spikes and NetNut capacity expansion

Krebs reporting places this in context of NASDAQ-listed Alarum Technologies — parent of NetNut — raising securities and regulatory questions about proxy sourcing transparency.

### Residential Proxy Abuse

Legitimate residential proxy services sell "real user IP" access for:

- Ad verification
- Web scraping
- Geo-restricted content testing

Botnet-sourced proxies provide the same product without consent — victims' bandwidth and IP reputation weaponized.

## Abuse Cases (Downstream)

Popa-proxied traffic reportedly used for:

- Ad fraud — click and impression inflation
- Account takeovers — ATO from residential IPs bypassing geo-velocity checks
- AI training data scraping — large-scale web harvesting appearing as organic users
- Credential stuffing — distributed low-and-slow attacks

## Indicators of Compromise

| Indicator | Description |
|-----------|-------------|
| Device | Cheap Android TV box with piracy apps installed |
| Network | Sustained outbound HTTP/S proxy traffic during idle |
| Process | Unknown background service in Vo1d-associated packages |
| Bandwidth | Consumer ISP complaints about unexplained usage spikes |

Enterprise: Popa devices on guest Wi-Fi can egress through corporate NAT — monitor for anomalous residential-device traffic patterns.

## Impact

Device owners: Bandwidth theft, legal exposure (traffic originates from their IP), device performance degradation.

Targets of proxied traffic: Fraud, scraping, attacks appearing from residential IPs.

Market: Legitimate proxy industry reputational damage; compliance challenges for customers sourcing proxies.

## Mitigation

1. Avoid piracy streaming apps and "fully loaded" TV boxes.
2. Block residential proxy SDK domains at network perimeter — Qurium/Synthient published domain lists.
3. Smart TV audit — review LG webOS and Samsung Tizen app permissions; remove unknown streaming apps.
4. Guest network isolation — IoT and media devices without route to corporate resources.
5. Vendor due diligence — proxy customers should verify IP sourcing compliance from providers.

## Timeline

| Date | Event |
|------|-------|
| 2026-06-10 | Qurium publishes initial Popa SDK analysis |
| 2026-06-15 | Synthient corroborates NetNut traffic correlation |
| 2026-06-18 | Krebs on Security publication |
| 2026-06-18 | Hacker News discussion |

## Sources

- [Krebs on Security — Popa botnet and NetNut](https://krebsonsecurity.com/2026/06/popa-botnet-linked-to-publicly-traded-israeli-firm/)
- Qurium Foundation research
- Synthient analysis (community-referenced)
