---
title: "Cacti 4HTTP2ROOT Unpatched Zero-Day Enables 4-Request Guest RCE"
slug: "cacti-4http2root-unpatched-sqli-rce-zero-day"
date: 2026-11-27
type: news
category: news
tags: [cacti, zero-day, sqli, rce, php, popen, monitoring]
excerpt: "An unpatched Cacti Core 1.2.31 zero-day (4HTTP2ROOT / 4HTTP2SHELL) lets unauthenticated visitors chain stored SQL injection in preview_graphs_per_page and poller_item.arg1 into popen() shell execution when guest access is enabled. No CVE or vendor fix exists yet; not in CISA KEV."
source: "Church of Malware / watchTowr"
sourceUrl: "https://watchtowr.com/intelligence/4http2root-cacti-zero-day-faq/"
draft: false
---

## Summary

On **26 November 2026**, researcher `ek0ms savi0r` (Church of Malware) published **4HTTP2SHELL** (also tracked as **4HTTP2ROOT** and `cve.now` early warning **`SZB-2d2e53b206`**), an unpatched zero-day vulnerability chain affecting the latest stable release **Cacti Core 1.2.31** (full earlier affected range not yet established). When Cacti's optional **guest user** is enabled, an unauthenticated visitor can execute arbitrary OS commands as the Cacti web/poller user (`www-data`, `apache`, or `root` in misconfigured containers) across **four plain HTTP requests**.

Both **watchTowr** and **Previdian** (`VULN-2026-0010`) independently analyzed and verified the exploit sequence within hours of release. No CVE identifier or official severity metric has been assigned yet, **no vendor patch exists as of 27 November 2026**, and no in-the-wild exploitation has been confirmed; not in CISA KEV catalog `2026.11.25`.

## Why stored defaults bypass validation (4-request chain)

1. **Guest session & CSRF (`auth_profile.php`):** An anonymous request to `auth_profile.php?tab=general&header=false` receives a valid guest session cookie and CSRF token (`csrfMagicToken`).
2. **Unvalidated persistent setting write:** Submitting `auth_profile.php?tab=general&action=update_data&header=false` stores an arbitrary string inside the `settings_user` database table for `preview_graphs_per_page`. While the storage query itself uses a prepared statement, `auth_profile.php` checks only that the setting name exists—not that its value is an integer.
3. **Stored SQL injection into stacked `UPDATE` (`graph_view.php:657`, `lib/auth.php:1574-1578`):** Requesting `graph_view.php?action=preview&page=1&clear=1` pulls the stored `preview_graphs_per_page` setting directly as the default for `$graphs` inside `get_allowed_graphs()`, bypassing request-side `FILTER_VALIDATE_INT` checks and concatenating `$sql_limit` straight into the query's `LIMIT` clause. Because Cacti's PDO MySQL/MariaDB connection permits stacked statements, a malicious preference string terminates the `SELECT ... LIMIT` query and executes a trailing `UPDATE` modifying `poller_item`'s command argument column (`arg1`) using hex-encoded literal syntax and SQL comments, while returning a normal HTTP `200` preview page (logging only a PHP non-numeric warning).
4. **Command execution (`graph_realtime.php?action=init`):** Triggering the guest-reachable realtime graph poller routes through `poller_realtime.php` -> `cmd_realtime.php:221` -> `lib/poller.php`, passing the modified `poller_item['arg1']` directly to `popen()`.

See our full architectural breakdown in [4HTTP2ROOT Deep Dive: Why Stored Settings Bypass Request Validation](/research/cacti-4http2root-stored-sqli-limit-rce).

## Operator actions (interim mitigations)

Because Cacti servers routinely store SNMP community strings, device logins, SSH keys, database credentials (`include/config.php`), and direct management-plane routes to routers, switches, and PDUs, compromise often grants immediate network-wide pivot access.

1. **Disable the guest account immediately:** In the Cacti Console go to **Configuration → Settings → Authentication**, set **Guest User** to **No User**, and verify anonymous access to `auth_profile.php` and `graph_realtime.php` returns access denied or login redirects.
2. **Isolate the Cacti UI:** Restrict HTTP/HTTPS access strictly to trusted management VLANs, VPN segments, or authenticated reverse proxies—never expose Cacti directly to untrusted networks.
3. **Hunt database tables and logs:**
   - Query `settings_user` for non-numeric `preview_graphs_per_page` values (`SELECT user_id, value FROM settings_user WHERE name='preview_graphs_per_page' AND value NOT REGEXP '^[0-9]+$';`).
   - Audit `poller_item.arg1` for unexpected shell commands, redirects, or modified `action`/`host_id` entries, and inspect web/PHP logs for non-numeric value warnings alongside `auth_profile.php?action=update_data` followed by `graph_realtime.php?action=init`.
4. **Rotate credentials if tampering is found:** Assume SNMP strings, stored device credentials, mail relay passwords, and `include/config.php` secrets were exposed.

## Sources

- [watchTowr — 4HTTP2ROOT FAQ: Cacti Zero-Day Exposure and Fix](https://watchtowr.com/intelligence/4http2root-cacti-zero-day-faq/)
- [Previdian — Cacti Zero-Day: What We Know So Far (`VULN-2026-0010`)](https://blog.previdian.com/cacti-zero-day-what-we-know-so-far/)
- [GitHub (`ekomsSavior/Sad-Girls-0day-Club`) — 4http2shell Technical Write-Up](https://github.com/ekomsSavior/Sad-Girls-0day-Club/tree/main/4http2shell)
- [CVE.now Early Warning — `SZB-2d2e53b206`](https://cve.now/SZB-2d2e53b206.md)
- [The Hacker News — Unpatched Cacti Zero-Day Enables RCE in Four HTTP Requests](https://thehackernews.com/2026/11/unpatched-cacti-zero-day-enables-rce-in.html)
