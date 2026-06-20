---
title: "security-coding-gemma4-e2b — Gemma 4 Security Coding Model"
slug: "security-coding-gemma4-e2b"
date: 2026-06-15
type: grep
category: code-security
tags: [code-security, gemma4, e2b, safetensors, unsloth]
excerpt: "Uploaded to Hugging Face by k1ngtai — Gemma 4 fine-tune family for security-oriented coding, with full weights, LoRA, and GGUF variants."
author: k1ngtai
hfModelId: k1ngtai/security-coding-gemma4-e2b-full
hfUrl: https://huggingface.co/k1ngtai/security-coding-gemma4-e2b-full
source: Hugging Face
downloads: 51
likes: 0
pipelineTag: image-text-to-text
baseModel: google/gemma-3-4b-it
draft: false
---

## What Is This?

Uploaded to Hugging Face by **k1ngtai**. The **security-coding-gemma4-e2b** family is a Gemma 4 fine-tune positioned for secure coding assistance, with three related artifacts:

- `security-coding-gemma4-e2b-full` — full safetensors weights
- `security-coding-gemma4-e2b-lora` — LoRA adapter
- `security-coding-gemma4-e2b-gguf` — quantized inference build

## Metadata

| Field | Value |
|-------|-------|
| Author | k1ngtai |
| Architecture | Gemma 4 (image-text-to-text pipeline tag) |
| Training stack | Unsloth, TRL |
| License | Apache 2.0 |
| Last modified | 2026-06-15 |

## Why It Might Matter

Code-security fine-tunes on **new architecture generations** (Gemma 4) are early indicators of where the community invests training compute:

- **Secure coding vs. vulnerability finding** — unclear from tags alone; warrants benchmark on CVEfixes-style datasets
- **E2B naming** — may reference sandboxed code execution environments; check model card for training methodology
- **Multimodal pipeline tag** — if vision inputs were used, attack surface for prompt injection via screenshots/docs expands

## Comparison Targets

Benchmark against:

- Younis2003/CodeLlama_for_code_security (CodeLlama 13B LoRA)
- Qwen2.5-Coder family (general code, not security-specific)
- Microsoft/CodeBERT security classifiers

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **k1ngtai**.
