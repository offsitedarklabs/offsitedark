---
title: "FortiBleed Leaks VPN Credentials for 73k Devices"
slug: "fortibleed-fortinet-vpn-leak"
date: 2026-06-17
type: news
category: news
tags: [fortinet, vpn, breach, credentials, info-disclosure]
excerpt: "FortiBleed data leak exposes Fortinet VPN credentials for approximately 73,000 devices."
source: "Hacker News"
sourceUrl: "https://www.bleepingcomputer.com/news/security/fortibleed-leak-exposes-fortinet-vpn-credentials-for-73-000-devices/"
draft: false
---

## Summary

FortiBleed, a newly reported credential leak, exposed Fortinet VPN login data associated with approximately 73,000 devices. The disclosure surfaced on Hacker News on June 17, 2026, with BleepingComputer providing primary coverage. The dataset reportedly includes FortiGate SSL-VPN and related Fortinet edge appliance credentials collected through a combination of prior vulnerability exploitation and credential harvesting operations.

This is not a novel Fortinet CVE — it is a credential aggregation event that compounds years of FortiGate SSL-VPN weaknesses (CVE-2018-13379, CVE-2022-40684, CVE-2023-27997, and others) with fresh brute-force and infostealer-sourced data.

## Background

Fortinet appliances sit at the perimeter of tens of thousands of enterprises. SSL-VPN portals (`/remote/login`) have been perennial targets:

- Path traversal bugs leaking `sslvpn_websession` files with session cookies
- Authentication bypass flaws permitting admin interface access
- Default credential usage on rapid-deployment configs
- Credential stuffing against portals without lockout or MFA

FortiBleed appears to consolidate harvested credentials into a searchable corpus — similar in distribution model to prior "Collections" leaks but scoped to Fortinet VPN endpoints.

## Dataset Characteristics (Reported)

| Attribute | Detail |
|-----------|--------|
| Scale | ~73,000 unique device entries |
| Content | VPN usernames, passwords, device hostnames/IPs |
| Source mix | Exploited appliances, stealer logs, brute-force success |
| Distribution | Underground forums, credential marketplaces |

Exact field composition varies by entry — some records include only portal URL + credentials; others include internal interface IPs and firmware versions useful for targeted follow-on exploitation.

## Impact Assessment

### Immediate Risk

- VPN portal credential stuffing against organizations not yet rotated
- Direct VPN access where MFA is not enforced on SSL-VPN
- Lateral movement — VPN creds often match AD passwords (password reuse)
- Ransomware initial access — VPN is a preferred entry for commodity operators

### Secondary Risk

Leaked device hostnames and IPs enable targeted scanning for unpatched Fortinet CVEs on known appliances — attackers skip internet-wide scanning and probe specific victims.

## Indicators of Compromise

Monitor for:

- SSL-VPN logins from unexpected geolocations or concurrent sessions
- Successful auth from known residential proxy / bulletproof VPS IP ranges
- Admin logins following VPN compromise on same appliance
- New firewall policy rules or VPN user additions post-breach

FortiGate log fields: `type="event"` `subtype="vpn"` `action="tunnel-up"` with anomalous `srcip`.

## Mitigation

### Credential Hygiene (Immediate)

1. Force password reset for all SSL-VPN users — assume corpus contains valid creds.
2. Rotate VPN pre-shared keys and IPsec secrets.
3. Enforce MFA on all VPN authentication paths — hardware token or FIDO2, not SMS.
4. Audit active sessions — terminate unknown `sslvpn` sessions via CLI/API.

### Appliance Hardening

1. Patch all Fortinet CVEs — credential rotation without patching leaves re-harvest paths open.
2. Restrict VPN portal to known IP ranges or ZTNA broker — no internet-wide `/remote/login`.
3. Disable SSL-VPN if replaced by IPsec with certificate auth or ZTNA.
4. Enable FortiGuard logging to SIEM with alerting on auth anomalies.

### Identity

1. Check AD password reuse — VPN creds in leak may equal domain passwords.
2. Invalidate refresh tokens for M365/Google if VPN was SSO bridge.

## Timeline

| Date | Event |
|------|-------|
| 2026-06-16 | FortiBleed dataset circulation observed in underground channels |
| 2026-06-17 | BleepingComputer publishes coverage |
| 2026-06-17 | Hacker News discussion drives enterprise awareness |

## Sources

- [BleepingComputer — FortiBleed leak](https://www.bleepingcomputer.com/news/security/fortibleed-leak-exposes-fortinet-vpn-credentials-for-73-000-devices/)
- [Hacker News discussion](https://news.ycombinator.com/)
