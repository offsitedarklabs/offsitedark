---
title: "Qwen3.8-27B OBLITERATED — 630K Downloads, Three Surgery Generations"
slug: "qwen38-27b-obliterated"
date: 2026-11-26
type: grep
category: abliterated
tags: [qwen, qwen3.8, obliteratus, abliteration, svd, leace, uncensored, gguf]
excerpt: "The most-downloaded model in the obliterated family: V1 to V3 surgery on Qwen3.8-27B with MMLU costs of -6.0, -0.28 and -2.12 points and a card that admits loops, template dependence and system-prompt sensitivity."
author: OBLITERATUS
hfModelId: OBLITERATUS/Qwen3.8-27B-OBLITERATED
hfUrl: https://huggingface.co/OBLITERATUS/Qwen3.8-27B-OBLITERATED
source: Hugging Face
downloads: 632256
likes: 1749
pipelineTag: text-generation
baseModel: Qwen/Qwen3.8-27B
draft: false
---

## What Is This?

An abliterated **Qwen3.8-27B** from the **OBLITERATUS** organisation (created 2026-08-19, last modified 2026-08-24, Apache-2.0). Safetensors (about 54 GB, 29 shards) plus GGUF quantisations from Q8_0 to Q2_K. The card is credited to "Pliny the Prompter".

## Metadata

| Field | Value |
|-------|-------|
| Author | OBLITERATUS |
| Base | `Qwen/Qwen3.8-27B` |
| Downloads | 632,256 (API, 2026-11-26) |
| Likes | 1,749 |
| License | Apache-2.0 |
| GGUF | Q8_0 about 27 GB down to Q2_K about 11 GB, IQ4_XS about 14 GB |

## Generations (from the card)

| Version | Method | MMLU (0-shot, 5,700 q) | Notes |
|---|---|---:|---|
| Stock | n/a | 84.46% | refuses |
| V1 | 5 rounds iterative SVD, 5 directions | 81.4% | hard refusals removed, -6.0 pp |
| V2 | SVD plus LEACE, 60/40 blend | 84.32% | soft deflections remain, thinking mode refused |
| V3 | iterative refinement plus targeted surgery plus blend | 82.33% | no hard refusal, no deflection, -2.12 pp |

STEM lost the most (-3.3 pp); philosophy and European history rose 4 to 6 points.

## Operational Warnings in the Card

- Recommends repetition penalty 1.15 because greedy decoding "loops on imports/boilerplate".
- For agent use, advises summarising history after about 10 turns because context "fills up with repeated actions".
- Advises an empty system prompt, since "system prompts can reintroduce refusals".
- The GGUF template prefills an empty thinking block, so behaviour depends on using the bundled template.
- On the card's 8-task advanced suite, stock and V3 both score 7/8 and fail the same multi-tool-chain task.

## Why It Matters

- Download volume is highest here, and most of it is third-party GGUFs and merges that do not repeat the caveats.
- The card is open about what "obliterated" cost and how fragile the settings are.
- The recipe stacks surgeries (SVD, LEACE, iterative refinement), so each version is a different point on the capability-versus-compliance curve.

## Read More

- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **OBLITERATUS**.
