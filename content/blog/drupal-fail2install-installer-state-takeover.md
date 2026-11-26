---
title: "Fail2Install Deep Dive: Why Patched Drupal Sites Stayed Vulnerable (CVE-2026-132165 & CVE-2026-136716)"
slug: "drupal-fail2install-installer-state-takeover"
date: 2026-11-26
type: research
category: infra
tags: [drupal, auth-bypass, rce, php, sqlite, database, architecture]
excerpt: "Anatomy of Drupal's two-part November 2026 installer crisis: how transient fail-fail-succeed database checks reopened install.php under Fail2Install (CVE-2026-132165), why 18 November patches missed stuck install_task states (CVE-2026-136716), and why running update.php is mandatory."
draft: false
wip: false
---

Within seven days in November 2026, Drupal issued two emergency security releases for its installer (`/core/install.php`)—both actively exploited in the wild. The first (**SA-CORE-2026-017**, **CVE-2026-132165**, NVD CVSS 3.1 **9.8**, CISA KEV 24 November) closed **Fail2Install**, a flaw discovered independently by Anthropic's OSS Scanner (`ANT-2026-GMRPK0BU`) and Searchlight Cyber. The second (**SA-CORE-2026-019**, **CVE-2026-136716**, Drupal score **21/25**) shipped on 25 November because sites already upgraded to the 18 November patches remained exploitable whenever stored state still reflected incomplete install metadata (such as a recorded `install_task` without `install_time`).

See the tracking advisory card in [Drupal Fail2Install Parts 1 and 2](/signals/drupal-fail2install-takeover-cve-2026-136716).

## Part 1: The Fail-Fail-Succeed State Machine in `install.php`

```text
Unauthenticated request -> GET/POST /core/install.php
  |
  +--> 1. install_verify_database_settings()
  |        connects using settings.php creds
  |        [FAIL] -> $database_verified = FALSE (continues!)
  |
  +--> 2. install_verify_database_ready()
  |        checks schema via tableExists(), swallows Exception
  |        [FAIL] -> $existing_install = FALSE (continues!)
  |
  +--> 3. install_database_errors()
           retries DB connection
           [SUCCEED] -> Drupal sees $existing_install == FALSE
                        and re-enters fresh installer -> Admin takeover / SQLite .php write
```

Before Drupal `10.6.22 / 11.3.22 / 11.4.13`, `install.php` made **three consecutive, non-atomic database connection checks** when deciding whether a site was already installed. If all three failed, the installer halted with `"Requirements problem."` If the first succeeded, `tableExists()` proved an active site and refused installation.

An attacker only needed the exact transient outcome **`fail, fail, succeed`**—two consecutive refused connections followed by one accepted connection inside the same request window—to leave `$existing_install` at `FALSE` while passing final database validation.

## How Attackers Forced Transient DB Refusals Without Privileges

Searchlight Cyber's 27 October lab verification demonstrated that an unauthenticated remote client can force `fail, fail, succeed` deterministically against stock PHP and database deployments without touching any local socket:

1. **Apache `mod_php` + PostgreSQL:** Default `php:8.5-apache` allows 150 concurrent worker connections while `postgres:18.6` caps regular client slots at 97. Attackers flooded slow requests against the CSS asset controller (`/sites/default/files/css/css_x.css?...&include= &_format=json`), which reflected decompressed parameters in error responses while holding DB connections open, filling all 97 database slots so `install.php`'s first two probes failed before a concurrent worker freed a slot.
2. **Apache `mod_php` + MySQL (151 max connections):** Each HTTP worker opens one standard database connection, which alone sits below 151. Searchlight bypassed that ceiling by sending a `Referer` header containing a raw **`0xFF`** byte: inserting that invalid UTF-8/utf8mb4 byte into `dblog` triggered MySQL error `1366`, causing Drupal's exception handler to open a **second, dedicated database connection** per HTTP worker to retry logging—doubling connection consumption across workers past 151.
3. **PHP-FPM + Local DB:** With only 5 default PHP-FPM workers, slot exhaustion fails. Searchlight instead saturated the host's **ephemeral TCP source port pool** (`28,232` ports cycling through `TIME_WAIT` over ~60 seconds, roughly `471` connections/sec via rapid `POST /core/authorize.php` requests with `X-HTTP-Method-Override: GET`) until outbound DB sockets hit `EADDRNOTAVAIL` temporarily.

