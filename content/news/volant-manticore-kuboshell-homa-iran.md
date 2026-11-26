---
title: "Volant Manticore: Iran-Linked MuddyWater Spin-Off Hits Cyprus & Saudi Healthcare"
slug: "volant-manticore-kuboshell-homa-iran"
date: 2026-11-24
type: news
category: news
tags: [iran, apt, malware, ipfs, rmm, phishing]
excerpt: "Check Point Research identified Volant Manticore, a former MuddyWater operator spin-off pairing IPFS-C2 backdoor KuboShell, the Homa Framework, and commercial RMM tools against Cyprus critical infrastructure and Saudi healthcare."
source: "Check Point Research"
sourceUrl: "https://research.checkpoint.com/2026/volant-manticore-flying-under-the-radar/"
draft: false
---

## Summary

On **24 November 2026**, **Check Point Research** disclosed **Volant Manticore**, an Iran-nexus threat group assessed with high confidence to be Iranian (medium confidence of historical MOIS links) and medium confidence to be an independent spin-off of former **MuddyWater** operators (likely diverging around 2023 as MuddyWater retired **MuddyC2Go**). Historically focused on Cyprus—including telecommunications, airlines, critical infrastructure, and a suspected January 2026 government target (`MilitaryHeritageProposal.doc`)—the group abruptly shifted in **September 2026** into high-volume "spray-and-pray" phishing targeting **Saudi Arabian organizations**, heavily concentrated in **healthcare**.

Operators deploy custom tooling (**KuboShell**, a 64-bit Windows backdoor communicating through Pinata's IPFS pinning API and gateway, and the 3-stage JavaScript **Homa Framework**, which directly reimplements the legacy MuddyC2Go client protocol) alongside legitimate remote monitoring tools (**NetLock RMM**, **MeshCentral**, and **N-able RMM**).

## Tooling, TTPs & targeting pivot

- **KuboShell (64-bit Windows IPFS implant):** Uses a hard-coded Pinata access token to upload `<MAC>.log`, polls Pinata every 60 seconds for `<MAC>.txt`, resolves its IPFS CID to fetch commands via Pinata's public gateway, executes them in hidden PowerShell, and uploads results from `C:\Users\Public\<MAC>re.txt` (`F:\homa\` PDB path observed in Saudi samples).
- **Homa Framework (3 stages):** Stage 1 and 2 PowerShell loaders decode and compile XOR-encoded JScript via `Add-Type -Language JScript` before launching Stage 3—a JavaScript backdoor reimplementing the legacy **MuddyC2Go** HTTP C2 protocol (observed C2 **`185.205.187[.]109:8000`**, earlier **`185.205.187[.]107`**; writes command output to `C:\Users\Public\outputt2.txt`).
- **`MilitaryHeritageProposal.doc` (Jan 2026):** Cyprus-targeted macro document that sets `AccessVBOM = 1`, injects Stage 2 into a hidden `WINWORD.EXE` instance while killing visible Word windows, writes output to `C:\ProgramData\UiAutomation.txt`, and beacons to **`185.205.187[.]108:25498`**.
- **September 2026 Saudi healthcare surge:** Amid escalating regional tensions involving Saudi Arabia and Houthi forces, operators abruptly blasted both generic (`Excel Online.zip`) and medical lures (`AI_Healthcare_Seminar.zip`, `برنامج الاعتماد المشترك في السياحة العلاجية.zip` / *Joint Accreditation Program in Medical Tourism*), hastily reusing Cyprus domain **`cnpcyprus[.]net`** on a Saudi-based HostZealot VPS (**`185.253.118[.]221`**) with an exposed directory listing on port 4444.

## Key Indicators of Compromise

- **C2 / Infrastructure IPs:** `185.205.187[.]109`, `185.205.187[.]107`, `185.205.187[.]108`, `185.106.102[.]70`, `185.253.118[.]221`
- **C2 / Phishing / Spoofed Domains:** `cnpcyprus[.]net`, `medochomie[.]com`, `gatewaynet[.]site`, `portal-gateway[.]net`, `cabelenet[.]com`, `primtel-tel[.]com`, `primetel-tel[.]com`, `webmail-eac[.]com`, `aegeneair[.]com`, `gapgroups[.]com`, `dpwords[.]com`, `websitegate[.]net`, `corenewsnetwork[.]com`, `liveupdatenews[.]net`
- **Representative Sample Hashes (SHA-256):** `684f748deceabf0fbb789ce11cc748ec62ea7e218f44289557e733509ec9b250` (`KuboShell` / `Athena Marinou-CV.exe`), `8657c350a2cf338721ade0bba8bd976cdd0c6e21fb7d5052eec24f8a034d7f7f` (`AI_Healthcare_Seminar.exe`), `2477bbf0ab3f0c9db73fcb2f5f9dfe8cf6703a88862a7c98a5de6f349cd8833f` (`MilitaryHeritageProposal.doc`)

## Operator actions

1. Block the Volant Manticore network indicators and alert on unauthorized installations or executions of **NetLock RMM**, **MeshCentral**, and **N-able RMM** outside approved IT service workflows.
2. Monitor workstation and server egress to **Pinata IPFS** gateways (`gateway.pinata.cloud` / `api.pinata.cloud`) from non-blockchain hosts, plus Office `AccessVBOM` registry modifications (`HKCU\SOFTWARE\Microsoft\Office\16.0\Word\Security\AccessVBOM = 1`).
3. Hunt mail logs and proxy records across Cyprus and Saudi healthcare/enterprise entities back to January 2026 for credential-harvesting domains spoofing local telecoms, airlines, and ADFS (`federation.aegeneair[.]com`).

## Sources

- [Check Point Research — Volant Manticore: Flying Under the Radar (24 Nov 2026)](https://research.checkpoint.com/2026/volant-manticore-flying-under-the-radar/)
- [The Hacker News — Volant Manticore Targets Cyprus & Saudi Entities](https://thehackernews.com/2026/11/iran-linked-volant-manticore-targets.html)
