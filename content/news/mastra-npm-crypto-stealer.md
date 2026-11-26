---
title: "Mastra npm scope compromise"
slug: "mastra-npm-crypto-stealer"
date: 2026-06-17
type: news
category: news
tags: [npm, supply-chain, stealer]
excerpt: "On 17 June 2026 the ehindero account republished 140+ @mastra packages depending on easy-day-js ^1.11.21. The payload release was 1.11.22 and has been removed. Microsoft attributes Sapphire Sleet. The Axios incident they cite is April 2026, not March."
source: "Microsoft"
sourceUrl: "https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/"
draft: false
---

## What it is

On 17 June 2026, between 01:12 and 02:36 UTC, the npm account `ehindero` republished more than 140 packages in the `@mastra` scope. Microsoft’s write-up of that day, updated 19 June, is the record to use. Each poisoned manifest depended on `easy-day-js`. The range was **`^1.11.21`**, not `^1.11.10`.

| Version | When | What it was |
|---------|------|-------------|
| 1.11.21 | 07:05 UTC, 16 June | The clean bait. This is the version still on the registry |
| 1.11.22 | 01:01 UTC, 17 June | The payload release. Removed |

“Any version of easy-day-js” is stale. A lockfile that resolved 1.11.22 during that window is the one to treat as compromised. A lockfile that resolved 1.11.21, or that never had the dependency, is not that release.

Microsoft attributes the activity to **Sapphire Sleet** with high confidence, and dates the related Axios npm incident to **April 2026**. The post does not describe a domain-generation algorithm, and it does not put password managers or Zapier in the list of 166 extension identifiers. That list is wallet-extension IDs, hardcoded.

Mastra said multi-factor authentication was required on the account and that the gap was a token bypass. Guessing “no MFA” from the outside does not match that statement.

`@mastra/core` was the high-download package in the set. Weekly-download counts move. Use the registry for the current number rather than a June figure.

```bash
npm ls @mastra/core easy-day-js
```

A tree that does not contain `easy-day-js` did not take this dependency. If it does, read the lockfile for 1.11.22.

## Checked 26 November 2026

| Item | Result |
|------|--------|
| CVE / KEV / EPSS | None. This is a package compromise, not a CVE |
| Registry | Only `easy-day-js` 1.11.21 still published |
| Public project | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |

Rotate npm tokens that were on a machine which installed a poisoned version, and assume wallet-extension data on that machine was in scope for the 166 identifiers. Microsoft’s post is the list. Do not extend it.

## Sources

- [Microsoft, 17 June 2026](https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/)
- [mastra-ai/mastra](https://github.com/mastra-ai/mastra)
