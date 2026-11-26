---
title: "AI Agents Exploit MONAI Label Zero-Day Alongside N-able MailAssure (CVE-2026-133968)"
slug: "monai-label-mailassure-kev-nov-23-2026"
date: 2026-11-23
type: news
category: news
tags: [cisa, kev, ai, agentic, path-traversal, ssrf, rce, n-able, cve-2026-133968, cve-2026-134624]
excerpt: "CISA added MONAI Label path traversal CVE-2026-133968 (CVSS 3.1 9.8, exploited by autonomous CAIRN AI agents) and N-able MailAssure SSRF CVE-2026-134624 (CVSS 3.1 9.3) to KEV on 23 November with remediation due 26 November."
source: "Project MONAI"
sourceUrl: "https://github.com/Project-MONAI/MONAILabel/releases/tag/0.8.6"
draft: false
---

## Summary

On **23 November 2026**, CISA added two critical vulnerabilities to the Known Exploited Vulnerabilities catalog—both carrying a **26 November 2026** remediation due date and BOD 26-04 forensic triage mandate:

1. **Project MONAI MONAI Label (`CVE-2026-133968`, `GHSA-qc22-rmgc-vg94`, CVSS 3.1 9.8 Critical):** Unauthenticated arbitrary file write in `PUT /datastore/image` and `PUT /datastore/label` (`<= 0.8.5`), independently discovered and exploited as a zero-day in September 2026 by **autonomous AI agents** built on the open-source **CAIRN** framework.
2. **N-able MailAssure / SpamExperts (`CVE-2026-134624`, CVSS 3.1 9.3 Critical):** Authenticated API Server-Side Request Forgery (**SSRF**) in relay LDAP synchronization checks (`< 20261121.1943`), disclosed alongside N-able's **16 November** Hosted Cloud intrusion.

## MONAI Label `CVE-2026-133968`: AI-agent 0-day details

- **Mechanism:** `PUT /datastore/image` and `PUT /datastore/label` constructed filesystem write paths directly from caller-supplied `image` and `label` parameters without path confinement (`CWE-24`). Because authentication ships disabled by default (`MONAI_LABEL_AUTH_ENABLE=False`), any network-reachable client could write arbitrary files anywhere writable by the server process.
- **Session archive sibling:** MONAI Label **0.8.6** (released **22 November**, PRs `#1915` and `#1942`) also closed a separate arbitrary file overwrite in `PUT /session/?uncompress=true` (unvalidated tar extraction + session ID path traversal).
- **CAIRN autonomous exploitation (Amazon Threat Intelligence):** Starting **8 September 2026** across a ~48-hour window targeting East Asian universities outside mainland China, a suspected China-nexus operator gave **CAIRN** AI agents an IP list and `"obtain shell access"` goal. Within **11 minutes** on a MONAI Label host, agents discovered `CVE-2026-133968`, wrote a Python reverse shell to `sitecustomize.py` (automatically imported at Python interpreter startup), invoked a training endpoint to spawn Python, and gained a **`root` reverse shell**—then tunneled via proxy into a second university network running the same software.

## N-able MailAssure `CVE-2026-134624`: Hosted Cloud context

- **Mechanism:** When a mail relay is configured, the LDAP synchronization connection test lacked destination restrictions, letting an authenticated API user with sufficient privileges scan arbitrary internal hosts/ports and transmit crafted payloads.
- **Incident timeline:** N-able took **Mail Assure** and **SpamExperts Hosted Cloud** dashboards/APIs offline after detecting unauthorized web-server access on **16 November 2026**, shipped build **`20261121.1943`**, and restored cloud access on **21 November 2026 at 23:44 UTC**. N-able stated exploitation appeared confined to a single N-able-hosted server and has not confirmed whether `CVE-2026-134624` served as the initial entry vector.

## Operator actions

1. Upgrade MONAI Label immediately to **`0.8.6`** (`pip install -U monailabel==0.8.6`), enable authentication (`MONAI_LABEL_AUTH_ENABLE=True`), run as an unprivileged user restricted to the datastore path, and remove all public exposure. Inspect exposed `<= 0.8.5` hosts for modified `sitecustomize.py` or unexpected `.py` files.
2. Verify N-able MailAssure / SpamExperts on-premises or private deployments run build **`20261121.1943`** or newer and audit API user permissions and LDAP relay configurations.

## Related Signals

- [CISA KEV late-2026 cluster](/signals/cisa-kev-late-2026-cluster)

## Sources

- [Project MONAI — MONAI Label 0.8.6 Release](https://github.com/Project-MONAI/MONAILabel/releases/tag/0.8.6)
- [CISA — 23 November 2026 KEV alert](https://www.cisa.gov/news-events/alerts/2026/11/23/cisa-adds-two-known-exploited-vulnerabilities-catalog)
- [The Hacker News — MailAssure & CAIRN AI-Agent MONAI Zero-Day](https://thehackernews.com/2026/11/hackers-exploit-n-able-mailassure-flaw.html)
- [Security Affairs — CISA KEV Additions (24 Nov 2026)](https://securityaffairs.com/203882/hacking/u-s-cisa-adds-n-able-mailassure-and-project-monai-flaws-to-its-known-exploited-vulnerabilities-catalog.html)
