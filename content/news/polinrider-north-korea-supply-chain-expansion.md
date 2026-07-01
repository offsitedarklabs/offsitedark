---
title: "PolinRider NK Supply Chain Hits Go, Packagist, Chrome"
slug: "polinrider-north-korea-supply-chain-expansion"
date: 2026-07-01
type: news
category: news
tags: [supply-chain, npm, lazarus, north-korea, go, packagist, chrome, malware]
excerpt: "162 malicious artifacts across 108 packages in npm, Go, Packagist, and Chrome; DPRK-linked loaders hide in config files and fake .woff2 fonts."
source: "Socket"
sourceUrl: "https://socket.dev/blog/polinrider-north-korea-linked-supply-chain-campaign-expands"
draft: false
---

## Summary

PolinRider — a supply chain campaign linked to North Korean actors in the Contagious Interview / Famous Chollima cluster — has expanded beyond npm into Go modules, Packagist, and Chrome extensions. Socket Threat Research identified **162 malicious release artifacts** across **108 unique packages**, including compromise traces in **80 Go modules**, **10 Packagist packages**, and **one Chrome extension**. The campaign remains active; new malicious versions continue appearing as maintainers are compromised and registry access is abused.

Core tradecraft is unchanged: obfuscated JavaScript loaders planted in legitimate repositories, hidden via whitespace padding or fake `.woff2` font files, triggered through VS Code `tasks.json` with `"runOn": "folderOpen"`. Attackers rewrite Git history with force pushes and anti-dated commits so malicious changes appear months old on the default file view. GitHub landing pages and visible commit timestamps are unreliable compromise indicators.

After deobfuscation, the loader fetches encrypted second-stage code from blockchain RPC infrastructure on **TRON**, **Aptos**, and **BNB Smart Chain**, decrypts with embedded XOR keys, and executes via `eval()`. Observed follow-on payloads include **DEV#POPPER** and **OmniStealer** (command execution, `socket.io-client` C2, credential and wallet theft). The loader design can deliver additional malware. Any environment that installed affected versions should be treated as compromised.

## Key Findings

