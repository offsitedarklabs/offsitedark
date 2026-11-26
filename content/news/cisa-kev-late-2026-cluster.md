---
title: "CISA KEV after September 9: the late-2026 cluster"
slug: "cisa-kev-late-2026-cluster"
date: 2026-11-25
type: news
category: news
tags: [cisa, kev, bod-26-04, drupal, mitel, juniper, vmware, citrix]
excerpt: "Catalog 2026.11.25 has 102 KEV additions dated 10 September through 25 November that were not in Signals. November 20, 24, and 25 were re-read. Dedicated write-ups already cover Optimizely, php2shell, and SSHole."
source: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog"
draft: false
---

## Summary

Signals already cover the [2–4 September cluster](/signals/cisa-kev-september-2026-cluster) and the [8–9 September cluster](/signals/cisa-kev-september-8-9-2026). A pass of KEV catalog **2026.11.25** (1,805 entries) counted **102 additions dated 2026-09-10 through 2026-11-25** with no matching file in `content/news` at the start of that pass.

This card is the index for that window. It is not 102 advisories. The 20, 24, and 25 November alerts were opened again and the type names below are CISA’s. Earlier rows are the CVE IDs that pass flagged; their full catalog text was not re-opened one by one. BOD **26-04** still requires federal civilian agencies to prioritize KEV items on publicly exposed assets that yield total control, and to check for compromise before trusting the patch.

Dedicated Signals already filed from this same gap:

- [Optimizely CVE-2026-132224](/signals/optimizely-web-experimentation-cve-2026-132224) (KEV 24 November)
- [php2shell, CVE-2026-109618 and CVE-2026-109619](/signals/php2shell-unauth-rce-cve-2026-109618) (KEV 26 October)
- [SSHole, CVE-2026-123158](/signals/openssh-musl-auth-bypass-cve-2026-123158) (KEV 9 November)
- [Java4Shell, CVE-2026-114938](/signals/java4shell-openjdk-base64-cve-2026-114938) is the 17 November CISA *alert*. It is not a row in the KEV JSON.

## 25 November — ten additions

[CISA’s alert](https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog) names these, and only these type strings:

| CVE | CISA’s name |
|-----|-------------|
| CVE-2023-25914 | Danfoss AK-SM 800A path traversal |
| CVE-2023-25915 | Danfoss AK-SM 800A improper input validation |
| CVE-2025-41450 | Danfoss AK-SM 800A improper authentication |
| CVE-2026-103406 | HPE Juniper Session Smart Conductor and Router, OS command injection |
| CVE-2026-133275 | Mitel MiCollab, unrestricted upload of a dangerous file type |
| CVE-2026-133303 | Mitel MiCollab, XML injection |
| CVE-2026-133311 | Mitel MiCollab, weak authentication |
| CVE-2026-133323 | Mitel MiCollab, OS command injection |
| CVE-2026-133324 | Mitel MiCollab, not failing securely |
| CVE-2026-133469 | Vates Xen Orchestra, improper validation of a specified type of input |

The three Danfoss IDs are 2023 and 2025. They are new to *this* catalog drop, not new bugs.

## 24 November — three additions

