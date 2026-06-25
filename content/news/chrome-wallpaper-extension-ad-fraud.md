---
title: "152 Chrome Wallpaper Extensions Hide Ad Fraud"
slug: "chrome-wallpaper-extension-ad-fraud"
date: 2026-06-16
type: news
category: news
tags: [malware, chrome, ad-fraud, extensions]
excerpt: "Network of 152 Chrome live wallpaper extensions faked web traffic and AdSense clicks; 105,000+ combined installs."
source: "vx-underground"
sourceUrl: "https://socket.dev/blog/152-chrome-live-wallpaper-extensions-hid-ad-tracking"
draft: false
---

## Summary

Socket.dev disclosed a network of 152 Chrome live wallpaper extensions conducting ad fraud and fake traffic generation. Combined installs exceeded 105,000. Extensions mimicked legitimate Google search click patterns and falsified website referral traffic to monetize AdSense-style programs and affiliate networks.

The campaign highlights anime-themed wallpaper extensions as a high-trust vector for browser-based monetization fraud — users perceive wallpapers as low-risk cosmetic add-ons.

## Campaign Overview

### Extension Network

- 152 distinct extensions — separate publisher accounts, shared backend infrastructure
- 105,000+ total installs — distributed across long-tail wallpaper keywords
- Theme clustering — anime, gaming, nature live wallpapers
- No obvious install hooks — fraud triggers during normal browsing, not at install time

### Monetization Model

1. Extension injects or proxies browsing activity.
2. Simulates Google search result clicks (CTR inflation).
3. Generates fake referral traffic to AdSense-participating sites.
4. Collects affiliate/referral revenue via attacker-controlled sites.

Unlike traditional malvertising, victims may not see popup ads — fraud operates in background tabs or headless request chains.

## Technical Details

### Background Execution

Extensions abuse `chrome.declarativeNetRequest`, `webRequest`, or legacy `background.page` patterns to:

- Open hidden tabs to target URLs
- Inject click events on ad-bearing elements
- Rotate User-Agent and referrer headers to mimic organic traffic
- Schedule activity during victim "active hours" for statistical plausibility

### Evasion

- Delayed activation — benign behavior for days post-install
- Publisher fragmentation — 152 extensions avoids single-extension takedown
- Minimal permissions display — some use broad `<all_urls>` hidden behind wallpaper functionality
- Clean Web Store pages — screenshots and descriptions match legitimate wallpaper extensions

### Infrastructure

Shared C2 and config endpoints tie the network together despite distributed publisher accounts. Socket.dev correlated:

- Common JavaScript obfuscation patterns
- Shared analytics beacon domains
- Identical background script structure across publisher IDs

## Indicators of Compromise

| Indicator | Description |
|-----------|-------------|
| Extension | Live wallpaper extension with `<all_urls>` host permission |
| Behavior | CPU/network spike during idle browsing |
| Tabs | Hidden tabs to ad/affiliate domains in `chrome://extensions` disabled state |
| Network | Repeated HTTPS to unknown analytics domains from browser process |

Enterprise: Inventory Chrome extensions via GPO/Chrome Enterprise — flag live wallpaper category with broad permissions.

## Impact

Users: Battery drain, bandwidth consumption, potential privacy exposure via browsing pattern collection.

Advertisers: Click fraud degrades campaign metrics; budget diverted to fraudulent publishers.

Publishers: AdSense account termination risk if traffic classified as invalid.

Enterprises: Developer and analyst workstations with unvetted extensions leak internal browsing context to fraud networks.

## Mitigation

1. Extension audit — review installed live wallpaper extensions on all workstations.
2. Enterprise policy — block unvetted extension categories; allowlist approved extensions only.
3. Remove `<all_urls>` wallpaper extensions — wallpaper does not require all-site access.
4. Monitor DNS — alert on connections to correlated fraud infrastructure (Socket.dev published IOC list).
5. User education — wallpaper extensions are full browser plugins with page access, not passive images.

## Timeline

| Date | Event |
|------|-------|
| 2026-06-14 | Socket.dev completes network correlation analysis |
| 2026-06-16 | Public disclosure and extension list publication |
| 2026-06-16 | vx-underground indexing |

## Sources

- [Socket.dev — 152 Chrome wallpaper extensions](https://socket.dev/blog/152-chrome-live-wallpaper-extensions-hid-ad-tracking)
- [vx-underground](https://vx-underground.org/)
