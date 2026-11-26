---
title: "DeepSeek-R1-0528-Qwen3-8B Abliterated (huihui-ai) — Distilled Reasoning, Refusals Removed"
slug: "deepseek-r1-0528-qwen3-8b-abliterated"
date: 2026-11-26
type: grep
category: abliterated
tags: [deepseek, deepseek-r1, qwen3, distill, huihui-ai, abliteration, reasoning, uncensored]
excerpt: "An 8B Qwen3 backbone carrying DeepSeek-R1-0528 reasoning traces, abliterated by huihui-ai; the backbone, not the DeepSeek label, decides how it behaves."
author: huihui-ai
hfModelId: huihui-ai/DeepSeek-R1-0528-Qwen3-8B-abliterated
hfUrl: https://huggingface.co/huihui-ai/DeepSeek-R1-0528-Qwen3-8B-abliterated
source: Hugging Face
downloads: 119
likes: 45
pipelineTag: text-generation
baseModel: deepseek-ai/DeepSeek-R1-0528-Qwen3-8B
draft: false
---

## What Is This?

An abliterated version of **DeepSeek-R1-0528-Qwen3-8B**, the distillation of R1-0528 reasoning behaviour into a Qwen3 8B backbone, by **huihui-ai** (created 2025-05-30, last modified 2025-06-18, MIT, access gated to "auto").

## Metadata

| Field | Value |
|-------|-------|
| Author | huihui-ai |
| Base | `deepseek-ai/DeepSeek-R1-0528-Qwen3-8B` |
| Parameters | about 8.19B (BF16) |
| Downloads | 119 (API, 2026-11-26) |
| Likes | 45 |
| License | MIT |

## Why It Matters

- It is a distill, so the refusal geometry is mostly Qwen3's. Failure-First telemetry found Qwen-family models the most resistant to ablation (32.6% mean refusal remaining across OBLITERATUS runs), so a clean result on a Llama distill does not transfer.
- Distilled reasoning models open with policy deliberation inside the `<think>` block. Removing a residual direction does not always remove that learned habit; the sibling huihui cards advise priming with an example question when the model refuses or skips thinking.
- Small, reasoning-capable, cheap to run: a natural fit for local agents, which is the combination the [containment article](/research/uncontrolled-abliterated-llms-failure-modes) says not to deploy without a sandbox.

## Read More

- [DeepSeek Obliterated & Abliterated Models](/research/deepseek-obliterated-abliterated-models)
- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **huihui-ai**.
