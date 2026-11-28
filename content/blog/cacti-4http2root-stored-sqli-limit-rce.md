---
title: "4HTTP2ROOT Deep Dive: Why Stored Settings Bypass Request Validation in Cacti 1.2.31"
slug: "cacti-4http2root-stored-sqli-limit-rce"
date: 2026-11-27
type: research
category: infra
tags: [cacti, zero-day, sqli, pdo, php, popen, monitoring]
excerpt: "Code-path anatomy of Cacti 4HTTP2ROOT / 4HTTP2SHELL: why prepared statements on auth_profile.php fail without type enforcement, how stored database defaults bypass graph_view.php FILTER_VALIDATE_INT into a PDO stacked-query LIMIT injection, and how graph_realtime.php turns poller_item.arg1 into popen() execution."
draft: false
wip: false
---

**4HTTP2SHELL** (publicly tracked as **4HTTP2ROOT** and `SZB-2d2e53b206`) is an unpatched zero-day RCE chain against **Cacti Core 1.2.31** disclosed on **26 November 2026** by `ek0ms savi0r` and independently confirmed in lab testing by watchTowr and Previdian (`VULN-2026-0010`). Its mechanics illustrate a classic architectural blind spot in legacy PHP monitoring tools: **sanitizing HTTP request parameters while implicitly trusting values pulled back from database preference tables**.

For urgent mitigations, guest-user disablement, and IOC queries, see our tracking card: [Cacti 4HTTP2ROOT Unpatched Zero-Day Enables 4-Request Guest RCE](/signals/cacti-4http2root-unpatched-sqli-rce-zero-day).