[The alert](https://www.cisa.gov/news-events/alerts/2026/11/24/cisa-adds-three-known-exploited-vulnerabilities-catalog):

| CVE | CISA’s name |
|-----|-------------|
| CVE-2026-131914 | Idunno AntiCsrf, deserialization of untrusted data |
| CVE-2026-132165 | Drupal core, remote code execution |
| CVE-2026-132224 | Optimizely Web Experimentation — [dedicated Signal](/signals/optimizely-web-experimentation-cve-2026-132224) |

## 20 November — four additions

[The alert](https://www.cisa.gov/news-events/alerts/2026/11/20/cisa-adds-four-known-exploited-vulnerabilities-catalog):

| CVE | CISA’s name |
|-----|-------------|
| CVE-2025-42884 | SAP NetWeaver, improper neutralization of special elements in a data query |
| CVE-2026-76466 | Cisco Expressway Series, hard-coded credentials |
| CVE-2026-123890 | VMware vCenter, authentication bypass using an alternate path or channel |
| CVE-2026-129448 | Apache Roller, deserialization of untrusted data |

## Earlier in the window, still without their own Signal

These IDs were on the catalog pass and still have no file of their own. The class words are not repeated here, because those catalog descriptions were not re-opened for this card. Confirm each one in the [KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) before you treat the row as a specific bug class.

- Citrix NetScaler: CVE-2026-88771, CVE-2026-88772, CVE-2026-88779. The existing NetScaler note is [CVE-2026-19490](/signals/cisa-kev-september-8-9-2026).
- Ivanti Connect Secure: CVE-2026-104935, CVE-2026-111357, CVE-2026-118527.
- Barracuda: CVE-2026-116606, CVE-2026-111560.
- PAN-OS: CVE-2026-0322.
- Cisco Secure Email Gateway: CVE-2026-76461, CVE-2026-76519.
- Check Point: CVE-2026-85102, CVE-2026-93616.
- F5 BIG-IP APM: CVE-2026-94127.
- Cisco ISE: CVE-2026-76460. [Cisco’s advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-ISE-ABP-VNSW7Tn5) is the vendor page the pass cited.
- SonicOS SSLVPN: CVE-2026-19868. The existing SonicWall file is [SMA1000](/signals/sonicwall-sma1000-ssrf-rce-cve-2026-83548).
- WordPress core: CVE-2026-87902. The existing WordPress file is [WP2Shell](/signals/wp2shell-wordpress-sqli-rce-cve-2026-63030).
- Catalyst SD-WAN Manager: CVE-2026-76504.
- LiteLLM: CVE-2026-40217. The existing LiteLLM file is [CVE-2026-42208](/signals/litellm-proxy-sqli-cve-2026-42208).
- Also still unfiled: FortiMail CVE-2026-104286, Arista VeloCloud CVE-2026-93952, GitLab CVE-2026-85706 (not [CVE-2026-110264](/signals/gitlab-regex-compiler-rce-cve-2026-110264)), SharePoint CVE-2026-65660, ScreenConnect CVE-2026-84869, AhsayCBS CVE-2026-105133 and CVE-2026-105134, JFrog CVE-2026-42016 and CVE-2026-42018 (the existing Artifactory file is [CVE-2026-82329](/signals/jfrog-artifactory-auth-bypass-cve-2026-82329)).

CVE-2026-20182 (Cisco Catalyst SD-WAN Controller, Manager, and Validator) has been on KEV since May 2026. The CVE.now critical feed’s 26 November update only recorded that public exploit code exists. [Cisco’s advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-sdwan-rpa2-v69WY2SW) is the vendor page. It is a backfill, not a November discovery.

## NightmareEclipse, same window

Three repos on Project Nightcrawler have no Signal yet. The pages were opened. The claims below are the README titles, not a reproduced result, and none of them names a CVE.

- [FastUnlock](https://git.projectnightcrawler.dev/NightmareEclipse/FastUnlock) (commits through 21 November): the author calls it a Windows Narrator lock-screen bypass that can get past BitLocker and run as the lock-screen account `WsiAccount`.
- [SignDrop](https://git.projectnightcrawler.dev/NightmareEclipse/SignDrop) (10 November): the author calls it a Common Log File System local privilege escalation.
- [BigDiskBuster](https://git.projectnightcrawler.dev/NightmareEclipse/BigDiskBuster) (19 September): the author calls it a Windows Defender update denial of service, in the same family as [UnDefend](/signals/undefend-defender-dos-cve-2026-45498), and says the proof of concept is buggy.

## What was checked and is not a new story

CVE.now is up. `latest.md` is a newest-first CVE feed, 100 to a page, not a September-to-November archive. The critical JSON feed is KEV, or CVSS at least 9.0 on a tracked product, or EPSS at least 10% with CVSS at least 7.0. Church of Malware’s visible 25 November brief restates the same KEV items. vx-underground loaded and then showed an empty file list. Sploitus still shows [React2Shell](/signals/react2shell-cve-2025-55182), which is already indexed.

## Operator order

1. Internet-facing, from the alerts actually re-read: Drupal core, MiCollab, Juniper Session Smart, Xen Orchestra, vCenter, Cisco Expressway.
2. Then the edge products in the earlier list: NetScaler, Connect Secure, Barracuda, PAN-OS, Secure Email Gateway, Check Point, F5 APM, ISE, SonicOS SSLVPN.
3. The dedicated Signals (Optimizely, PHP, OpenSSH, the GitLab regex compiler, Node.js Brotli) are the rows where versions were checked. Do not invent a build number from this cluster.

## Related Signals

- [CISA KEV 8–9 September](/signals/cisa-kev-september-8-9-2026)
- [CISA KEV early September](/signals/cisa-kev-september-2026-cluster)
- [Optimizely](/signals/optimizely-web-experimentation-cve-2026-132224)
- [php2shell](/signals/php2shell-unauth-rce-cve-2026-109618)
- [SSHole](/signals/openssh-musl-auth-bypass-cve-2026-123158)
- [Java4Shell](/signals/java4shell-openjdk-base64-cve-2026-114938)

## Sources

- [CISA — 10 KEV additions, 25 November 2026](https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog)
- [CISA — three KEV additions, 24 November 2026](https://www.cisa.gov/news-events/alerts/2026/11/24/cisa-adds-three-known-exploited-vulnerabilities-catalog)
- [CISA — four KEV additions, 20 November 2026](https://www.cisa.gov/news-events/alerts/2026/11/20/cisa-adds-four-known-exploited-vulnerabilities-catalog)
- [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [FastUnlock](https://git.projectnightcrawler.dev/NightmareEclipse/FastUnlock)
- [SignDrop](https://git.projectnightcrawler.dev/NightmareEclipse/SignDrop)
- [BigDiskBuster](https://git.projectnightcrawler.dev/NightmareEclipse/BigDiskBuster)
