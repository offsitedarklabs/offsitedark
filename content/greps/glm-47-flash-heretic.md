---
title: "GLM-4.7-Flash Heretic (ThalisAI) — 6/100 Refusals at KL 0.0071"
slug: "glm-47-flash-heretic"
date: 2026-11-26
type: grep
category: abliterated
tags: [glm, glm-4.7-flash, heretic, abliteration, uncensored, gguf, zhipu]
excerpt: "A Heretic-optimised GLM-4.7-Flash from the Apostate pipeline: 6/100 refusals, KL 0.0071, GGUF quants. The headline numbers are self-reported on a small held-out set."
author: ThalisAI
hfModelId: ThalisAI/GLM-4.7-Flash-heretic
hfUrl: https://huggingface.co/ThalisAI/GLM-4.7-Flash-heretic
source: Hugging Face
downloads: 6893
likes: 1
baseModel: zai-org/GLM-4.7-Flash
draft: false
---

## What Is This?

An abliterated **GLM-4.7-Flash** by **ThalisAI** (created 2026-02-17), produced by an automated pipeline called Apostate that runs Heretic, merges the result, and generates GGUF quantisations (Q8_0 31.8 GB, Q6_K 22.9 GB, Q4_K_M 16.9 GB) plus bf16 weights.

## Metadata

| Field | Value |
|-------|-------|
| Author | ThalisAI |
| Base | `zai-org/GLM-4.7-Flash` |
| Tool | Heretic, one round |
| Reported refusals | 6/100 |
| Reported KL divergence | 0.0071 |
| Downloads | 6,893 (API, 2026-11-26) |
| Likes | 1 |
| License | other |

## Related Heretic Derivatives

A search of the Hub finds a large GLM-4.7-Flash Heretic family: `DavidAU/GLM-4.7-Flash-Uncensored-Heretic-NEO-CODE-Imatrix-MAX-GGUF` (42,566 downloads), third-party GGUF repacks, and small-model distillations carrying the "GLM-4.7-Flash-Heretic" name. The label travels further than the verification does.

## Why It Matters

- A KL of 0.0071 on harmless prompts is excellent on its face, but KL on short harmless prompts says nothing about long outputs, tool calls or chain-of-thought stability.
- 6/100 is a held-out count from the optimiser's own test set. It is not an independent evaluation.
- The pipeline is fully automated, so a new uncensored build of any popular release can appear without human review.

## Read More

- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **ThalisAI**.
