---
title: "F5 BIG-IP & APM Emergency Hotfixes for Six TMM RCEs (CVE-2026-123637)"
slug: "f5-big-ip-tmm-rce-hotfixes-k000164058"
date: 2026-11-18
type: news
category: news
tags: [f5, big-ip, rce, buffer-overflow, network, cve-2026-123637]
excerpt: "F5 K000164058 shipped emergency engineering hotfixes on 18 November for six unauthenticated TMM stack buffer overflow RCEs across BIG-IP iRules and APM (CVSS 3.1 9.8, CVSS 4.0 9.3) with no workarounds. Not in CISA KEV."
source: "F5"
sourceUrl: "https://my.f5.com/manage/s/article/K000164058"
draft: false
---

## Summary

On **18 November 2026**, **F5** published out-of-band notification **K000164058** and emergency engineering hotfixes (`BIGIP-17.1.3.7.0.21.4-ENG`, `BIGIP-17.5.1.11.0.61.12-ENG`, `BIGIP-21.1.0.4.0.19.3-ENG`) addressing **six unauthenticated Traffic Management Microkernel (TMM) stack-based buffer overflow RCEs** (**CVSS 3.1 9.8 / CVSS 4.0 9.3 Critical**), alongside six high-severity issues—including a TMM SAML integer-underflow DoS (**CVE-2026-126822**, CVSS 4.0 **8.7** / 3.1 **7.5**) requiring the same emergency hotfix path and five additional point-release fixes.

Because traffic hits TMM directly through standard virtual servers rather than the control plane, **restricting the BIG-IP management interface does not mitigate these flaws**, and F5 provides **no configuration workarounds** for the six critical RCEs. Shadowserver telemetry cited at disclosure tracked over **177,000** internet-facing BIG-IP deployments and more than **14,600** exposed BIG-IP APM endpoints. No confirmed in-the-wild exploitation has been verified by F5, and none appear in CISA KEV catalog `2026.11.25`.

## Critical & high TMM emergency hotfix CVEs

| CVE | Advisory | CVSS (4.0 / 3.1) | Affected TMM Component |
|-----|----------|------------------|------------------------|
| **CVE-2026-123637** | `K000163937` | **9.3 / 9.8** Critical | BIG-IP APM per-request policy combining Client Information and Endpoint Security agents (`CWE-121`) |
| **CVE-2026-121805** | `K000163946` | **9.3 / 9.8** Critical | iRules `PEM::subscriber` stack overflow (BIG-IP PEM, CNF, Next for Kubernetes) |
| **CVE-2026-120292** | `K000163940` | **9.3 / 9.8** Critical | iRules `MR::message route` with HTTP profile stack overflow (BIG-IP, Next for Kubernetes) |
| **CVE-2026-120285** | `K000163939` | **9.3 / 9.8** Critical | iRules `PSC::ip_address` with HTTP profile stack overflow (BIG-IP, CNF, Next for Kubernetes) |
| **CVE-2026-116953** | `K000163941` | **9.3 / 9.8** Critical | iRules `GENERICMESSAGE::route` stack buffer overflow (BIG-IP, Next for Kubernetes) |
| **CVE-2026-120722** | `K000163945` | **9.3 / 9.8** Critical | iRules `DNS::scrape` stack buffer overflow (BIG-IP DNS, CNF, Next for Kubernetes) |
| **CVE-2026-126822** | `K000163942` | **8.7 / 7.5** High | APM SAML Service Provider integer underflow (`CWE-191`) triggering TMM restart / DoS (interim mitigation: remove unused SAML Auth agent and restrict VS access) |

## Operator actions

1. Match and deploy the build-specific emergency engineering hotfixes immediately: **`BIGIP-17.1.3.7.0.21.4-ENG`** (or **`Hotfix-BIGIP-17.1.3.6.0.14.20-ENG`** for prior `17.1.3.6` EHFs), **`BIGIP-17.5.1.11.0.61.12-ENG`** (or **`Hotfix-BIGIP-17.5.1.10.0.80.35-ENG`**), **`BIGIP-21.1.0.4.0.19.3-ENG`**, plus cloud-native/centralized builds **`CNF-2.2.5 / 2.3.4 / 2.4.2-EHF1`**, **`BNK-2.2.5 / 2.3.4 / 2.4.2-EHF1`**, and **BIG-IQ `8.4.2.3`** (standard point releases `17.1.3.6 / 17.5.1.10 / 21.1.0.3` close only the five non-TMM high-severity flaws, not these seven).
2. Audit virtual servers for exposed APM access policies (including SAML SP) and iRules invoking `PEM::subscriber`, `MR::message route`, `PSC::ip_address`, `GENERICMESSAGE::route`, or `DNS::scrape`, and monitor `/var/log/ltm` and core dumps for transient TMM restarts.

## Sources

- [F5 Security Notification K000164058](https://my.f5.com/manage/s/article/K000164058)
- [CCCS Advisory AV26-1178 (19 Nov 2026)](https://www.cyber.gc.ca/en/alerts-advisories/f5-security-advisory-av26-1178)
- [Loadbalancer.org — F5 BIG-IP K000164058 Analysis (23 Nov 2026)](https://www.loadbalancer.org/blog/f5-big-ip-emergency-hotfixes-6-rce-cves/)
