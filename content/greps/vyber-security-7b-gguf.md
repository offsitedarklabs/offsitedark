---
title: "vyber-security-7b — Qwen2.5 Cybersecurity LoRA"
slug: "vyber-security-7b-gguf"
date: 2026-06-14
type: grep
category: cyber-llm
tags: [cybersecurity, qwen2.5, lora, gguf, instruct]
excerpt: "Uploaded to Hugging Face by vxkyyy — Qwen2.5 7B Instruct LoRA packaged as GGUF for local cybersecurity chat workloads."
author: vxkyyy
hfModelId: vxkyyy/vyber-security-7b-gguf
hfUrl: https://huggingface.co/vxkyyy/vyber-security-7b-gguf
source: Hugging Face
downloads: 232
likes: 1
pipelineTag: text-generation
baseModel: Qwen/Qwen2.5-7B-Instruct
draft: false
---

## What Is This?

Uploaded to Hugging Face by **vxkyyy**. **vyber-security-7b** is a LoRA adapter on **Qwen/Qwen2.5-7B-Instruct**, distributed as GGUF for llama.cpp-compatible inference. A smaller **1.5B variant** also exists in the same namespace.

## Metadata

| Field | Value |
|-------|-------|
| Author | vxkyyy |
| Parameter scale | 7B (1.5B sibling available) |
| Format | GGUF |
| Downloads | ~232 |
| License | Apache 2.0 |

## Why It Might Matter

Lightweight cyber-LLMs fill a practical gap — runnable on laptops and edge devices for:

- Offline security Q&A during engagements
- Air-gapped lab environments without API dependencies
- Rapid adapter experimentation (merge LoRA, swap bases)

The 7B scale is the sweet spot for comparing **domain fine-tune lift** without MoE infrastructure overhead.

## Evaluation Suggestions

- MITRE technique explanation accuracy
- False positive rate on benign vs. malicious code snippets
- Refusal behavior on clearly unauthorized attack instructions

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **vxkyyy**.
