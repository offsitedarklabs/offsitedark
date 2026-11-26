---
title: "PolinRider DPRK Campaign Plants Python Loaders Using Ethereum Calldata"
slug: "polinrider-python-ethereum-calldata-loader"
date: 2026-11-25
type: news
category: news
tags: [supply-chain, north-korea, python, github, malware, crypto]
excerpt: "SafeDep uncovered 375 GitHub repositories and 260 accounts running a 58-line Python loader on pytest that pulls JavaScript payloads from Ethereum calldata, alongside Apiiro's wider 7,609-repo DPRK census."
source: "SafeDep"
sourceUrl: "https://safedep.io/blog/polinrider-python-loader-ethereum-calldata"
draft: false
---

## Summary

New telemetry from **SafeDep** (**24–26 November 2026**, following Jay Maier's report) confirms the North Korea-linked **PolinRider** (Contagious Interview / Famous Chollima) supply-chain operation has expanded into Python testing harnesses and Ethereum blockchain dead-drop resolvers. SafeDep identified **375 GitHub repositories** spanning **260 accounts** embedding a uniform **58-line Python loader** inside `conftest.py` (executing automatically whenever a developer or CI runner invokes `pytest`) or `utils/` helper modules.

This Python wave sits inside a much broader late-autumn push verified by **Apiiro** on **9 November 2026**, which mapped at least **7,609 malicious or poisoned repositories** across **2,330 GitHub accounts** (including **2,040** pushed between 27 October and 6 November alone, and a brief poison insertion into **`Neutralinojs`**), while **StepSecurity** documented the same wallet hitting open-source PRs at **AsyncAPI Generator**, **CircuitVerse**, and **Open Food Facts**.

## Execution chain (Ethereum calldata → Node.js RAT)

1. **Trigger:** Importing `utils/` modules or running `pytest` inside a cloned assessment/open-source fork executes the 58-line Python stager (`conftest.py`).
2. **Stage 1 blockchain fetch:** The Python loader queries `api.ethplorer.io` and Ethereum RPC nodes for transaction calldata sent by wallet **`0x3b1574417524c11a7403c4b232CAcBb320CceBC6`** to itself, scanning for marker **`A9-10502`** to carve out a 31 KB JavaScript payload.
3. **Stage 2 C2 resolution:** The JavaScript stage queries Ethereum wallet **`0x1eEf0849EDa15d87f64e51C73C8442Cf3c8bCEF3`** (which had rotated across multiple C2 IPs, pointing to **`95.135.181[.]84`** from 12 November), then passes subsequent `/0x/cls` and `/0x/ls` stages to the stdin of a detached interactive **`node -i`** process so no script source appears in command-line listings.
4. **Compromised contributor force-push probing:** SafeDep and StepSecurity documented that on **19 October 2026**, compromised contributor endpoints briefly force-pushed unsigned malicious JS commits (`api.js`, `jest.config.js`, `postcss.config.js`, `package.json`, `.vscode/tasks.json`) onto existing PR branches—including **`asyncapi/generator` PRs `#2277` and `#2278`** (caught by AI code review in 4 minutes, reverted within 30–40 minutes, never merged or run in CI), **Open Food Facts**, and **CircuitVerse** (where CI workflows ran the loader and published **40** affected desktop installers before maintainers removed them on **25 November**).

## Indicators of Compromise

| Indicator | Type | Role |
|-----------|------|------|
| `0x3b1574417524c11a7403c4b232CAcBb320CceBC6` | Ethereum address | Stage-1 calldata payload storage (marker `A9-10502`) |
| `0x1eEf0849EDa15d87f64e51C73C8442Cf3c8bCEF3` | Ethereum address | Stage-2 C2 configuration pointer |
| `95.135.181[.]84` / earlier `95.135.181[.]151` | IPv4 C2 | Active Node.js C2 server resolved from wallet data |
| `conftest.py` / `utils/*.py` | File paths | 58-line Python loader triggered by `pytest` or helper import |

## Operator actions

1. Search local developer workstations, CI runners, and mirrored forks for wallet strings **`0x3b1574417524c11a7403c4b232CAcBb320CceBC6`**, **`0x1eEf0849EDa15d87f64e51C73C8442Cf3c8bCEF3`**, marker **`A9-10502`**, and outbound flows to **`95.135.181[.]84`** or **`95.135.181[.]151`**.
2. Inspect `conftest.py` in unfamiliar repositories before invoking `pytest` outside disposable sandboxes—`pytest` automatically executes `conftest.py` during test discovery before any test function runs—and audit CircuitVerse desktop installers downloaded prior to 25 November.
3. Review our earlier coverage of PolinRider's npm, Go, Packagist, and VS Code waves in [PolinRider NK Supply Chain Hits Go, Packagist, Chrome](/signals/polinrider-north-korea-supply-chain-expansion).

## Sources

- [SafeDep — PolinRider Python Loader & Ethereum Calldata Analysis](https://safedep.io/blog/polinrider-python-loader-ethereum-calldata)
- [StepSecurity — PolinRider Force-Pushed Into AsyncAPI, CircuitVerse & Open Food Facts PRs](https://www.stepsecurity.io/blog/polinrider-malware-open-source-pull-requests)
- [Apiiro — Inside PolinRider, the 7,609-Repo Worm Forging Developers' Commits](https://apiiro.com/blog/polinrider-north-korea-worm-forged-github-commits)
- [The Hacker News — PolinRider Poisons GitHub Repositories](https://thehackernews.com/2026/11/north-korea-linked-polinrider-poisons.html)
