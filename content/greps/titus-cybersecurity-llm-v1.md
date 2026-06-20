---
title: "Titus CybersecurityLLM v1.0 — Qwen3.6 SOC/DFIR Model"
slug: "titus-cybersecurity-llm-v1"
date: 2026-05-31
type: grep
category: cyber-llm
tags: [cybersecurity, soc, dfir, qwen3.6, turkish, gguf]
excerpt: "Uploaded to Hugging Face by AlicanKiraz0 — Qwen3.6-based cybersecurity LLM with SOC and digital forensics tags, available in GGUF and MLX quantizations."
author: AlicanKiraz0
hfModelId: AlicanKiraz0/Titus-CybersecurityLLM-v1.0-Q4_K_M-No-MTP-GGUF
hfUrl: https://huggingface.co/AlicanKiraz0/Titus-CybersecurityLLM-v1.0-Q4_K_M-No-MTP-GGUF
source: Hugging Face
downloads: 1565
likes: 9
pipelineTag: text-generation
baseModel: AlicanKiraz0/Titus-CybersecurityLLM-v1.0
draft: false
---

## What Is This?

Uploaded to Hugging Face by **AlicanKiraz0**. **Titus CybersecurityLLM v1.0** is a fine-tuned Qwen3.6 model family aimed at cybersecurity operations — tagged for SOC workflows, DFIR analysis, and Turkish-language security content alongside English.

## Metadata

| Field | Value |
|-------|-------|
| Author | AlicanKiraz0 |
| Base | Qwen3.6 MoE architecture |
| Quantizations | GGUF Q4_K_M, MLX 4-bit |
| Downloads (GGUF) | ~1.5k |
| License | Apache 2.0 |

## Distribution Variants

Multiple community quantizations exist under the Titus namespace:

- **GGUF** — llama.cpp compatible, No-MTP variant
- **MLX 4-bit** — Apple Silicon optimized

This pattern (base fine-tune + community quant pipeline) is typical for security-domain models that never ship a single canonical deployment artifact.

## Why It Might Matter

Titus represents the **defensive-operations LLM** niche — models tuned for alert triage, log analysis, and incident narrative rather than exploit generation. For blue-team research:

- Benchmark against general models on Sigma rule explanation, EVTX summarization, and IOC enrichment tasks
- Evaluate multilingual SOC support (Turkish + English tags suggest cross-language incident docs)
- Compare Titus output quality to Trendyol Cybersecurity LLM and Lily Cybersecurity baselines

## Dataset Lineage

Related uploads in the AlicanKiraz0 ecosystem reference cybersecurity instruction datasets (Fenrir, Heimdall). Provenance of training data matters for bias and hallucination risk in incident response contexts.

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **AlicanKiraz0**.
