---
title: "ek0ms savi0r Publishes REAPER GitHub Secret Scanner"
slug: "com-reaper-github-secrets-scanner"
date: 2026-06-19
type: news
category: news
tags: [tools, github, secrets, offensive]
excerpt: "ek0ms savi0r publishes REAPER on Church of Malware git — Go-based GitHub hidden secret scanner."
source: "Church of Malware"
sourceUrl: "https://git.churchofmalware.org/ek0mssavi0r/REAPER"
draft: false
---

## Summary

Church of Malware git received three new repositories on June 19, 2026 from founder ek0ms savi0r. REAPER is a Go-based GitHub hidden secret scanner and exploiter. Companion releases include GATEkeeper (network request/response/console capture) and noauth_finder (unauthenticated web interface discovery). All three repos updated within hours on June 19.

REAPER targets exposed credentials in public and private GitHub repositories — tooling positioned for authorized red team, bug bounty, and defensive audit workflows. Unauthorized use is illegal.

## REAPER — Technical Overview

### Purpose

REAPER automates discovery of secrets embedded in GitHub repositories beyond surface-level `git grep`:

- Commit history mining — scans all commits, not just HEAD
- Deleted file recovery — secrets in removed files often persist in git objects
- Fork divergence — compares fork histories for leaked keys in abandoned branches
- Gist correlation — links repository authors to associated gists
- Organization enumeration — scales across org member repos

### Architecture

| Component | Function |
|-----------|----------|
| Scanner core | Go — concurrent repo cloning and object traversal |
| Pattern engine | Regex + entropy scoring for API keys, tokens, passwords |
| Exploit module | Validates found credentials against live services (optional) |
| Output | Structured JSON/CSV for pipeline integration |

### Differentiation from TruffleHog / Gitleaks

REAPER emphasizes exploitation validation and GitHub-specific attack paths (fork PR secret leaks, issue attachment mining, wiki history) rather than passive pattern matching alone. The "exploiter" designation indicates active credential verification — distinguishing it from pure SAST secret scanners.

## Companion Tools

### GATEkeeper

Network debugging utility capturing:

- HTTP request/response pairs
- WebSocket frames
- Browser console output
- TLS session metadata

Use case: debugging C2 traffic during authorized engagements or malware analysis sessions.

### noauth_finder

Scans for unauthenticated administrative interfaces on:

- Local network ranges
- Internet-wide target lists

Discovers exposed panels (Jenkins, Docker, Kibana, router admin) without credentials — common initial access vector in red team and adversary tradecraft.

## Operational Considerations

### Defensive Use

- CI/CD audit — run against org repos before attackers do
- Bounty recon — authorized scope secret hunting
- Incident response — rapid credential exposure assessment after breach

### Offensive Use (Authorized Only)

- Red team initial access via leaked cloud keys
- Penetration test credential discovery phase

### Legal Boundary

Using REAPER against repositories without explicit authorization violates CFAA (US), Computer Misuse Act (UK), and equivalent statutes globally. Tools hosted on Church of Malware git follow offensive security community norms — authorization is non-negotiable.

## Church of Malware Context

Church of Malware (`churchofmalware.org`) operates as an offensive security community sanctuary hosting tools, scripture (articles), and git repositories outside mainstream platforms. The Community Codex Edition 01 (Summer 2026) remains active.

ek0ms savi0r's June 19 triple release suggests a coordinated tooling drop — REAPER for secret access, GATEkeeper for traffic analysis, noauth_finder for surface discovery form a reconnaissance toolchain.

## Repository Links

| Tool | Repository |
|------|------------|
| REAPER | `git.churchofmalware.org/ek0mssavi0r/REAPER` |
| GATEkeeper | `git.churchofmalware.org/ek0mssavi0r/GATEkeeper` |
| noauth_finder | `git.churchofmalware.org/ek0mssavi0r/noauth_finder` |

## Mitigation (Defenders)

If REAPER can find your secrets, attackers will too:

1. Rotate exposed keys — assume all historical commits are compromised.
2. BFG Repo-Cleaner / git filter-repo — purge secrets from history (rotation still required).
3. GitHub secret scanning — enable push protection and alert routing.
4. Prevent fork leaks — restrict fork permissions on sensitive repos.
5. Pre-commit hooks — gitleaks/trufflehog in developer workflow.

## Timeline

| Date | Event |
|------|-------|
| 2026-06-19 08:00 UTC | REAPER repository initial publish |
| 2026-06-19 10:30 UTC | GATEkeeper published |
| 2026-06-19 14:00 UTC | noauth_finder published |
| 2026-06-19 | All three repos receive updates within hours |

## Sources

- [Church of Malware Git — REAPER](https://git.churchofmalware.org/ek0mssavi0r/REAPER)
- [churchofmalware.org](https://churchofmalware.org/)
