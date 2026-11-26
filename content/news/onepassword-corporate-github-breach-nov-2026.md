---
title: "1Password Discloses Corporate GitHub Account Compromise and CI/CD Breach"
slug: "onepassword-corporate-github-breach-nov-2026"
date: 2026-11-25
type: news
category: news
tags: [1password, breach, github, ci-cd, supply-chain]
excerpt: "A compromised employee GitHub account allowed unauthorized source code access and malicious backend pushes targeting customer metadata and provisioning tokens before containment on 19 November. Customer vaults, Master Passwords, and Secret Keys remained unaffected."
source: "1Password"
sourceUrl: "https://1password.com/blog/update-on-nov-2026-security-incident"
draft: false
---

## Summary

On **25 November 2026**, **1Password** disclosed a corporate security incident detected on **19 November 2026** originating from the compromise of an employee's corporate GitHub account. Using that foothold, the threat actor copied private source-code repositories, accessed internal CI/CD infrastructure, and pushed unauthorized code modifications into backend services before being evicted.

The injected backend code exfiltrated account metadata for a subset of customers, including names, email addresses, account IDs, creation/login timestamps, public keys, Secure Remote Password (**SRP**) verifiers/parameters, and certain provisioning/invitation or recovery tokens. **Encrypted vaults, vault keys, Master Passwords, and Secret Keys were never exposed** and cannot be derived from the accessed data.

## Scope of exposure and architectural controls

| Data / System | Status | Impact & Safeguards |
|---------------|--------|---------------------|
| **Encrypted vault data & keys** | Unaffected | End-to-end client-side encryption with Master Password + Secret Key kept vault payloads out of server reach |
| **Customer metadata & SRP params** | Exposed (subset) | Names, emails, IDs, timestamps, public keys, and non-secret metadata pulled via rogue backend push |
| **Provisioning & recovery tokens** | Exposed (subset) | Redeeming any token still required passing enterprise SSO or a **6-digit email verification code**; 1Password noted no evidence of successful account takeover, and upgraded verification codes to **10 alphanumeric characters** |
| **Corporate source & CI/CD** | Accessed | Private source repositories copied; compromised tokens revoked and CI/CD pipelines audited and re-secured |

## Key takeaways for defenders

1. **GitHub-to-CI/CD lateral paths:** Even when end-user cryptography prevents direct secret compromise, an employee GitHub token with write or workflow privileges can modify downstream production services if deployment pipelines lack strict branch-protection, signed commit verification, and multi-party approval gates.
2. **Defense in depth worked at redemption:** Secondary authentication barriers (enterprise SSO / out-of-band email codes) blocked standalone abuse of exfiltrated invite and recovery tokens.

## Operator actions

1. Administrators in affected 1Password Business/Enterprise tenants (notified directly by 1Password) should review account invitations, recovery events, and SSO logs between **19 November** and containment for anomalous attempts.
2. Enforce signed commits, hardware MFA, short-lived CI/CD OIDC federation, and mandatory two-person code review across all production deployment pipelines to eliminate single-account CI/CD pushes.
3. Watch for targeted phishing or social engineering abusing leaked customer email addresses and account creation metadata.

## Sources

- [1Password — Update on November 2026 Security Incident](https://1password.com/blog/update-on-nov-2026-security-incident)
