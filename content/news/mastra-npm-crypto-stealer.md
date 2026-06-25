---
title: "Mastra NPM Scope Compromise Targets Crypto Wallets"
slug: "mastra-npm-crypto-stealer"
date: 2026-06-17
type: news
category: news
tags: [npm, supply-chain, stealer, lazarus]
excerpt: "140+ @mastra packages hijacked via dormant maintainer account; typosquat easy-day-js drops cross-platform stealer."
source: "Hacker News"
sourceUrl: "https://opensourcemalware.com/blog/mastra-npm-malware"
draft: false
---

## Summary

Between 01:12–02:36 UTC on June 17, 2026, an attacker republished 140+ packages in the `@mastra` npm scope after compromising a dormant maintainer account (`ehindero`). The `@mastra/core` package alone carries ~918,000 weekly downloads. Each poisoned manifest added a dependency on typosquat package `easy-day-js` — a clean-then-armed clone of `dayjs`.

The payload is a cross-platform stealer targeting browser extension data from 166 crypto-wallet and security extensions, with tradecraft overlapping the March 2026 Axios npm compromise attributed to Lazarus Group (North Korea).

## Attack Timeline

| Time (UTC) | Event |
|------------|-------|
| 01:12 | First poisoned `@mastra/*` publish detected |
| 01:45 | `easy-day-js` typosquat package published |
| 02:36 | Last observed malicious publish in window |
| 03:00+ | Community detection; npm security response |

Total window: ~84 minutes — sufficient for CI/CD pipelines on nightly schedules to ingest poisoned versions.

## Supply Chain Mechanics

### Maintainer Account Takeover

The `ehindero` account showed minimal recent activity — classic dormant maintainer targeting. Attackers likely obtained credentials via:

- Prior breach credential reuse
- Session token theft from maintainer workstation
- npm account without MFA (historical accounts)

### Typosquat Dependency Injection

Rather than modifying package source directly, attackers added:

```json
"dependencies": {
  "easy-day-js": "^1.11.10"
}
```

`easy-day-js` mirrors `dayjs` API surface — `npm install` resolves without obvious failure. The malicious code lives in `setup.cjs` executed via npm lifecycle hooks (`preinstall`/`postinstall`).

### Stage One — `setup.cjs`

1. Fingerprint host OS and architecture.
2. Download stage-two binary from attacker infrastructure.
3. Execute with hidden window / nohup persistence.
4. Register DGA-based fallback C2 if primary fails.

### Stage Two — Cross-Platform Backdoor

Capabilities observed:

- Browser history exfiltration
- Extension data theft from 166 targets including:
  - Crypto wallets (MetaMask, Phantom, Exodus, etc.)
  - Password managers (LastPass, Bitwarden, 1Password)
  - Productivity integrations (Zapier)
- Persistence via startup folder, crontab, or LaunchAgent
- DGA C2 for resilient command channel

## Indicators of Compromise

| Indicator | Value |
|-----------|-------|
| Package | `easy-day-js` any version |
| `@mastra/*` | Versions published 2026-06-17 01:12–02:36 UTC |
| Lockfile | Unexpected `easy-day-js` entry |
| Process | Node spawning unsigned binary from `/tmp` or `%TEMP%` |
| Network | HTTPS to fresh domains from build agents |

npm audit and Socket.dev flagged the dependency within hours — internal registries should block `easy-day-js` entirely.

## Impact

Developers: Local workstation compromise — extension vaults and browser sessions stolen.

CI/CD: Build agents running `npm install` without isolation become persistent backdoors in release pipelines.

Crypto sector: Wallet extension targeting indicates financial theft motivation consistent with Lazarus tradecraft.

Downstream consumers: Any application bundling `@mastra` dependencies during the compromise window.

## Mitigation

1. Audit lockfiles — search for `easy-day-js`; remove and regenerate lock.
2. Pin `@mastra` packages to versions predating 2026-06-17 01:12 UTC.
3. Rotate all secrets on machines that ran `npm install` during the window — API keys, npm tokens, cloud credentials.
4. Enable npm MFA on all maintainer accounts; remove dormant publishers from package access lists.
5. CI hardening — ephemeral build containers, no extension installs on build agents, `npm ci` with verified lockfile only.
6. Block package at artifact proxy — deny `easy-day-js` and flagged `@mastra` versions.

## Attribution Notes

OpenSourceMalware and community analysts note tradecraft overlap with March 2026 Axios npm compromise — typosquat dependency, `setup.cjs` loader, extension targeting, DGA C2. Lazarus attribution is analyst consensus, not confirmed government attribution.

## Sources

- [OpenSourceMalware — Mastra npm malware](https://opensourcemalware.com/blog/mastra-npm-malware)
- [Hacker News discussion](https://news.ycombinator.com/)
- npm security advisory (community-referenced)
