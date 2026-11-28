---
title: "pCloud Confirms pCloud Pass Cyberattack After Unknown-Device Login Alerts"
slug: "pcloud-pass-password-manager-breach-nov-2026"
date: 2026-11-27
type: news
category: news
tags: [pcloud, password-manager, breach, 2fa, account-security]
excerpt: "pCloud confirmed a contained cyberattack on its pCloud Pass password manager after users received new-device login alerts, some with 2FA enabled. pCloud says a small number of email addresses were exposed and that vault data stayed encrypted, but has not said whether encrypted vaults were accessed or stolen."
source: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/pcloud-confirms-password-manager-hack-after-suspicious-login-alerts/"
draft: false
---

## Summary

On **27 November 2026**, BleepingComputer reported that **pCloud** confirmed a cyberattack on **pCloud Pass**, its password manager, after customers worldwide began receiving emails saying a new device had connected to their accounts. Reddit reports cited by BleepingComputer describe an unfamiliar device named `pd` connecting from IP `45.131.244.7` in Luxembourg, which users say, and Clubic's own check indicates, belongs to pCloud's own infrastructure. pCloud has not confirmed this.

pCloud's statement, as quoted by BleepingComputer: *"A cyberattack targeting pCloud Pass occurred, which was promptly contained by the pCloud team. Unfortunately, a small number of pCloud Pass user email addresses were exposed and login attempts were made."* The company says the attack was isolated to pCloud Pass, cloud storage was not affected, and passwords, notes and other vault contents were not compromised because they are encrypted on the customer's device and need the master password to decrypt.

**pCloud has not said whether encrypted vaults were accessed or stolen.** That matters because an attacker holding encrypted vaults can try to crack them offline, with no login rate limits and no 2FA in the way. BleepingComputer points to the 2022 LastPass breach as the precedent.

## What is confirmed and what is not

| Question | Status | Notes |
|----------|--------|-------|
| Did a cyberattack on pCloud Pass occur? | Confirmed by pCloud | Described as contained and limited to the password manager |
| Were email addresses exposed? | Confirmed by pCloud | Described as "a small number"; no count given |
| Did users with 2FA enabled get alerts? | Reported by users | BleepingComputer says several did. pCloud has not explained how, and it has not said 2FA was bypassed |
| Were encrypted vaults accessed or stolen? | Not disclosed | pCloud says vault contents were not compromised but is silent on vault access |
| Did the activity originate from pCloud infrastructure? | Reported, not confirmed by pCloud | Users and Clubic say the source IP belongs to pCloud; pCloud has not addressed it |
| Was this an AI-driven attack? | Not stated | pCloud discussed AI speeding up vulnerability discovery but did not say this attack used AI |

Other details reported by BleepingComputer:

- Some users who checked their account found no unfamiliar device listed.
- Some recipients said they never used pCloud Pass. One said the alert went to an address tied to a pCloud storage account they had asked to delete almost a year earlier.
- The "Open settings" link in the alert emails pointed to `passqa1.pcloud.com`, which looks like a QA environment rather than the production site. BleepingComputer confirmed this from a copy of the notification.
- Clubic independently reported the same alerts, with the earliest reports in the night of 26 to 27 November. It also reported that pCloud's mail DNS records were briefly missing on 27 November and later restored.

## Context: other password-manager incidents this month

BleepingComputer calls pCloud Pass the latest in a series of password-manager attacks this month. It names two others:

- **mSecure (mSeven Software):** a 3 November notice told current and former customers to change passwords, reset 2FA and remove passkeys. A reply from mSeven support, copied by a customer onto the mSecure support forum, says an unauthorized actor acquired an encrypted copy of a database of user information. The company says it has no evidence the contents were accessed and that only users syncing with mSecure Cloud are affected. See the [mSecure support forum thread](https://support.msecure.com/en/support/discussions/topics/36000039028) and [BleepingComputer's report](https://www.bleepingcomputer.com/news/security/msecure-password-manager-hack-prompts-password-reset-warnings/).
- **1Password:** disclosed on 25 November that a compromised employee GitHub account led to malicious backend code and theft of account records for a subset of customers (names, email addresses, account identifiers and tokens in emailed invitation and recovery links). 1Password says vaults and their encryption keys were not compromised. See our write-up: [1Password Discloses Corporate GitHub Account Compromise and CI/CD Breach](/signals/onepassword-corporate-github-breach-nov-2026).

These are three separate incidents at three vendors. Public reporting does not link them, and the pCloud root cause is unknown.

## Operator actions

1. pCloud Pass users should review connected devices and sign out or remove any they do not recognize, including a device named `pd`. Because some affected users saw no unfamiliar device listed, also change the master password.
2. Treat the alert email with care. Its settings link pointed to a QA hostname, so open pCloud Pass by typing the address or using the app, not the email link. pCloud says it will never ask for master passwords or recovery words by email, phone or chat.
3. Until pCloud says whether encrypted vaults were taken, prioritize rotating credentials stored in the vault, starting with email, banking, work and recovery accounts. A long, unique master password limits the risk from offline cracking.
4. Organizations should check whether staff use pCloud Pass and watch for follow-on phishing aimed at exposed email addresses.

## Sources

- [BleepingComputer — pCloud confirms password manager hack after suspicious login alerts](https://www.bleepingcomputer.com/news/security/pcloud-confirms-password-manager-hack-after-suspicious-login-alerts/)
- [Clubic — Connexions suspectes à pCloud Pass, mails rejetés](https://www.clubic.com/actualite-641377-connexions-suspectes-a-pcloud-pass-mails-rejetes-que-se-passe-t-il-chez-pcloud.html)
- [BleepingComputer — mSecure password manager hack prompts password reset warnings](https://www.bleepingcomputer.com/news/security/msecure-password-manager-hack-prompts-password-reset-warnings/)
- [mSecure support forum thread](https://support.msecure.com/en/support/discussions/topics/36000039028)
- [1Password — Update on a security incident involving 1Password's backend systems](https://1password.com/blog/update-on-nov-2026-security-incident)
