---
title: "Peyara Remote Mouse 1.0.1 Unauthenticated RCE"
slug: "peyara-remote-mouse-rce-1-0-1"
date: 2026-06-29
type: news
category: news
tags: [peyara, rce, websocket, windows, remote-access]
excerpt: "WebSocket keyboard simulation on port 1313 chains to arbitrary commands; indexed PoCs include Python and LNK upload variants."
source: "Sploitus"
sourceUrl: "https://sploitus.com/exploit?id=MSF:EXPLOIT-WINDOWS-MISC-PEYARA_REMOTE_MOUSE_RCE-"
draft: false
---

## Summary

**Peyara Remote Mouse v1.0.1** ([peyara-remote-mouse.vercel.app](https://peyara-remote-mouse.vercel.app/)) is an open-source Wi-Fi mouse/keyboard server for Windows/macOS/Linux with unauthenticated remote code execution via the **WebSocket command interface on port 1313**. PoCs ([capture0x/Peyara](https://github.com/capture0x/Peyara), [capture0x/Peyara-FileUpload](https://github.com/capture0x/Peyara-FileUpload)) and Rapid7's Metasploit module `exploit/windows/misc/peyara_remote_mouse_rce` demonstrate command execution without authentication.

Upstream desktop client: [ayonshafiul/peyara-mouse-client](https://github.com/ayonshafiul/peyara-mouse-client). v1.0.1 is the vulnerable desktop line called out in public exploits (current site also lists v2.0.4 — verify version separately).

## Key Findings

| Finding | Detail |
|---------|--------|
| Affected version (indexed) | Peyara Remote Mouse **v1.0.1** (Windows) |
| Surface | WebSocket keyboard events + HTTP `:1313/upload` |
| Auth | None on command channel |
| PoC paths | Keyboard chaining to cmd/powershell; malicious LNK upload + execution |
| Attacker position | LAN or exposed 1313/tcp |

## Attack Chain

```text
Connect ws://target:1313
        ↓
Send crafted keyboard event sequence (Win+R, cmd, commands…)
        ↓
Arbitrary command execution as desktop user
Alternate: POST /upload evil.lnk → trigger execution via keyboard automation
```

## Impact

Full workstation compromise for users running the vulnerable server on reachable networks — common in home-lab and convenience-remote-desktop scenarios.

## Mitigation

1. Upgrade to a patched Peyara release if available; otherwise stop exposing port 1313 to untrusted networks.
2. Firewall block **1313/tcp** from non-management VLANs.
3. Inventory for Peyara/Remote Mouse listeners in enterprise egress and LAN scans.

## Related Signals

- [RustDesk session PoCs](/signals/exploitarium-rustdesk-session-permission-pocs)
- [AnyDesk printer LPE](/signals/exploitarium-anydesk-printer-com-impersonation-poc)

## Sources

- [GitHub — capture0x/Peyara](https://github.com/capture0x/Peyara)
- [GitHub — capture0x/Peyara-FileUpload](https://github.com/capture0x/Peyara-FileUpload)
- [Peyara Remote Mouse site](https://peyara-remote-mouse.vercel.app/)
- [Sploitus — Peyara Remote Mouse RCE](https://sploitus.com/exploit?id=MSF:EXPLOIT-WINDOWS-MISC-PEYARA_REMOTE_MOUSE_RCE-)