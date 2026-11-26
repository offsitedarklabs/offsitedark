---
title: "June 2026 Patch Tuesday, corrected"
slug: "patch-tuesday-zero-days"
date: 2026-06-11
type: news
category: news
tags: [windows, patches, microsoft]
excerpt: "The first draft of this Signal named the wrong day, the wrong count, and seven CVEs that are not Microsoft products. The release is 9 June 2026. Roundups count about 200 flaws. Microsoft did not mark any of them exploited."
source: "Microsoft"
sourceUrl: "https://support.microsoft.com/en-us/servicing/os/windows-11/2026/06/june-9-2026-kb5094126-os-builds-26200-8655-and-26100-8655"
draft: false
---

## What was wrong

The first draft said Microsoft shipped the June bundle on 11 June, fixed 67 CVEs, and that three of them were exploited zero-days: CVE-2026-32712 (kernel), CVE-2026-32718 (Office), and CVE-2026-32724 (CLFS). A second table added CVE-2026-32701, CVE-2026-32705, CVE-2026-32709, and CVE-2026-32715 as LDAP, SharePoint, Edge, and Azure SDK.

Those seven identifiers are GitHub CNA records. None of them is a Microsoft product, none is in CISA KEV, and none has an MSRC advisory.

| ID this Signal used | What the record actually is | CNA score |
|---------------------|-----------------------------|-----------|
| CVE-2026-32712 | Stored XSS in Open Source Point of Sale, fixed in 3.4.3. Published 7 April 2026 | 5.4 |
| CVE-2026-32718 | Incorrect authorization in Coolify before 4.0.0-beta.466 | 6.5 |
| CVE-2026-32724 | Use-after-free in PX4 Autopilot before 1.17.0-rc1 | 5.3 |
| CVE-2026-32701 | Qwik before 1.19.2 | 7.5 |
| CVE-2026-32705 | PX4 before 1.17.0-rc2 | 6.8 |
| CVE-2026-32709 | PX4 MAVLink FTP | 5.4 |
| CVE-2026-32715 | AnythingLLM through 1.11.1 | 3.8 |

## The release

June 2026 Patch Tuesday is **9 June 2026**. The Windows 11 24H2/25H2 cumulative is [KB5094126](https://support.microsoft.com/en-us/servicing/os/windows-11/2026/06/june-9-2026-kb5094126-os-builds-26200-8655-and-26100-8655), OS builds 10.0.26200.8655 and 10.0.26100.8655. Windows 10 extended security is KB5094127.

Counts depend on who is counting. [BleepingComputer](https://www.bleepingcomputer.com/news/microsoft/microsoft-june-2026-patch-tuesday-fixes-6-zero-days-200-flaws/) and [Rapid7](https://www.rapid7.com/blog/post/em-patch-tuesday-june-2026/) both say about 200 flaws released that day, and both exclude the month’s Edge/Chromium set (Rapid7 puts that browser set at 360, and notes Microsoft no longer lists those Chromium CVEs in the Security Update Guide). [IT-SB’s scrape of the Security Update Guide](https://www.it-sb.ch/en/cve.php?m=2026-06&view=ms) says 220 Microsoft CVEs for the month, 207 of them on 9 June, 48 at CVSS 9.0–10.0. Use the Update Guide if you need a ticket count. “67” was never a real total.

Microsoft’s own exploited flag for the day is **none**. Rapid7: not aware of exploitation in the wild, public disclosure for three. IT-SB: 0 exploited, 4 publicly disclosed. BleepingComputer’s headline says six zero-days and its body says five publicly disclosed plus one exploited. The one it marks exploited is CVE-2026-42897, Exchange spoofing, and the same paragraph says Microsoft was still working on a full update and was pushing a mitigation through the Exchange Emergency Mitigation Service. That is not an OS cumulative fix, and it is not confirmed by Rapid7 or by the IT-SB scrape. Treat “exploited” for 42897 as BleepingComputer’s reading until the Update Guide says the same thing.

## Publicly disclosed, in that day’s OS updates

These are the ones more than one roundup agrees were already public.

| CVE | Component | What it closes | CVSS on the roundups |
|-----|-----------|----------------|----------------------|
| [CVE-2026-45586](/signals/greenplasma-ctfmon-lpe-cve-2026-45586) | CTFMON | GreenPlasma. Local elevation to SYSTEM | 7.8 |
| [CVE-2026-45585](/signals/yellowkey-bitlocker-bypass-cve-2026-45585) | BitLocker | YellowKey. Physical access, TPM-only | 6.8 on the sister bug’s scale; see that Signal |
| [CVE-2020-17103](/signals/miniplasma-cldflt-lpe-cve-2020-17103) | `cldflt.sys` | MiniPlasma, a 2020 regression. MSRC text updated 9 June tells you to install this month’s cumulatives | 7.0 |
| CVE-2026-49160 | HTTP.sys | Public HTTP/2 denial of service. Calif (Quang Luong, Codex). New `MaxHeadersCount` registry value, [KB5102602](https://support.microsoft.com/kb/5102602) | 7.5 |
| CVE-2026-50507 | BitLocker | A second BitLocker bypass in the same cumulative. BleepingComputer and Will Dormann tie it to Jonas Lykkegaard’s bitskrieg report. Not GreatXML | 6.8 |

Rapid7’s 9 June post still listed MiniPlasma and GreenPlasma as waiting on a patch. The Update Guide text BleepingComputer quotes was already telling customers to install the June updates for MiniPlasma, and it lists CVE-2026-45586 in the same release. Prefer the guide over that paragraph.

BleepingComputer’s category split for the 200, which is their count and not a Microsoft total: 65 elevation of privilege, 19 security feature bypass, 55 remote code execution, 30 information disclosure, 7 denial of service, 27 spoofing, of which 33 are rated Critical.

Two other rows from the same day that are easy to miss because the fix shipped earlier, or because it is not Windows:

- CVE-2026-42902, PowerToys elevation to SYSTEM. Rapid7 notes the fix was already in PowerToys 0.99.1 on 29 April 2026, with no mention in those release notes.
- CVE-2026-47291, HTTP.sys remote code execution, CVSS 9.8, exploitation “more likely,” not publicly disclosed.

```powershell
Get-HotFix -Id KB5094126, KB5094127 -ErrorAction SilentlyContinue |
  Select-Object HotFixID, InstalledOn, Description
```

No row means that cumulative is not installed. It does not mean the machine is on a different servicing branch. Check the OS build against the KB that matches the SKU.

## Sources

- [KB5094126, 9 June 2026](https://support.microsoft.com/en-us/servicing/os/windows-11/2026/06/june-9-2026-kb5094126-os-builds-26200-8655-and-26100-8655)
- [BleepingComputer](https://www.bleepingcomputer.com/news/microsoft/microsoft-june-2026-patch-tuesday-fixes-6-zero-days-200-flaws/)
- [Rapid7](https://www.rapid7.com/blog/post/em-patch-tuesday-june-2026/)
- [IT-SB, Security Update Guide scrape](https://www.it-sb.ch/en/cve.php?m=2026-06&view=ms)
- [Microsoft Security Update Guide](https://msrc.microsoft.com/update-guide)
