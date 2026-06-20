---
title: "molly-security-audit — Llama 3.1 Security Audit LoRA"
slug: "molly-security-audit-lora"
date: 2026-06-17
type: grep
category: recent-upload
tags: [security-audit, lora, llama-3.1, peft, safetensors]
excerpt: "Uploaded to Hugging Face by BoomJules — recent LoRA adapter on Llama 3.1 8B Instruct tagged for security auditing workflows."
author: BoomJules
hfModelId: BoomJules/molly-security-audit
hfUrl: https://huggingface.co/BoomJules/molly-security-audit
source: Hugging Face
downloads: 0
likes: 0
pipelineTag: text-generation
baseModel: meta-llama/Llama-3.1-8B-Instruct
draft: false
---

## What Is This?

Uploaded to Hugging Face by **BoomJules** on **2026-06-17**. **molly-security-audit** is a PEFT LoRA adapter targeting **meta-llama/Llama-3.1-8B-Instruct**, tagged for security audit use cases under the "molly-os" namespace.

## Metadata

| Field | Value |
|-------|-------|
| Author | BoomJules |
| Adapter type | LoRA (PEFT) |
| Weight format | safetensors |
| Base model | meta-llama/Llama-3.1-8B-Instruct |
| License | CC-BY-NC-4.0 |

## Why It Might Matter

Recent uploads with zero downloads are still worth indexing — they signal **emerging fine-tune directions** before community adoption:

- **Audit-focused adapters** — smaller than full cyber-LLMs, easier to merge and evaluate locally
- **NC license** — non-commercial restriction affects red-team vendor integration
- **LoRA on 8B** — accessible on consumer GPUs for rapid experimentation

## Research Angle

Merge this adapter with Llama 3.1 8B and benchmark on:

- Static code review prompts (OWASP, CWE references)
- Configuration audit checklists
- Policy compliance Q&A

Compare against unfine-tuned base to measure domain lift.

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **BoomJules**.