**Update, 27 November 2026 (6:24 PM CST / 00:24 UTC 28 November):** a backport fix, [Cacti PR #9013](https://github.com/Cacti/cacti/pull/9013), was merged into the `1.2.31` branch. No tagged release or CVE had been published when this was checked. The root-cause analysis below still applies to the unpatched 1.2.31 release.

## The Trust Boundary Collapse Across Four Requests

```text
Unauthenticated Client (when Guest User != No User)
  |
  +--> Req 1: GET /auth_profile.php?tab=general&header=false
  |             Sets guest session cookie + csrfMagicToken
  |
  +--> Req 2: POST /auth_profile.php?tab=general&action=update_data&header=false
  |             Prepared INSERT/REPLACE writes arbitrary string into
  |             settings_user (`preview_graphs_per_page` = numeric prefix + stacked SQL)
  |             (Prepared statement prevents SQLi on write -- but stores toxic string)
  |
  +--> Req 3: GET /graph_view.php?action=preview&page=1&clear=1
  |             clear=1 discards URL param; read_user_setting() loads stored string
  |             FILTER_VALIDATE_INT never sees it -> get_allowed_graphs() interpolates
  |             $sql_limit unescaped into the SELECT ... LIMIT clause;
  |             PDO multi-statement execution runs stacked poller_item UPDATE (PHP warning only)
  |
  +--> Req 4: GET /graph_realtime.php?action=init&local_graph_id=1&ds_step=10&size=90
                -> poller_realtime.php -> cmd_realtime.php:221 -> lib/poller.php
                -> popen($command, 'r') executes overwritten poller_item.arg1
```

## Stage 1 & 2: Prepared Writes Without Domain Validation

Many developers equate *"uses prepared statements"* with *"SQL-injection safe"*. In `auth_profile.php`, Cacti verifies that submitted form field names match expected settings keys and binds the string value safely through PDO prepared parameters before saving to `settings_user`.

Because `settings_user.value` is stored as a free-form `varchar` column supporting string, boolean, and integer user preferences alike, storing a non-numeric SQL-containing string into `preview_graphs_per_page` raises **zero errors** during the `POST`.

## Stage 3: Stored Defaults Skip `FILTER_VALIDATE_INT`

The critical break occurs in `graph_view.php` (around line `657`) and `lib/auth.php` (`1574–1578`). Request parameters passed directly on the query string undergo explicit integer validation—`FILTER_VALIDATE_INT` rejects non-integer input cleanly.

However, when **`clear=1`** (or when no explicit override is supplied), `graph_view.php` falls back to `read_user_setting('preview_graphs_per_page')`, trusting the value already persisted in `settings_user` as a safe numeric default for `$graphs`:

1. `$sql_limit` is constructed via string interpolation (`LIMIT 0,$graphs` / `$start,$rows`), because MySQL/MariaDB `LIMIT` clauses historically resisted bound parameters in dynamic query builders.
2. Cacti opens its PDO MySQL/MariaDB connection **without** disabling `PDO::MYSQL_ATTR_MULTI_STATEMENTS` (which defaults to enabled in PHP `pdo_mysql`).
3. When the page evaluates `SELECT ... LIMIT 0,$sql_limit`, a stored numeric prefix terminated by a semicolon triggers MariaDB/MySQL to execute the `SELECT` followed immediately by a stacked `UPDATE` targeting `poller_item` (`host_id`, `action`, and command column `arg1`), while PHP logs only a non-fatal warning (*"A non-numeric value encountered"*) and returns HTTP `200` with normal graph HTML.

Encoding command strings as SQL hex literals avoids single-quote escaping altogether inside the stacked query, while setting `action` to `POLLER_ACTION_SCRIPT` (`1`) ensures the modified `poller_item` row routes through the OS command poller path.

## Stage 4: Realtime Polling Turns Data Rows Into `popen()`

Even on installations where the scheduled 5-minute `poller.php` cron job runs slowly or under separate schedules, Cacti's **Realtime Graphs** endpoint (`graph_realtime.php?action=init`) is immediately reachable by the same guest session:

- `graph_realtime.php` invokes `poller_realtime.php`, which calls `cmd_realtime.php:221`.
- For `action=1`, `cmd_realtime.php` passes `poller_item['arg1']` down to `exec_poll()` in `lib/poller.php` (`32–56`), executing `popen($command, 'r')` directly under the web or poller OS user (`www-data`, `apache`, or `root` inside single-process Docker containers).

## Why Standard Auditing Missed It (Defensive Takeaways)

1. **Second-order SQL injection hides behind prepared writes:** Static taint rules that mark database reads (`read_user_setting()`, `db_fetch_cell()`) as trusted sinks miss every second-order path into dynamic SQL like `ORDER BY`, `LIMIT`, table names, and column identifiers.
2. **Disable `PDO::MYSQL_ATTR_MULTI_STATEMENTS` at connection construction:** Very few web applications legitimately need stacked statements in routine queries; turning `MYSQL_ATTR_MULTI_STATEMENTS => false` on PDO connections breaks stacked `UPDATE`/`INSERT` escalation across `LIMIT` and `ORDER BY` injection bugs at the driver layer.
3. **Validate at the sink as well as the form:** Numeric query parameters (`$rows`, `$offset`, `$page`) should be coerced with explicit `(int)` or `filter_var(..., FILTER_VALIDATE_INT)` **after** resolving defaults from the database—not only on incoming `$_GET`/`$_POST` values.
4. **Never leave monitoring guests active:** Cacti ships with Guest access disabled by default, yet operational teams frequently enable it for NOC wallboards. If a wallboard needs read-only graphs, export static PNG/Grafana embeds behind authenticated reverse proxies rather than exposing interactive `auth_profile.php` and `graph_realtime.php` endpoints.

## Sources

- [watchTowr — 4HTTP2ROOT FAQ: Cacti Zero-Day Exposure and Fix](https://watchtowr.com/intelligence/4http2root-cacti-zero-day-faq/)
- [Previdian — Cacti Zero-Day: What We Know So Far (`VULN-2026-0010`)](https://blog.previdian.com/cacti-zero-day-what-we-know-so-far/)
- [GitHub (`ekomsSavior/Sad-Girls-0day-Club`) — 4http2shell Technical Write-Up](https://github.com/ekomsSavior/Sad-Girls-0day-Club/tree/main/4http2shell)
- [CVE.now Early Warning — `SZB-2d2e53b206`](https://cve.now/SZB-2d2e53b206.md)
