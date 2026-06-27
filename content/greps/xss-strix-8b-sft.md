---
title: "XSS Strix 8B SFT — Qwen3 XSS Detection Agent"
slug: "xss-strix-8b-sft"
date: 2026-01-21
type: grep
category: pentest
tags: [xss, strix, pentest, qwen3, sft, unsloth, agent, cybersecurity]
excerpt: "Uploaded to Hugging Face by kusonooyasumi — 8B Qwen3 fine-tune on 1.1k Strix XSS traces for multi-turn vulnerability hunting with tool-calling."
author: kusonooyasumi
hfModelId: kusonooyasumi/xss-strix-8b-sft
hfUrl: https://huggingface.co/kusonooyasumi/xss-strix-8b-sft
source: Kanti Labs
sourceUrl: https://kantilabs.xyz/
downloads: 2
likes: 0
pipelineTag: text-generation
baseModel: Qwen/Qwen3-8B
draft: false
---

## What Is This?

Community upload on Hugging Face by **kusonooyasumi**, published under the [Kanti Labs](https://kantilabs.xyz/) offensive web security research program. **xss-strix-8b-sft** is an 8B Qwen3 model fine-tuned for XSS vulnerability detection as a sub-agent within the **Strix** security agent framework. It is **not** an OFFSITE.DARK release.

## Metadata

| Field | Value |
|-------|-------|
| Author | kusonooyasumi |
| Research lab | [Kanti Labs](https://kantilabs.xyz/) |
| Base model | Qwen/Qwen3-8B |
| Method | QLoRA SFT (Unsloth) |
| Training data | kusonooyasumi/strix_xss_hackerone (~1.1k multi-turn traces) |
| Scale | 8B parameters (BF16 safetensors) |
| Pipeline | text-generation |
| License | Apache 2.0 |
| Created | 2026-01-21 |

## Tagged Capabilities

The model card and training corpus target Strix-native offensive web workflows:

- **XSS hunting** — systematic cross-site scripting vulnerability reasoning
- **Strix tool use** — browser_action, python_action, terminal, and XML tool-call syntax
- **Agent traces** — multi-turn security testing conversations with thinking blocks
- **HackerOne lineage** — synthetic Strix traces derived from real vulnerability patterns

## Why It Might Matter

This model sits at the intersection of three trends worth tracking:

1. **Task-specific agent fine-tunes** — XSS-only sub-agents inside multi-model pentest stacks
2. **Strix ecosystem growth** — open-weight models trained explicitly for Strix sub-agent deployment
3. **Trace-based SFT** — curated agent conversation logs replacing generic cyber instruction tuning

For defenders and researchers, the value is **capability benchmarking**: measuring what an 8B Strix-specialized model can reason about on XSS scenarios without API guardrails.

## Research Questions

- How does Strix SFT compare to general cyber LLMs on identical XSS eval sets?
- Does tool-call format fidelity survive quantization and local inference?
- What false-positive rate emerges when deployed as an autonomous Strix sub-agent?

## Supply Chain Note

Download from Hugging Face only. Verify checksums, prefer safetensors, and never load pickle-serialized weights in production pipelines. Third-party security models may carry elevated supply-chain risk — treat as untrusted code until audited.

## Sources

- [Kanti Labs](https://kantilabs.xyz/) (research lab / model program)
- [Hugging Face — kusonooyasumi/xss-strix-8b-sft](https://huggingface.co/kusonooyasumi/xss-strix-8b-sft)
- [Dataset — kusonooyasumi/strix_xss_hackerone](https://huggingface.co/datasets/kusonooyasumi/strix_xss_hackerone)

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **kusonooyasumi** under the Kanti Labs research program. OFFSITE.DARK does not endorse or distribute this artifact.
