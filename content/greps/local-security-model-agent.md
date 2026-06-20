---
title: "Local Security Model — Autonomous Pentest Agent Framework"
slug: "local-security-model-agent"
date: 2026-06-01
type: grep
category: pentest
tags: [pentest, autonomous-agent, mcp, kali, flask, qwen2.5]
excerpt: "Uploaded to Hugging Face by automajicly — Qwen2.5 1.5B-based project tagged as local pentest agent with MCP and Kali Linux integration."
author: automajicly
hfModelId: automajicly/Local_Security_Model
hfUrl: https://huggingface.co/automajicly/Local_Security_Model
source: Hugging Face
downloads: 0
likes: 1
pipelineTag: text-generation
baseModel: Qwen/Qwen2.5-1.5B-Instruct-GGUF
draft: false
---

## What Is This?

Uploaded to Hugging Face by **automajicly**. **Local_Security_Model** is tagged as a full project artifact — not just weights — combining a fine-tuned **Qwen2.5 1.5B** model with Python/Flask infrastructure for local autonomous security testing.

## Metadata

| Field | Value |
|-------|-------|
| Author | automajicly |
| Base model | Qwen/Qwen2.5-1.5B-Instruct-GGUF |
| Library | other (full project) |
| License | MIT |
| Tags | MCP, Kali Linux, bug bounty, ethical hacking |

## Tagged Components

Model card tags suggest bundled capabilities:

- **MCP server / agent loop** — Model Context Protocol tool orchestration
- **Kali Linux** — offensive tooling environment integration
- **Flask** — local web UI or API wrapper
- **Pentesting tools** — external binary invocation

## Why It Might Matter

This upload represents the **agent-as-repo** pattern — Hugging Face hosting not just tensors but runnable attack-surface automation. Research value:

- Audit MCP tool permissions and command injection boundaries
- Measure 1.5B model adequacy for multi-step pentest planning vs. larger agents (RavenX, ArmurAI)
- Study how "ethical hacking" framing affects model refusal rates

## Caution

Projects bundling agents + tool execution carry **higher operational risk** than static weights. Treat repository code as untrusted; run only in isolated VMs.

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **automajicly**.
