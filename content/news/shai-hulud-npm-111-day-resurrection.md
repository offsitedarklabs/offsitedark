---
title: "Shai-Hulud Worm Returns to npm After 111 Days"
slug: "shai-hulud-npm-111-day-resurrection"
date: 2026-09-07
type: news
category: news
tags: [supply-chain, npm, worm, shai-hulud, malware]
excerpt: "Identical May 19 @antv worm payload (SHA-256 e37e3ddeeaaa…) republished in four packages on 2026-09-07 — 111 days dormant, past npm’s new publish-time scanner."
source: "Aikido"
sourceUrl: "https://www.aikido.dev/blog/shai-hulud-npm-resurfaces"
draft: false
---

## Summary

On **2026-09-07** Aikido’s Charlie Eriksen reported the **Shai-Hulud** npm worm payload from the **2026-05-19 `@antv` wave** back on the registry — **byte-identical**, same SHA-256, after **111 days** of zero new hits. Four package versions from one npm account landed in the same hour:

- `feishu-docx-mcp@0.3.2`
- `bmc-i18n-extract-cli@1.1.1`
- `blueai-cli@0.7.0`
- `bmc-translate-utils@1.1.1`

Aikido’s history for that hash: **319** package versions, all first seen **2026-05-19**, then silence until **2026-09-07**. The May wave pushed **639** malicious `@antv` versions in an hour. npm has since advertised **publish-time malware scanning** (5–15 minute hold). A hash match against a worm that made international news in May is the minimum a publish-time scanner should do; it missed this republication.

This indexing is about **scanner failure and worm persistence**, not a new payload family. A related Shai-Hulud lineage (**Trinitite**) hit `@7nohe/openapi-react-query-codegen` on **2026-08-28** with a different, more obfuscated variant — treat that as a parallel branch, not this hash.

## Key Findings

| Finding | Detail |
|---------|--------|
| Payload SHA-256 | `e37e3ddeeaaa9e0c4fdbcb829b4895a6521031c80053fc436625b61e6ee5b1a6` |
| Dormancy | 111 days (2026-05-20 → 2026-09-06) |
| 2026-09-07 packages | Four versions, one npm account, one hour |
| Historical volume | 319 versions on 2026-05-19 only, before this wave |
| Registry control claimed | npm publish-time malware scan (rolled out July 2026) |
| Install behavior | `preinstall` → `bun run index.js`; root `index.js` payload |
| Persistence artifacts | `.vscode/tasks.json`, `.claude/settings.json` |
| C2 (May wave, still listed) | `t.m-kosche.com` (defanged: `t[.]m-kosche[.]com`) |

## Worm loop (high level)

On install, the historic Shai-Hulud payload harvests publish tokens, validates them against the npm registry, pulls existing tarballs, injects itself, bumps versions, and republishes. It also mass-creates GitHub repositories with Dune-themed names and reversed “Shai-Hulud” strings in descriptions. That loop is why an identical file is still a worm, not a static trojan.

## Impact

- Any toolchain that installed one of the four September packages during the live window should be treated as a **token-theft** incident (npm, and historically GitHub).
- The strategic failure is **registry-side**: known-bad hash, public write-ups, months of vendor detections, still installable.
- Developers who “waited out” the May `@antv` incident got a second chance to pull the same bytes under new package names.

## Mitigation

1. Uninstall the four packages; rotate npm and GitHub tokens issued to machines that installed them.
2. Hunt the SHA-256, `preinstall` + `bun run index.js`, Dune-themed GitHub repos, and the May C2 host.
3. Block the payload hash at artifact proxies; do not rely on npm’s publish hold as the only control.
4. Review `.vscode/tasks.json` and `.claude/settings.json` for unexpected tasks after any npm install since 2026-09-07.
5. Pin and verify integrity hashes in lockfiles; prefer private mirrors that deny known-bad blobs.

## Related Signals

- [PolinRider NK supply chain](/signals/polinrider-north-korea-supply-chain-expansion)
- [Coder registry Terraform compromise](/signals/coder-registry-terraform-supply-chain)
- [Mastra npm crypto stealer](/signals/mastra-npm-crypto-stealer)
- [JFrog Artifactory auth bypass](/signals/jfrog-artifactory-auth-bypass-cve-2026-82329)

## Sources

- [Aikido — Shai-Hulud Rises From the Dead after 111 days](https://www.aikido.dev/blog/shai-hulud-npm-resurfaces) (2026-09-07)
