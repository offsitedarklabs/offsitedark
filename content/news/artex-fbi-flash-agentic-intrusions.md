---
title: "FBI FLASH: ARTEX agent framework used in intrusions"
slug: "artex-fbi-flash-agentic-intrusions"
date: 2026-11-13
type: news
category: news
tags: [fbi, ic3, artex, storm-0940, agent, intrusion, connectwise]
excerpt: "IC3 FLASH-20261113-001 says actors have used the ARTEX LLM agent platform since at least August 2026. No CVE and no product patch. Microsoft later named six clusters integrating it."
source: "FBI IC3"
sourceUrl: "https://www.ic3.gov/CSA/2026/261113.pdf"
draft: false
---

## Summary

On **2026-11-13** the FBI Cyber Branch pointed at [FLASH-20261113-001](https://www.ic3.gov/CSA/2026/261113.pdf), “Threat Overview of ARTEX Autonomous Penetration Testing Framework.” This is a tradecraft alert, not a product vulnerability. The FLASH names **no CVE** and **no fixed build**.

The FLASH describes ARTEX as an open-source, Go, LLM-driven agent platform and says threat actors have used it since **at least August 2026** against organizations in financial services, government, technology, and other sectors named in the PDF. The same-day post is [FBI Cyber Branch, status 2121317398305186287](https://x.com/FBICyberBranch/status/2121317398305186287).

## What the primary sources actually say

[Censys (2026-11-05)](https://censys.com/blog/artex-agentic-asbestos/) says GitHub user Autumn-27 published `Autumn-27/ARTEX` on **2026-07-26** under AGPL-3.0. On **2026-10-08**, the day after a CrowdStrike report, the author said the project was for authorized testing and would go closed-source. The repository was later taken down. Censys estimates 1,500–2,000 stars within ten weeks, and counted **1,465 hosts** with an exposed ARTEX console as of **2026-11-04**.

[Microsoft Threat Intelligence (2026-11-25)](https://www.microsoft.com/en-us/security/blog/2026/11/25/what-defenders-need-to-know-artex-agentic-ai-framework-threat-actors-abuse/) says that, as of November 2026, **Storm-0940, Storm-3358, Onyx Sleet, Pearl Sleet, Crystal Typhoon, and Salt Typhoon** have integrated ARTEX, and that ARTEX does not introduce new techniques. In multiple Storm-0940 intrusions, privileged access came less than three hours after initial targeting. One Storm-0940 campaign produced more than **151,000 failed sign-ins**, peaking at **2,900 failures per minute**. In November 2026, ThreatBook claimed ownership and began offering “ARTEX Pro.”

## Figures that stay attributed

The FLASH repeats two numbers it attributes to other reporters, and those numbers were not re-confirmed in the pages checked for this Signal:

- About **67,000** people whose personal information was taken from South Korean financial institutions. The FLASH credits CrowdStrike, Zscaler, and CERT-EU. A CrowdStrike excerpt retrieved for this check did not give that count.
- **More than 1,600** publicly exposed consoles, credited to Check Point. Censys’s own count, opened for this check, is **1,465** hosts as of 2026-11-04.
- The FLASH also states **2,250** attempted tenant sign-ins and privileged cloud access in under three hours, credited to a **2026-10-21** Microsoft report about a ConnectWise Cloud Backup campaign. Censys cites the same Microsoft figures. The **2026-11-25** Microsoft blog confirms the Storm-0940 timing and the 151,000 failed sign-ins. The sections checked do not restate 2,250 tenants or name ConnectWise Cloud Backup.

ConnectWise Cloud Backup appears in the FLASH as a campaign, not as a versioned product defect. The FLASH says to leave affected ConnectWise application connections disabled until ConnectWise issues restoration instructions. No upgrade build is named.

## Operator notes

1. Treat exposed ARTEX consoles as intrusion infrastructure, not as a CVE to patch.
2. The Microsoft blog’s useful claim is speed and identity volume (Storm-0940, sub-three-hour privileged access, six-figure failed sign-ins), not a new technique class.
3. Do not treat the 67,000-person or 1,600-console figures as independently verified here. Quote the FLASH, then the Censys host count, and keep them separate.
4. There is nothing to “upgrade to.” Restoration guidance, where it exists, is the vendor’s, starting with the ConnectWise instruction in the FLASH.

## Sources

- [FBI Cyber Branch — 2026-11-13 post](https://x.com/FBICyberBranch/status/2121317398305186287)
- [FBI IC3 — FLASH-20261113-001 (PDF)](https://www.ic3.gov/CSA/2026/261113.pdf)
- [Censys — ARTEX: Agentic Asbestos (2026-11-05)](https://censys.com/blog/artex-agentic-asbestos/)
- [Microsoft Threat Intelligence — what defenders need to know (2026-11-25)](https://www.microsoft.com/en-us/security/blog/2026/11/25/what-defenders-need-to-know-artex-agentic-ai-framework-threat-actors-abuse/)
