---
title: "Mirai telnet note, unverified"
slug: "mirai-variant-iot-telnet"
date: 2026-06-15
type: news
category: news
tags: [mirai, iot, botnet, telnet]
excerpt: "This Signal described a June 2026 Mirai variant on TCP/23 with a new credential list and a daily DGA. No primary report of that campaign could be found on 26 November 2026."
source: "vx-underground"
sourceUrl: "https://vx-underground.org/"
draft: false
---

## Status

The first draft said a modified Mirai strain was scanning TCP/23 in June 2026, with an updated credential list and a daily domain-generation algorithm, and that vx-underground had indexed a sample on 14 June. A search on 26 November 2026 did not turn up a primary report of that campaign. vx-underground.org is the project homepage. The pages that do exist are older: 2016 Mirai DGA research, and the March 2024 Mirai.Nomi analysis. There is no CVE, so there is no KEV row and no EPSS score, and there is no campaign repository to point at.

The infection-chain steps and the example domain pattern in the old draft were not tied to a sample. They are removed. Telnet on an IoT device is still a bad idea. That general advice is not evidence this variant existed.

If a sample or a write-up shows up, this page should be replaced with the hash, the date, and the source. Until then it is a lead that did not check out.
