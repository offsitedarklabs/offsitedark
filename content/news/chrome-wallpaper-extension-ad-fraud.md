---
title: "152 Chrome wallpaper extensions hid ad tracking"
slug: "chrome-wallpaper-extension-ad-fraud"
date: 2026-06-16
type: news
category: news
tags: [chrome, extensions, adware]
excerpt: "Socket’s 12 June 2026 post: 152 live-wallpaper extensions, about 105,000 installs, 38 publishers, three brand backends. New-tab adware that lists “no data collected” while logging IP, ISP, clicks, and referrers. Not a hidden-tab click-injection campaign."
source: "Socket"
sourceUrl: "https://socket.dev/blog/152-chrome-live-wallpaper-extensions-hid-ad-tracking"
draft: false
---

## What Socket reported

[Socket, 12 June 2026](https://socket.dev/blog/152-chrome-live-wallpaper-extensions-hid-ad-tracking). 152 Chrome live-wallpaper extensions, about 105,000 installs, 38 publisher accounts, three brand backends. The post is a new-tab adware family. The store listing says the extension collects no data. The code logs IP address, ISP, clicks, and referrers for ad partners.

A subset of 54 listings labels install traffic as Google organic search, and wraps the uninstall ping in the shape of a Google result click.

The first draft of this Signal added hidden-tab click injection, `declarativeNetRequest` abuse, command-and-control, and a 14–16 June timeline. None of that is in the post. The disclosure date is 12 June.

There is no CVE, so there is no KEV row and no EPSS score, and Socket did not publish an exploit repository. The useful check is the extension inventory, not a network signature this page would have to invent.

```text
chrome://extensions
```

On a managed browser, the same list is in Chrome Enterprise under Devices, the extension report. A live-wallpaper extension with a new-tab override is the shape Socket described. “Wallpaper” in the name is not a reason to allow it.

## Sources

- [Socket](https://socket.dev/blog/152-chrome-live-wallpaper-extensions-hid-ad-tracking)
