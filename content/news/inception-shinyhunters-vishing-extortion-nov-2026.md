---
title: "Inception Extortion Group (`O-UNC-053`) Splits from ShinyHunters Amid Disputed Leak Claims"
slug: "inception-shinyhunters-vishing-extortion-nov-2026"
date: 2026-11-26
type: news
category: news
tags: [shinyhunters, inception, o-unc-053, vishing, okta, extortion, threat-actor]
excerpt: "Okta Threat Intelligence links new vishing extortion actor Inception to cluster O-UNC-053—formerly aligned with ShinyHunters—while legacy ShinyHunters Exploit/PGP accounts surface claiming a comeback after arrests. Multiple alleged victim dumps remain uncorroborated."
source: "Okta / BleepingComputer"
sourceUrl: "https://www.okta.com/blog/threat-intelligence/former_shinyhunters_cluster_moves_to_new_inception_site/"
draft: false
---

## Summary

Between **23 and 27 November 2026**, two overlapping extortion developments fractured **The Com / ShinyHunters** vishing ecosystem:

1. **Okta Threat Intelligence** published technical attribution linking the newly launched **Inception** extortion brand (operating a Tor data-leak site first observed by Okta on **16 November**, widely reported **17 November**) to threat cluster **`O-UNC-053`**, whose victims previously appeared on the **ShinyHunters** extortion portal between March and September 2026. Okta assesses `O-UNC-053` *"very likely changed brand affiliation"* from ShinyHunters to Inception (while withholding high confidence on whether `O-UNC-053` operates Inception directly or partners with it). Inception has publicly **rejected** ties to ShinyHunters.
2. Separately on **23–24 November**, a new Tor data-leak site and ShinyHunters' legacy 2020 `Exploit` forum handle announced a "comeback" mocking autumn law-enforcement arrests and endorsing a new PGP key (`27DA9D5B183247CADFC322880ABC63E30F73822E`) via **signatures from two 2020 ShinyHunters PGP keys (January and August 2020) that had been revoked in March 2026**, bypassing the March successor key (`F4953411767DE71BEDCDABCB76F4E26F7A20978A`). Because compromised or revoked legacy keys do not prove continuity on their own, researchers caution that **impostors or rival splinter actors cannot be ruled out**.

## Verified TTPs (`O-UNC-053` / Inception) vs. uncorroborated claims

- **Verified intrusion mechanics (Okta & ReversingLabs):** Tracked as far back as **21 October 2026**, **`O-UNC-053` / Inception** registered **21 SSO phishing domains**, **41 supporting infrastructure domains**, and **4 suspected domains** (including legal-themed lures across `AS19318`, `AS210558`, and `AS399486`, with `6–19` days observed between domain registration and DLS listing). Operators run real-time **voice phishing (vishing)** kits impersonating **Okta**, **OpenText/NetIQ Access Manager**, and corporate IT helpdesks to bypass OTP MFA and enroll rogue authenticators.
- **Arrests cited in reporting & comeback post:** BleepingComputer and SecurityWeek linked recent enforcement actions against suspected actors **Pepijn van der Stap ("Umbreon")** (arrested 15 September), **Saif al-Din Khader ("Rey")** (29 September, cooperating), and **Edward Dubrovsky** (charged in Pennsylvania; court filings do not explicitly name ShinyHunters).
- **Unconfirmed victim listings:** Companies listed on Inception's leak site—including **AMD, Cigna Healthcare, Paychex, PepsiCo, Henry Schein** (17 Nov), **AutoZone** (19 Nov), **Lucid Group** (21 Nov), **Restaurant Brands International** (25 Nov), and **26 November** additions **McDonald's**, **Paramount**, **Verisk**, **GoDaddy** (37.5 GB alleged, marked leaked), and **Mattel** (313 GB claimed)—**have not confirmed** the extortion claims; treat DLS listings without victim confirmation or telemetry as uncorroborated.

## Operator actions

1. **Harden IT helpdesk & identity enrollment:** Require video/in-person or phishing-resistant FIDO2/WebAuthn verification before resetting MFA factors or approving new Okta / NetIQ / Entra authenticator enrollments.
2. **Use phishing-resistant MFA (passkeys / hardware keys):** Real-time Okta vishing kits easily relay push/TOTP codes; FIDO2 origin binding breaks domain-spoofing relays cleanly.
3. **Hunt identity, DNS, and proxy logs** back to **21 October 2026** for unexpected new MFA enrollments, anomalous helpdesk resets, and suspicious legal-themed SSO lookalike domains (`legal-[.].com`, `legaldept-[.].com`).

## Sources

- [Okta Threat Intelligence — Former ShinyHunters Cluster Moves to New Inception Extortion Site (23 Nov 2026)](https://www.okta.com/blog/threat-intelligence/former_shinyhunters_cluster_moves_to_new_inception_site/)
- [BleepingComputer — New Inception Extortion Gang Launches Large-Scale Vishing Campaign (23 Nov 2026)](https://www.bleepingcomputer.com/news/security/new-inception-extortion-gang-launches-large-scale-vishing-campaign/)
- [BleepingComputer — ShinyHunters Resurfaces After FBI Arrests, Uses Old PGP Keys as Proof (24 Nov 2026)](https://www.bleepingcomputer.com/news/security/shinyhunters-resurfaces-after-fbi-arrests-uses-old-pgp-keys-as-proof/)
- [SecurityWeek — ShinyHunters Claims Comeback, New Inception Group Rejects Alleged Ties (24 Nov 2026)](https://www.securityweek.com/shinyhunters-claims-comeback-new-inception-group-rejects-alleged-ties/)
