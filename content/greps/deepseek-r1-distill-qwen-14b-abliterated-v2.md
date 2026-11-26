---
title: "DeepSeek-R1-Distill-Qwen-14B Abliterated v2 (huihui-ai)"
slug: "deepseek-r1-distill-qwen-14b-abliterated-v2"
date: 2026-11-26
type: grep
category: abliterated
tags: [deepseek, deepseek-r1, distill, qwen, huihui-ai, abliteration, reasoning, uncensored]
excerpt: "The 14B R1 distill with refusals removed by huihui-ai; one of the most-downloaded R1 abliterations and a reference point for how reasoning distills behave after surgery."
author: huihui-ai
hfModelId: huihui-ai/DeepSeek-R1-Distill-Qwen-14B-abliterated-v2
hfUrl: https://huggingface.co/huihui-ai/DeepSeek-R1-Distill-Qwen-14B-abliterated-v2
source: Hugging Face
downloads: 1230
likes: 179
pipelineTag: text-generation
baseModel: deepseek-ai/DeepSeek-R1-Distill-Qwen-14B
draft: false
---

## What Is This?

A second-generation abliteration of **DeepSeek-R1-Distill-Qwen-14B** by **huihui-ai** (created 2025-01-23, last modified 2025-07-22). The card describes v2 as a fix for issues in the first release.

## Metadata

| Field | Value |
|-------|-------|
| Author | huihui-ai |
| Base | `deepseek-ai/DeepSeek-R1-Distill-Qwen-14B` |
| Parameters | about 14.8B (BF16) |
| Downloads | 1,230 (API, 2026-11-26) |
| Likes | 179 |
| License | Not stated in the Hub metadata |

## Sibling Models From the Same Uploader

| Repository | Downloads | Likes |
|---|---:|---:|
| `huihui-ai/DeepSeek-R1-Distill-Qwen-32B-abliterated` | 1,171 | 259 |
| `huihui-ai/DeepSeek-R1-Distill-Llama-8B-abliterated` | 928 | 80 |

## Why It Matters

- R1 distills are fine-tunes of Qwen and Llama backbones. The refusal direction comes with the backbone, and the backbone changes how complete the removal is.
- In Young's cross-tool comparison, a DeepSeek 7B chat model under Heretic cut GSM8K from 44.58% to 40.11% while single-pass tools stayed near base. Reasoning distills are the most likely to show this kind of silent maths regression.
- The version label itself is a warning: v1 was publicly downloadable with a defect that v2 had to fix.

## Read More

- [DeepSeek Obliterated & Abliterated Models](/research/deepseek-obliterated-abliterated-models)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **huihui-ai**.
