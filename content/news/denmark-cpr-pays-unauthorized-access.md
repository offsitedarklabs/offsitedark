---
title: "8.8 million CPR records: a company's search access was abused"
slug: "denmark-cpr-pays-unauthorized-access"
date: 2026-10-05
type: news
category: news
tags: [breach, identity, cpr, denmark, privacy]
excerpt: "Denmark's CPR administration said misuse of a private company's lawful search access exposed names, addresses, and CPR numbers for about 8.8 million registered people. No CVE."
source: "CPR administration"
sourceUrl: "https://www.cpr.dk/cpr-nyt/nyhedsarkiv/2026/okt/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger"
draft: false
---

## Summary

On **5 October 2026** Denmark’s CPR administration said misuse of a Danish company’s lawful search access exposed names, addresses, CPR numbers, and related data for about **8.8 million** registered people, including people who have died or emigrated. People with name-and-address protection were not included. The company’s access was stopped. Datatilsynet was notified. Police were investigating.

This is not a disclosed software vulnerability. No CVE was named.

The administration said it learned of irregular September activity on the evening of **Friday 2 October 2026**. The register holds about 11 million people. At the time of that statement, who was responsible was still unknown, and the figures could still change. The same notice is on the [ministry site](https://fudm.dk/aktuelt/pressemeddelelser/2026/oktober/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger) and [cpr.dk](https://www.cpr.dk/cpr-nyt/nyhedsarkiv/2026/okt/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger).

## Who held the access

[TV 2 (9 October)](https://nyheder.tv2.dk/business/2026-10-09-her-er-den-fynske-virksomhed-cpr-laekket-gik-igennem) says Pays ApS in Odense confirmed it was the company whose lawful CPR search access was abused. Managing director Sophie Laursen. TV 2 describes Charity Guard as a sister company at the same address. Pays said it was working with the ministry, police, NSK, and Datatilsynet.

[Datatilsynet](https://www.datatilsynet.dk/presse-og-nyheder/nyhedsarkiv/2026/okt/datatilsynet-indleder-formel-undersoegelse-af-cpr-sagen) received the CPR administration’s notification on **4 October** and opened a formal inquiry on **23 October**, with hearings to the CPR administration and Charity Guard ApS. Charity Guard’s own notification, dated in the [23 October hearing letter](https://cdn.datatilsynet.dk/datatilsynet/Media/639283613127948153/hoering-charity-guard.pdf), says unauthorized use of a CPR Direkte access was used for lookups, estimated at about **15 million**. Case 2026-441-12362.

## What is not official

The [11 October post](https://x.com/interesting_aIl/status/2109200077755719898) ties the breach to the password “123456.” Politiken, The Register, and TV 2 have relayed a former employee’s mail, that password, and “at least three accounts including an admin.” The ministry, CPR, and Datatilsynet notices do not confirm the password. [The Register (13 October)](https://www.theregister.com/security/2026/10/13/123456-password-linked-to-denmark-data-breach-affecting-88m-people/5302726) says the government did not answer questions about it.

Lookup totals also disagree. The 5 October ministry notice does not give a lookup count. TV 2 says more than 14 million lookups and 8.8 million CPR numbers retrieved. Charity Guard’s notification says about 15 million lookups. The activity window disagrees across TV 2 and The Register (roughly 10–20 September versus “more than three weeks”). Officials confirmed the access. They did not confirm a public data release, a plan not to sell the data, or a living-versus-deceased split.

## Operator notes

1. There is no product version to patch. The control that changed is the company’s CPR search access, which the administration said it stopped.
2. Treat 8.8 million as the official exposed-record figure from 5 October. Treat 14 million and 15 million as lookup estimates from TV 2 and Charity Guard, not as a second population count.
3. Do not write “123456” into an incident report unless a primary source confirms it. As of these pages, it is a press claim.

## Sources

- [CPR administration, 5 October 2026](https://www.cpr.dk/cpr-nyt/nyhedsarkiv/2026/okt/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger)
- [Ministry notice](https://fudm.dk/aktuelt/pressemeddelelser/2026/oktober/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger)
- [Datatilsynet, 23 October 2026](https://www.datatilsynet.dk/presse-og-nyheder/nyhedsarkiv/2026/okt/datatilsynet-indleder-formel-undersoegelse-af-cpr-sagen)
- [Datatilsynet hearing, Charity Guard ApS](https://cdn.datatilsynet.dk/datatilsynet/Media/639283613127948153/hoering-charity-guard.pdf)
- [TV 2, 9 October 2026](https://nyheder.tv2.dk/business/2026-10-09-her-er-den-fynske-virksomhed-cpr-laekket-gik-igennem)
- [The Register, 13 October 2026](https://www.theregister.com/security/2026/10/13/123456-password-linked-to-denmark-data-breach-affecting-88m-people/5302726)
