---
title: "DeepSeek-V4.1-Flash-1017 OBLITERATED — 754B MoE Refusal Removal"
slug: "deepseek-v41-flash-obliteratus"
date: 2026-11-26
type: grep
category: abliterated
tags: [deepseek, obliteratus, abliteration, moe, uncensored, refusal-removal, bf16]
excerpt: "OBLITERATUS' frontier-scale DeepSeek ablation: full refusals 81.62% to 4.30% on 838 prompts, partial refusals up to 14.44%, harmful assistance 78.28%, MMLU flat."
author: OBLITERATUS
hfModelId: OBLITERATUS/DeepSeek-V4.1-Flash-1017-obliterated
hfUrl: https://huggingface.co/OBLITERATUS/DeepSeek-V4.1-Flash-1017-obliterated
source: Hugging Face
downloads: 30281
likes: 315
pipelineTag: text-generation
baseModel: deepseek-ai/DeepSeek-V4.1-Flash-1017
draft: false
---

## What Is This?

A BF16 abliteration of **DeepSeek-V4.1-Flash-1017** published by the **OBLITERATUS** organisation (created 2026-10-23, last modified 2026-10-30, MIT). It is the best-documented large DeepSeek refusal-removal release, and the one most often misquoted.

## Metadata

| Field | Value |
|-------|-------|
| Author | OBLITERATUS |
| Base | `deepseek-ai/DeepSeek-V4.1-Flash-1017` |
| Parameters | about 754.6B (BF16 plus a small F32 part) |
| Size on disk | about 1,509 GB (83 shards), against about 510 GB upstream in FP8/FP4 |
| Method | OBLITERATUS v0.1.4, `failspy` preset; `diff_means`, 1 direction, all layers except layer 0, KL budget 0.5 |
| Calibration | 256 harmful plus 256 harmless prompts |
| Downloads | 30,281 (API, 2026-11-26) |
| Likes | 315 |
| License | MIT |

## Reported Results

| Measure | Stock | Obliterated |
|---|---:|---:|
| Full refusal (838 prompts) | 81.62% | 4.30% |
| Partial refusal | 4.89% | 14.44% |
| Harmful assistance | 10.38% | 78.28% |
| Actionability 4 (concrete enough to enable the conduct) | 3.46% | 20.76% |
| MMLU (2,500 q, zero-shot) | 87.96% | 88.08% |

The 50-prompt tournament that picked the method gave 4% refusal (2 of 50), KL 0.1305 and 100% coherence. It is a different test from the 838-prompt corpus, and the two should not be merged.

## Why It Matters

- It shows what refusal removal looks like at the top end of open weights: serious-plus-severe harm ratings went from about 3.9% to 54.1% of responses.
- The card has inconsistencies (656 vs 563 harmful-assistance responses; 254 prompts overlapping calibration; 25 unscored responses). Independent audit by MicroAIOne flagged them.
- Flat MMLU says nothing about multi-turn, tools or loops.
- Do not size capacity from the 510 GB upstream figure.

## Read More

- [DeepSeek Obliterated & Abliterated Models](/research/deepseek-obliterated-abliterated-models)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)
- Sibling: [mrfakename's rank-2 abliteration](/greps/deepseek-v41-flash-mrfakename-abliterated)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **OBLITERATUS**.
