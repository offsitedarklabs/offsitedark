---
title: "Three GoAhead TLS bugs, each tied to one TLS library"
slug: "goahead-tls-openssl-libressl-mbedtls-2026"
date: 2026-10-26
type: news
category: news
tags: [goahead, embedthis, tls, mtls, openssl, libressl, mbedtls]
excerpt: "Embedthis fixed three configuration-specific GoAhead TLS flaws in 6.1.1: a CRL that is loaded but not enforced, a LibreSSL chain-depth bypass, and a 1-byte mbed TLS DH modulus. The CVE IDs in the press are not in NVD."
source: "Embedthis"
sourceUrl: "https://github.com/embedthis/goahead/releases/tag/v6.1.1"
draft: false
---

## Summary

On **12 October 2026** Embedthis published three GoAhead advisories, reported by Sébastien Féry. **GoAhead 6.1.1** was given to device builders on **2 August 2026**. The GitHub tag is 12 October. [FoxIO’s write-up](https://foxio.io/blog/choose-your-backend-three-tls-bugs-in-goahead) is dated **26 October**, which is also the day of [John Althouse’s post](https://x.com/4A4133/status/2114822201555943763).

The post treats this as three critical bugs on hundreds of millions of devices, with anyone able to decrypt sessions, bypass LibreSSL mutual TLS, and ignore revoked certificates. The vendor ratings are Critical, High, and Moderate. Each bug is limited to one TLS backend and one build configuration. Default builds do not enable mutual TLS.

The CVE IDs cited in coverage, CVE-2026-115881 and CVE-2026-115884, were **not published records** when NVD and the CVE.org API were checked on **26 November 2026**. The 6.1.1 notes say CVE IDs were requested and not yet assigned. The GitHub advisories did not show a CVE ID. CISA’s GoAhead KEV entries still show only CVE-2017-17562.

## The three bugs

| Advisory | Score | Scope | Fixed |
|----------|-------|--------|-------|
| [GHSA-5m75-xq69-c3c5](https://github.com/embedthis/goahead/security/advisories/GHSA-5m75-xq69-c3c5) | CVSS 9.1 Critical | OpenSSL-compatible backend, 3.4.5 through 6.1.0, only when mutual TLS, a CA bundle, issuer checking, and a CRL are all configured. A CRL is loaded and not enforced. mbed TLS builds are not affected. | 6.1.1 |
| [GHSA-r392-vqwx-3r4g](https://github.com/embedthis/goahead/security/advisories/GHSA-r392-vqwx-3r4g) | CVSS 7.4 High | 6.1.0 and earlier linked to LibreSSL 3.2.x or 3.3.2–3.3.6, and only with client certificates required and issuer checking disabled. OpenSSL, BoringSSL, AWS-LC, LibreSSL 4.x, and mbed TLS are not this trigger. | 6.1.1 |
| [GHSA-fmvx-2xfx-2gq4](https://github.com/embedthis/goahead/security/advisories/GHSA-fmvx-2xfx-2gq4) | Moderate | mbed TLS backend, 4.0.2 through 6.1.0. A 1-byte DH modulus is sent on TLS 1.2 DHE-RSA. TLS 1.3 and ECDHE are unaffected. OpenSSL builds are not affected. The advisory says current OpenSSL, Go, Java, and mainstream browsers refuse the truncated parameters. | 6.1.1 |

SecurityWeek’s score of 5.9 for the third bug is SecurityWeek’s, and it says that one has no CVE. The GitHub label is Moderate.

## What was not verified

“Hundreds of millions” of IoT, firewall, OT, and military devices is a researcher claim, repeated by [SecurityWeek (28 October)](https://www.securityweek.com/tls-flaws-found-in-goahead-web-server-used-in-hundreds-of-millions-of-devices/). SecurityWeek says FoxIO did not say the named products use a vulnerable configuration. No vendor advisory was opened that confirms Palo Alto Networks, Comcast, D-Link, HP, Canon, Honeywell, GE, Oracle, Siemens, Rockwell, Digi, Lockheed Martin, or Boeing ship a vulnerable build.

No source checked here reports exploitation in the wild. FoxIO published a proof of concept, according to SecurityWeek. Which appliance firmware already contains 6.1.1 was not verified.

## Operator notes

1. The upstream fix is **GoAhead 6.1.1 or later**. A device that embeds GoAhead needs the manufacturer’s firmware, not a GitHub tag dropped onto the appliance.
2. Inventory by TLS backend. An OpenSSL build is not the LibreSSL chain-depth bug. An mbed TLS build is not the CRL bug. A default build without mutual TLS is outside the first two.
3. Do not file CVE-2026-115881 or CVE-2026-115884 until NVD or CVE.org actually has the record.

## Sources

- [GoAhead 6.1.1](https://github.com/embedthis/goahead/releases/tag/v6.1.1)
- [GHSA-5m75-xq69-c3c5](https://github.com/embedthis/goahead/security/advisories/GHSA-5m75-xq69-c3c5)
- [GHSA-r392-vqwx-3r4g](https://github.com/embedthis/goahead/security/advisories/GHSA-r392-vqwx-3r4g)
- [GHSA-fmvx-2xfx-2gq4](https://github.com/embedthis/goahead/security/advisories/GHSA-fmvx-2xfx-2gq4)
- [FoxIO, 26 October 2026](https://foxio.io/blog/choose-your-backend-three-tls-bugs-in-goahead)
- [SecurityWeek, 28 October 2026](https://www.securityweek.com/tls-flaws-found-in-goahead-web-server-used-in-hundreds-of-millions-of-devices/)
- [John Althouse’s post](https://x.com/4A4133/status/2114822201555943763)
