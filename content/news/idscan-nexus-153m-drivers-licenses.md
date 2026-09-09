---
title: "153 Million Driver’s Licenses: KYC Scanner Became a Dark-Web Shop"
slug: "idscan-nexus-153m-drivers-licenses"
date: 2026-09-09
type: news
category: news
tags: [breach, identity, kyc, idscan, nexus, privacy, fbi]
excerpt: "Nexus listed 153M+ US/CA driver’s licenses — ~63% of US licensed drivers — with IR/UV scans from a Louisiana KYC vendor. FBI New Orleans opened a case; IDScan offered credit monitoring. You cannot reset a license."
source: "Krebs on Security"
sourceUrl: "https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/"
draft: false
---

## Summary

On **2026-09-01** Brian Krebs published that a new identity-theft service, **Nexus**, was selling digital scans of more than **153 million** driver’s licenses from the United States and Canada, advertised the day before on the Russian-language forum **Exploit**. The vendor used Krebs’s own Virginia license as the free sample. Records grew by nearly **400,000** licenses in 24 hours. The FBI’s New Orleans field office opened an inquiry the same day. Nexus replaced its login with “This service is no longer available” hours after publication.

Pieter Levels ([@levelsio](https://x.com/levelsio/status/2095214488664326567)) put the arithmetic in public:

> 153,000,000 American driver licenses leaked in KYC hack
>
> This is 63% of all American driver licenses
>
> In US driver licenses function as valid government-issues photo IDs

He quoted his own **2026-03-30** note: *the best security is not storing sensitive data ever.* The fiasco is the KYC loop, not a novel CVE. Rent a car, buy weed, ship a package, prove you are old enough for a website — a third party keeps visible, infrared, and ultraviolet copies in a cloud account. Then the copies are for sale. Then the vendor offers **credit monitoring**.

OFFSITE.DARK indexes the public reporting. This is not a how-to. Do not attempt to locate, buy, or reconstruct Nexus records.

## Key Findings (As Reported)

| Claim | Detail |
|-------|--------|
| License corpus | **153M+** US/CA driver’s licenses (Nexus dashboard) |
| Share of US drivers | ~**63%** of FHWA 2024 licensed drivers (~239.8M); Krebs’s 153M includes ~**1.1M** Canadian DLs |
| Other docs | **10M+** ID cards; **3M+** travel / international IDs; **579k+** medical cards; CAC / CDL / residence / employment-auth tags also listed |
| Live growth | ~**+400,000** license records in 24 hours; operators claimed **>1 year** of continuous exfil |
| Image set | Front + back × visible + **IR** + **UV** (six files), timestamps on filenames |
| Suspected pipe | **IDScan.net** (Metairie / New Orleans) VeriScan — **21M** verifications/month, **20,000+** locations |
| Touchpoints | Hertz rentals, Planet13 dispensaries, plus IDScan’s advertised brands (Target, FedEx, Motorola Solutions, Jack Henry; Caesars **denied** being a current client) |
| High-profile hits | U.S. Defense Secretary **Pete Hegseth**; **FBI assistant director**; Krebs; Krebs’s mother; researchers Zach Edwards and Larry Baldwin |
| Law enforcement | FBI New Orleans case opened **2026-09-01**; Krebs on a call with cyber-division leadership the same afternoon |
| Vendor statement | **2026-09-04**: unauthorized third party “may have accessed and/or copied” names and government ID numbers in IDScan cloud accounts; credit monitoring offered |
| Shop status | Nexus login replaced with shutdown text shortly after Krebs published |

FHWA Highway Statistics 2024 lists **239,824,944** licensed U.S. drivers. 153M / 239.8M is **63.8%**. Subtract Krebs’s ~1.1M Canadian licenses and the U.S. share is still ~**63%**. Levels’s round number holds.

## The KYC Loop

Levels’s quoted March post is the thesis, written after a separate ID-verification dump (IDMerit, ~1B records across 26 countries):

> I'm not sending anyone my passport anymore
>
> My Portuguese lawyer wanted me to email her a copy of my passport for KYC
>
> I rejected and she was confused
>
> "I've never been hacked"
>
> 99% of people are not aware any account probably can and will be hacked on a long enough timespan
>
> The best security is NOT storing sensitive data ever

That is the whole incident. IDScan’s product exists because banks, rentals, hotels, retailers, dispensaries, and age-gated sites outsource “prove you are you / prove you are old enough” to a scanner that keeps the artifact. Krebs’s timestamps show the copy is made at the counter, not at the DMV.

Zach Edwards, whose DEF CON trip license was in Nexus, told Krebs the policy punchline:

> This episode should further strengthen the resolve for people who are fighting back against online ID schemes which are requiring countless providers to ask for drivers licenses in order to access services under the guise of protecting kids. These systems are putting sensitive data into more and more 3rd party vendors, and we don’t have nearly the oversight to ensure they are safe.

Larry Baldwin (Cybera) noted that state licenses are used to open credit, and that people who **cannot change their face** — domestic-violence survivors, federal witness protection — are now searchable by the same photo the government issued them.

A password rotates. A license number, address, DOB, hologram stack, and biometric portrait do not.

## What Nexus Was Selling

Operators claimed an **active** breach at “a major identity verification company” whose customers include Fortune 500 firms. Preview-before-purchase with redaction. Customer photos if available.

Krebs’s blank search returned ~**11.5 million pages** at ~15 results/page. Canadian-only search: ~**1.1 million**, Ontario heaviest at **473,673**. Source tags included **CDL** (commercial driver’s license) and **CAC** (likely Common Access Cards — physical access to federal buildings). Marijuana dispensary cards were in the mix.

Some records — including Krebs’s — had six image files with date/time in the filename. Krebs’s stamp matched a **June 2025** trip. Timezone appears **GMT** against car-rental receipts.

This is not a 2010s spreadsheet of names and numbers. IR and UV captures are the same spectra banks and agencies use to decide a plastic card is real. A stolen phone photo of a license is a photocopy. A stolen IDScan pack is closer to a **clone kit**.

## How Krebs Traced the Pipe

He did not start at IDScan. He started at timestamps.

| Observation | What it ruled in / out |
|-------------|------------------------|
| No passports in the set | Not a TSA / airport-primary dump |
| Krebs showed a **passport** at Reagan National that day (no Real ID yet) | His license was not scanned at the checkpoint |
| Mother’s license timestamped **seconds** from his | Same counter, same moment |
| Both handed licenses to **Hertz**; agent kept them minutes behind the desk | Rental scanner, not TSA |
| Other helpers: federal employees who showed gov ID at TSA, then Hertz at destination — Hertz timestamps matched | Rental path repeats |
| One helper: months-long Hertz rental, no recent flight | Rental is sufficient |
| Edwards: no rental; license scanned at **Planet13** Las Vegas (also TSA + hotel Aria; only dispensary definitely machine-scanned) | Second IDScan customer |
| IDScan 2022 press: exclusive identity verification for Planet13 nationally; docs describe **IR + UV** capture | Vendor match on both customers and image modalities |
| IDScan “trust” page listed Hertz, Target, FedEx, Motorola Solutions, Jack Henry, Caesars | Brand graph; Caesars later said it had not used VeriScan since **Feb 2025** and was listed without authorization |

Nine people whose licenses Krebs found, with permission, confirmed travel or rental on or next to the file timestamps.

Hertz did not comment by publication. IDScan’s Jillian Kossman told Krebs the updates were “welcome, and helpful to our team’s investigation,” then declined further detail.

Krebs notes he does not recall whether the Hertz agent fed the cards into a machine. The timestamps and the IR/UV triplet are the forensic argument, not a photographed scan event.

## IR / UV: Why This Dump Is Worse Than Equifax-Class PII

Equifax-class breaches leak strings: SSN, DOB, address. This leak leaks **the document the strings are printed on**, under the lighting used to authenticate that document.

| Capture | What it is for |
|---------|----------------|
| Visible front/back | Name, photo, address, number, barcode / magstripe data as printed |
| Infrared | Layered printing and IR-visible security features used by banks / border / IDV terminals |
| Ultraviolet | Fluorescent inks and UV marks the same terminals expect on a genuine card |

TechTimes and Ars Technica both flag the obvious follow-on: cloned plastic that can pass the **same class of scanner** that stole the reference images. Krebs did not publish a forgery walkthrough; neither does this index.

Dan Goodin (Ars) had his own rental-SUV license appear in Nexus **within hours** of the desk scan. Near-real-time exfil, not a dusty backup.

## High-Profile Records

Krebs published that Nexus had the license of Defense Secretary **Pete Hegseth**. He told a trusted source it also had the **FBI assistant director**. He did **not** find FBI Director Kash Patel.

That source graph is how FBI cyber leadership ended up on a conference call with Krebs the afternoon of publication. New Orleans opened the case because IDScan is a New Orleans–area company, not because the SecDef record was a separate intrusion.

Using a journalist’s own license as a sales sample is operator swagger. Listing the assistant director of the investigating agency is operator illiteracy.

## Vendor Response: Credit Monitoring

IDScan’s **2026-09-04** (Friday) statement, as carried by WBRZ / NOLA.com:

> On or around September 1, 2026, IDScan.net received information indicating that certain data may have been accessed without authorization. Upon this discovery, we took immediate steps to secure our systems and engaged a team of third-party specialists to help determine the full nature and scope of the incident.

> …an unauthorized third party may have accessed and/or copied certain customer information stored within their accounts on the IDScan.net cloud. The types of information contained within the affected data may include full names and driver’s license or other government-issued identification numbers.

> Though full access to the information required payment, in an abundance of caution, we are notifying potentially impacted individuals of this incident and providing access to free credit monitoring and identity protection services.

Two gaps in that text:

1. It names **names and ID numbers**. Krebs documented **six-file image packs** including IR/UV. Those are not “identification numbers.”
2. “Full access required payment” is not a containment claim. Nexus went offline after press. Copies of a year-plus exfil do not.

Caesars Entertainment told Krebs it had **not** been an IDScan client, had not used VeriScan since February 2025, had no active accounts at the time of the incident, and did not authorize IDScan to retain data from those accounts. IDScan listed them anyway. That is a trust-page problem independent of the breach.

The credit-monitoring offer is Levels’s March title, enacted: *give us more data to make sure it’s you after we’ve been breached.* Monitoring products collect more identity artifacts. They do not reissue 153 million state licenses.

## Impact

**Individuals.** Assume the scan exists if you handed a license to a rental desk, dispensary, retailer, or hotel that used VeriScan-class hardware in the last year-plus. Freeze credit at the major bureaus. Treat new-account KYC that *asks for another license photo* as a second copy, not a fix. People in hiding cannot freeze a face.

**Downstream KYC/AML.** Banks, neo-banks, crypto onramps, and “age verification” vendors that accept a scanned license as proof of identity are authenticating against a corpus criminals already hold. Synthetic identity and account-recovery fraud get easier, not harder, when the reference image is public-for-pay.

**Federal / facility access.** CAC-tagged records, if genuine, are not a consumer-credit problem. They are a physical-access and impersonation problem. That is why New Orleans and FBI cyber were on the same call.

**Policy.** Edwards’s point stands: every “upload your ID to protect children / stop bots / satisfy BSA” mandate enlarges the same vendor class. IDMerit in March, IDScan in September. The storage is the vulnerability.

## What This Is Not

- Not a confirmed DMV hack. The pipe Krebs mapped is **post-issuance verification**.
- Not proof every Nexus record came from IDScan. The Hertz / Planet13 / IR-UV overlap is strong; the 153M figure is the operators’ dashboard. IDScan has not published a victim count.
- Not a live shop. Nexus went dark after Krebs. Treat “check if you are in it” sites that appear now as phishing until proven otherwise.
- Not a reason to publish license images, Exploit access paths, or scanner bypasses. This index does not.

## Defender Checklist

1. **Credit freeze** (Equifax / Experian / TransUnion) and fraud alerts. Monitoring alone is the vendor’s product, not containment.
2. **File a police report / FTC identity-theft report** if you see new-credit or government-ID reuse. State licenses are hard to reissue; the paper trail still matters for disputes.
3. **Enterprise:** inventory VeriScan / IDScan.net (and every other IDV SaaS) as a **crown-jewel processor**. Rotate API tokens. Ask whether the vendor stores IR/UV image packs, for how long, in whose cloud account, and whether customers can set retention to zero.
4. **Do not** upload a fresh license photo to random “Nexus checker” sites. The original shop is gone; the brand is now bait.
5. **Counter staff:** if your business must scan IDs, demand the processor **not persist** images after the pass/fail bit. Local age-gate does not require a year of cloud copies.
6. **Personal:** Levels’s rule is still the only structural control — refuse emailing passports and licenses where a lawyer, bank, or website will keep the file. You will lose some fights. The alternative is this article.

## Timeline

| Date | Event |
|------|-------|
| 2025-06 | Krebs / mother Hertz scans; timestamps later appear on Nexus filenames |
| 2026-03-28 | Levels: “Give us more data to make sure it's you after we've been breached” |
| 2026-03-30 | Levels: will not email passport for KYC; “best security is NOT storing sensitive data ever” (quoted IDMerit dump) |
| ~2025–2026 | Operators claim continuous exfil “for over a year” |
| 2026-08-31 | New Exploit user advertises Nexus; Krebs’s license used as sample |
| 2026-09-01 | Krebs publishes; FBI New Orleans opens IDScan inquiry; Nexus login goes offline later that day |
| 2026-09-01 | Caesars: not a VeriScan client since Feb 2025; listed on IDScan’s site without authorization |
| 2026-09-02 | Levels posts the 153M / 63% framing, quoting the March KYC refusal |
| 2026-09-04 | IDScan: unauthorized access to cloud customer accounts; names + government ID numbers; credit monitoring |
| 2026-09-08 | Krebs update restates IDScan notice (names and ID numbers; affected-individual notification) |
| 2026-09-09 | This index |

## Related Signals

- [216 Million Spy TVs: Full Record of the LG Smart TV Privacy Investigation](/signals/lg-216-million-spy-tvs-privacy) — first-party collection at living-room scale
- [FortiBleed Leaks VPN Credentials for 73k Devices](/signals/fortibleed-fortinet-vpn-leak) — credential corpus, different asset class, same “searchable dump” distribution

## Sources

- [Krebs on Security — FBI Probes Service Selling 153M+ Drivers Licenses](https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/) (primary)
- [Pieter Levels (@levelsio) — 153M / 63% KYC framing](https://x.com/levelsio/status/2095214488664326567)
- [Levels — March 2026 KYC / “do not store” note](https://x.com/levelsio/status/2038667797350228114)
- [Levels — *Give us more data to make sure it's you after we've been breached*](https://levels.io/data-breach-cycle-more-data-stolen-identity)
- [Ars Technica — Dan Goodin, rental scan on Nexus within hours](https://arstechnica.com/security/2026/09/my-drivers-license-is-one-of-153-million-for-sale-on-a-new-dark-website/)
- [WBRZ — FBI inquiry; IDScan 2026-09-04 statement](https://www.wbrz.com/news/fbi-investigates-data-breach-possibly-linked-to-new-orleans-cybersecurity-firm/)
- [FHWA Highway Statistics 2024, Table DL-1C — 239,824,944 licensed U.S. drivers](https://www.fhwa.dot.gov/policyinformation/statistics/2024/dl1c.cfm)
- [Tom's Hardware — inventory breakdown and Hegseth coverage](https://www.tomshardware.com/tech-industry/cyber-security/fbi-investigating-153-million-us-and-canadian-drivers-licenses-leaked-on-russian-cybercrime-forum-including-that-of-us-secdef-pete-hegseth-data-is-suspected-to-have-come-from-an-id-authentication-service-provider)
- [Gizmodo — 153 million Americans](https://gizmodo.com/153-million-americans-are-about-to-find-out-their-drivers-license-is-on-the-dark-web-2000808221)
- [Security Affairs — Nexus / IDScan recap](https://securityaffairs.com/198388/security/dark-web-service-nexus-sells-153m-drivers-licenses.html)

**Indexing note:** OFFSITE.DARK did not access Nexus, Exploit, or IDScan systems. This article is a structured citation record of Krebs’s investigation, Levels’s public framing, and subsequent vendor/press statements. No shop URLs, no sample images, no purchase or forgery procedures.
