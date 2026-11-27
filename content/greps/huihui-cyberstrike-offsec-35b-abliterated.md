---
title: "Huihui-CyberStrike-OffSec-35B-abliterated — Uncensored Qwen3.5 OffSec MoE"
slug: "huihui-cyberstrike-offsec-35b-abliterated"
date: 2026-11-27
type: grep
category: pentest
tags: [huihui, abliterated, uncensored, qwen3.5, moe, pentest, tool-calling, offensive-security]
excerpt: "huihui-ai's 35.9B BF16 refusal-removed MoE built on oyildirim/CyberStrike-OffSec-35B with XML tool-calling and NVFP4 quant spins; distinct from the open-source CyberStrikeAI orchestration console cited by Swiss NCSC."
author: huihui-ai
hfModelId: huihui-ai/Huihui-CyberStrike-OffSec-35B-abliterated
hfUrl: https://huggingface.co/huihui-ai/Huihui-CyberStrike-OffSec-35B-abliterated
source: Hugging Face
downloads: 1212
likes: 120
pipelineTag: text-generation
baseModel: oyildirim/CyberStrike-OffSec-35B
draft: false
---

## What Is This?

Published on Hugging Face by **huihui-ai** (Apache-2.0, `1,212` downloads, `120` likes, active downstream quantizations including **27 November 2026** `disillusioned/Huihui-CyberStrike-Offsec-35B-abliterated-NVFP4`), this is a BF16 refusal-removed spin of **`oyildirim/CyberStrike-OffSec-35B`**, a 35.9B-parameter `Qwen3_5MoeForConditionalGeneration` offensive-security and tool-calling fine-tune.

*Clarification:* Despite sharing the word "CyberStrike", this Hugging Face model weight should **not be conflated** with **`CyberStrikeAI`** (the Go/MCP-style autonomous attack orchestration console highlighted alongside `ARTEX` in the [Swiss NCSC AI-agent advisory](/signals/swiss-ncsc-agentic-ai-intrusions-2026)), though open tool-calling OffSec weights are natural drop-in backends for self-hosted consoles.

## Metadata

| Field | Value |
|-------|-------|
| Author | huihui-ai |
| Base | `oyildirim/CyberStrike-OffSec-35B` (`Qwen3.5 MoE`, 35.95B BF16) |
| Size on disk | ~71.9 GB (`16` safetensors shards + `Qwen3.6-35B-A3B` MTP weights) |
| Capabilities | `<tool_call>` XML function calling, multimodal processor config, reasoning toggle |
| Downloads / Likes | 1,212 downloads / 120 likes (HF API, 2026-11-27; active NVFP4 derivative 2026-11-27) |
| License | Apache-2.0 |

## Why It Matters

- **Tool-calling + OffSec tuning + abliteration:** Standard refusal removal often degrades strict JSON/XML tool schemas; weights fine-tuned on offensive workflows and wrapped in `Qwen3.5 MoE` keep structured `<function=...>` call templates intact while stripping safety refusals.
- **Active edge quantization:** New NVFP4 / GGUF repackagings keep this 35B MoE accessible on workstation-class GPUs for local red-team benchmarking and autonomous agent harnesses.

## Read More

- [Swiss NCSC Confirms First AI-Agent Cyberattacks Against Critical Infrastructure](/signals/swiss-ncsc-agentic-ai-intrusions-2026)
- Sibling OffSec MoE: [RavenX CyberAgent — Qwen3.6 Pentester & Bug Hunter](/greps/ravenx-cyberagent-qwen36-pentester)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **huihui-ai**.