| Finding | Detail |
|---------|--------|
| Attribution | North Korea — Contagious Interview / Famous Chollima developer-targeting cluster |
| Scale | 162 malicious release artifacts; 108 unique packages/extensions |
| Ecosystems | npm, Go modules (80), Packagist (10), Chrome extensions (1) |
| Primary vectors | Maintainer account takeover; malicious registry publishes; config-file injection |
| Payload hiding | Whitespace-padded one-liners in `*config.js`; fake `.woff2` fonts executed via VS Code tasks |
| Stage-two C2 | Blockchain dead drops — TRON, Aptos, BNB Smart Chain |
| Observed malware | DEV#POPPER RAT, OmniStealer |
| History evasion | Force pushes; anti-dated commits; Activity tab reveals rewrites invisible on main file view |
| Tracking | Live artifact list at [socket.dev/supply-chain-attacks/polinrider](https://socket.dev/supply-chain-attacks/polinrider) |

## Campaign Timeline

| Date | Event |
|------|-------|
| Prior waves | npm typosquats and GitHub config injection documented by OpenSourceMalware; merger with TasksJacker cluster |
| 2026-01-08 (backdated) | Anti-dated commits insert PolinRider payloads into 7span repositories |
| 2026-05-16 | 7span maintainers remove fake `.woff2` payloads from one repo; config-file variants remain |
| 2026-06-23 10:00 UTC | Bulk synchronized modification of multiple `Xpos587` GitHub repositories |
| 2026-06-23+ | Malicious Go module releases published under compromised `Xpos587` account |
| 2026-07-01 | Socket publishes expansion analysis across four ecosystems |

## Attack Chain

### Stage 0 — Access and planting

Threat actors compromise GitHub maintainer accounts — suspected paths include expired domain takeover and account recovery abuse. With repository and registry credentials, they modify multiple projects in narrow time windows and publish malicious package versions downstream.

### Stage 1 — Loader concealment

Two primary hiding methods observed in the latest wave:

1. **Config-file injection** — obfuscated JavaScript appended after legitimate content in `postcss.config.mjs`, `vite.config.js`, `eslint.config.js`, and similar `*config.js` files. One-line payloads padded with whitespace push executable code past default editor width.
2. **Fake font execution** — JavaScript loader embedded in `.woff2` files; `.vscode/tasks.json` defines a hidden task with `"runOn": "folderOpen"` that runs the font file with `node`.

### Stage 2 — Blockchain fetch and execution

Deobfuscated loader contacts TRON, Aptos, and BNB Smart Chain RPC endpoints, retrieves XOR-encrypted second-stage material, decrypts, and `eval()`s the result.

### Stage 3 — Infostealer / RAT

DEV#POPPER and OmniStealer provide remote command execution, persistent C2 over `socket.io-client`, browser credential theft, and cryptocurrency wallet exfiltration.

## Recent Compromise Cases

### Xpos587 GitHub account (Go modules)

Multiple unrelated repositories under [Xpos587](https://github.com/Xpos587?tab=repositories) were modified in the same window on June 23 at 10:00 UTC — consistent with account-level takeover, not per-project maintenance. The main file view for `Xpos587/markfetch` shows months-old benign commits; the GitHub **Activity** tab reveals a recent force push rewriting prior history.

Malicious Go module release: [`github.com/Xpos587/git2md`](https://socket.dev/go/package/github.com/Xpos587/git2md?version=v0.0.0-20260503100027-79bdb26ca95d) (`v0.0.0-20260503100027-79bdb26ca95d`). The `markfetch` repo used the fake-font variant; [Artiffusion-Inc/mirofish](https://github.com/Artiffusion-Inc/mirofish) received a payload in `vite.config.js` from the same user. No malicious PyPI releases observed — attackers may have lacked PyPI publishing credentials.

### 7span / sevenspan (Packagist)

PolinRider expanded into Packagist under the `sevenspan` namespace maintained by [7span](https://github.com/7span). Maintainers detected and removed fake `.woff2` font files but missed obfuscated JavaScript still present in configuration files such as [`7span/react-list` `vite.config.js`](https://github.com/7span/react-list/commit/1c1d61bfe82e5a3a907a234599f3a8f510c10094). Partial cleanup left residual infection. No corresponding malicious npm releases from the same organization in this case — npm publishing secrets may not have been obtained.

## Affected Artifacts (Latest Wave IOCs)

| Indicator | Type |
|-----------|------|
| `Xpos587` | Compromised GitHub account |
| `Xpos587/git2md` | Malicious Go module repository |
| `Xpos587/markfetch` | Repository — fake `.woff2` + VS Code task variant |
| `Artiffusion-Inc/mirofish` | Repository — `vite.config.js` injection |
| `sevenspan` | Compromised Packagist namespace |
| `7span` | GitHub organization |
| `7span/react-list` | Repository — residual config-file payload |

Full package/version list maintained at [Socket PolinRider tracking page](https://socket.dev/supply-chain-attacks/polinrider).

## Detection

- **GitHub Activity tab** — inspect force pushes and history rewrites; do not rely on main branch file view alone.
- **VS Code tasks** — audit `.vscode/tasks.json` for `"runOn": "folderOpen"` executing non-standard file types (especially `node *.woff2`).
- **Config files** — diff `vite.config.js`, `eslint.config.js`, `postcss.config.mjs`, and `tailwind.config.js` for trailing obfuscated JavaScript or abnormal line length.
- **Font directories** — `.woff2` files containing JavaScript rather than font tables.
- **Registry metadata** — unexpected releases after repository modification, especially cross-ecosystem publishes from the same maintainer.
- **Network** — developer workstations contacting TRON/Aptos/BSC RPC endpoints during build or folder-open events.

## Mitigation

1. Treat any machine that installed affected versions as compromised until reviewed.
2. Preserve forensic artifacts before cleanup.
3. Inventory all developer machines that resolved affected package versions.
4. Remove affected versions; rebuild from known-good lockfiles on clean hosts.
5. Rotate npm, GitHub, PyPI, Packagist, cloud, Vault, Kubernetes, Docker, SSH, Slack, Twilio, and CI/CD secrets from a **clean machine**.
6. Audit VS Code task configurations and repository Activity logs across owned orgs.
7. Block known malicious packages at artifact proxy; monitor [Socket tracking page](https://socket.dev/supply-chain-attacks/polinrider) for new artifacts.

## Related Signals

- [Mastra NPM scope compromise](/signals/mastra-npm-crypto-stealer) — Lazarus-linked npm typosquat and extension stealer tradecraft (June 2026)
- [GitHub trojan malware campaign](/signals/github-trojan-malware-campaign) — large-scale GitHub README delivery vector (distinct operation, same trust-abuse pattern)

## Sources

- [Socket — PolinRider expands across open source ecosystems](https://socket.dev/blog/polinrider-north-korea-linked-supply-chain-campaign-expands)
- [Socket — PolinRider live tracking page](https://socket.dev/supply-chain-attacks/polinrider)
- [eSentire — DEV#POPPER RAT and OmniStealer analysis](https://www.esentire.com/blog/north-korean-apt-malware-analysis-dev-popper-rat-and-omnistealer-everyday-im-shufflin)
- [OpenSourceMalware — PolinRider campaign repository](https://github.com/OpenSourceMalware/PolinRider)
