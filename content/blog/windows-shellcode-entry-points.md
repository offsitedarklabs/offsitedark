---
title: "Windows Shellcode Entry Points"
slug: "windows-shellcode-entry-points"
date: 2026-06-10
type: research
category: reversing
tags: [windows, shellcode]
excerpt: "A survey of shellcode entry techniques on modern Windows x64."
draft: false
---

Modern Windows x64 shellcode must navigate ASLR, DEP, CFG, and EDR userland hooks.

## Direct Syscalls

Bypassing hooked `ntdll` stubs by invoking syscalls directly remains foundational. SSN resolution from clean `ntdll` copies is well-documented but implementation details matter.

## Indirect Syscalls

Jump into a legitimate `syscall; ret` gadget inside `ntdll` to preserve return address chains expected by kernel callbacks.

## Stack Alignment

On x64 Windows the stack must be 16-byte aligned before a `call`. Neglect this and chained API calls crash silently.
