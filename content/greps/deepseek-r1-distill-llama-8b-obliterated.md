---
title: "DeepSeek-R1-Distill-Llama-8B OBLITERATED — 0.0% Refusal in Telemetry"
slug: "deepseek-r1-distill-llama-8b-obliterated"
date: 2026-11-26
type: grep
category: abliterated
tags: [deepseek, deepseek-r1, distill, llama, obliteratus, abliteration, uncensored]
excerpt: "OBLITERATUS' R1 distill on a Llama 8B backbone; third-party telemetry lists this model family among those where refusal went to 0.0% after ablation."
author: OBLITERATUS
hfModelId: OBLITERATUS/DeepSeek-R1-Distill-Llama-8B-OBLITERATED
hfUrl: https://huggingface.co/OBLITERATUS/DeepSeek-R1-Distill-Llama-8B-OBLITERATED
source: Hugging Face
downloads: 163
likes: 5
baseModel: deepseek-ai/DeepSeek-R1-Distill-Llama-8B
draft: false
---

## What Is This?

An OBLITERATUS-processed build of **DeepSeek-R1-Distill-Llama-8B** (created 2026-05-17). The model is a Llama 3.1 8B backbone fine-tuned on R1 reasoning traces, so it inherits Llama refusal geometry.

## Metadata

| Field | Value |
|-------|-------|
| Author | OBLITERATUS |
| Base | `deepseek-ai/DeepSeek-R1-Distill-Llama-8B` |
| Parameters | about 8.03B |
| Downloads | 163 (API, 2026-11-26) |
| Likes | 5 |
| License | Not stated in the Hub metadata |

## Why It Matters

- Failure-First's analysis of 30,238 OBLITERATUS telemetry records lists `DeepSeek-R1-Distill-Llama-8B` among the models that went to **0.0% refusal**, while Qwen-family models were the most resistant (32.6% mean refusal remaining). The same tool gives very different results by backbone.
- A 0.0% refusal figure is a headline, not a quality guarantee. It says nothing about coherence, reasoning-trace drift or loop behaviour.
- Compare with the Qwen3-based distill: [DeepSeek-R1-0528-Qwen3-8B abliterated](/greps/deepseek-r1-0528-qwen3-8b-abliterated).

## Read More

- [DeepSeek Obliterated & Abliterated Models](/research/deepseek-obliterated-abliterated-models)
- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)
- [Failure-First telemetry report](https://failurefirst.org/research/reports/69-obliteratus-telemetry-analysis-30k/)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **OBLITERATUS**.