Once inside the installer, if `settings.php` was writable or SQLite could be selected as a database backend, specifying a database path ending in `.php` under web-accessible storage wrote attacker-supplied PHP directly to disk for pre-auth code execution.

Alongside Fail2Install, the 18 November release closed **SA-CORE-2026-018** (**CVE-2026-132166**, 14/25), stripping a non-directly-exploitable deserialization gadget chain (`YamlCacheCollectorDiscovery` / `CacheCollector`).

## Part 2: Why Patching to `11.4.13` Left Sites Open (`CVE-2026-136716`)

On 20 November, public lab `abraxas/drupal-install-takeover` highlighted a second invariant: even when `install_time` exists in Drupal's state store, a finished site whose stored `install_task` key never flipped to `"done"` (for instance `install_install_profile`) allowed anonymous `POST /core/install.php` requests on `11.4.12` to load `install_configure_form` and overwrite **User 1**'s username, email, and password while leaving articles and files intact. `11.4.13` rejected that specific `install_time` test and introduced a per-session `install_session_token`—yet five days later Drupal shipped **SA-CORE-2026-019**.

As Beazley Security (`BSL-A1253`), Corgea (`cc92f32f4a` diff analysis), and Drupal's 25 November advisory explain, patching code in `10.6.22 / 11.3.22 / 11.4.13` blocked when `install_task === 'done'` or when both `install_task` and `install_time` existed—leaving sites with a recorded `install_task` and **no `install_time`** (and thus no `install_session_token`) able to bypass both checks and hand a fresh session token to the first anonymous browser reaching `/core/install.php`. Crucially:

- The Drupal administrative UI reports normal site operation and shows **zero warning** that the stored install state is incomplete.
- `10.6.23 / 11.3.23 / 11.4.14` adds an immediate interactive check (`!empty($task) && install_session_token === NULL`), and ships `system_post_update_mark_installation_finished()`, which runs **only when operators execute `update.php`** (or `drush updatedb`) to normalize `install_task = 'done'` and `install_time` in database state.
- Drupal explicitly warned that an already-compromised site may finish resetting or altering its stored install state during takeover, meaning a clean check after the fact does **not** prove the host escaped prior exploitation.

## Defense-in-Depth Lessons for Stateful Installers

1. **Never keep installer routes mounted in production:** Web-facing `/core/install.php` serves zero runtime purpose once a site is provisioned; return HTTP `403`/`404` at Nginx, Apache, or WAF layers unconditionally.
2. **State repair belongs in migrations, not just request guards:** Checking `install_time` in PHP fails if legacy or interrupted deployments hold divergent state flags across versions. Any remediation touching lifecycle state requires an explicit schema/state migration step (`update.php`).
3. **Forensic checks cannot rely on current installer behavior:** Because post-exploitation installers transition `install_task` to `"done"`, teams must audit web access logs for `install.php` requests since **18 November**, verify `users_field_data` UID 1 changes, and inspect `settings.php` permissions and SQLite artifacts.

## Sources

- [Drupal Security Advisory SA-CORE-2026-019 (`CVE-2026-136716`)](https://www.drupal.org/sa-core-2026-019)
- [Drupal Security Advisory SA-CORE-2026-017 (`CVE-2026-132165`)](https://www.drupal.org/sa-core-2026-017)
- [Beazley Security Labs — `BSL-A1253`](https://labs.beazley.security/advisories/BSL-A1253)
- [Corgea — Fail2Install Searchlight Cyber Technical Write-up](https://corgea.com/research/cve-2026-132165-132166-drupal-core-installer-reinstall-takeover-gadget-chain-november-2026)
- [abraxas/drupal-install-takeover Lab](https://github.com/abraxas/drupal-install-takeover)
