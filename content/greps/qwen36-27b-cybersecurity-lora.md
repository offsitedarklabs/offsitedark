---
title: "Qwen3.6-27B Cybersecurity LoRA (Fenrir SFT)"
slug: "qwen36-27b-cybersecurity-lora"
date: 2026-07-05
type: grep
category: cyber-llm
tags: [cybersecurity, lora, qwen3.6, sft, fenrir, peft]
excerpt: "Uploaded to Hugging Face by hotdogs — PEFT LoRA on Qwen3.6-27B trained with AlicanKiraz0 Fenrir cybersecurity dataset; GGUF tags present."
author: hotdogs
hfModelId: hotdogs/qwen3.6-27b-cybersecurity-lora
hfUrl: https://huggingface.co/hotdogs/qwen3.6-27b-cybersecurity-lora
source: Hugging Face
sourceUrl: https://huggingface.co/hotdogs/qwen3.6-27b-cybersecurity-lora
downloads: 517
likes: 9
pipelineTag: text-generation
baseModel: Qwen/Qwen3.6-27B
draft: false
---

## What Is This?

Community upload on Hugging Face by **hotdogs**. **qwen3.6-27b-cybersecurity-lora** is a **PEFT LoRA** adapter on **Qwen/Qwen3.6-27B**, supervised-fine-tuned with the **AlicanKiraz0/Cybersecurity-Dataset-Fenrir-v2.1** corpus (same Fenrir lineage as other cyber LLMs already on Greps). Tags include `gguf` for local inference packaging. It is **not** an OFFSITE.DARK release.

Created mid-June 2026; last modified **2026-07-05** in this indexing window.

## Metadata

| Field | Value |
|-------|-------|
| Author | hotdogs |
| Base model | Qwen/Qwen3.6-27B |
| Method | LoRA / SFT (PEFT) |
| Dataset | AlicanKiraz0/Cybersecurity-Dataset-Fenrir-v2.1 |
| Pipeline | text-generation |
| License | Apache-2.0 |
| Downloads | ~517 |
| Likes | 9 |

## Why Index It

- Continues the Fenrir/Qwen cybersecurity fine-tune cluster already represented by Titus / BaronLLM-adjacent greps.
- 27B class is large enough for serious local cyber-assistant experiments.
- Useful contrast to smaller Strix XSS / RavenX agent greps.

## Caveats

LoRA adapters inherit base-model jailbreak and hallucination risks. Use only in authorized research sandboxes; do not treat outputs as authoritative vuln intel.

## Sources

- [Hugging Face — hotdogs/qwen3.6-27b-cybersecurity-lora](https://huggingface.co/hotdogs/qwen3.6-27b-cybersecurity-lora)
- [Dataset — AlicanKiraz0/Cybersecurity-Dataset-Fenrir-v2.1](https://huggingface.co/datasets/AlicanKiraz0/Cybersecurity-Dataset-Fenrir-v2.1)
