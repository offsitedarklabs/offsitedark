---
title: "gpt-oss-20b Heretic (p-e-w) — The Chain-of-Thought Scoring Problem"
slug: "gpt-oss-20b-heretic"
date: 2026-11-26
type: grep
category: abliterated
tags: [gpt-oss, openai, heretic, abliteration, uncensored, reasoning, evaluation]
excerpt: "The reference Heretic release on OpenAI's open-weight 20B model, and the standard example of refusal metrics disagreeing about reasoning-channel hesitation."
author: p-e-w
hfModelId: p-e-w/gpt-oss-20b-heretic
hfUrl: https://huggingface.co/p-e-w/gpt-oss-20b-heretic
source: Hugging Face
downloads: 2584
likes: 162
pipelineTag: text-generation
draft: false
---

## What Is This?

A Heretic abliteration of **gpt-oss-20b** published by the tool's author, **p-e-w** (created 2025-11-16, Apache-2.0). It is the canonical Heretic demonstration on a reasoning model.

## Metadata

| Field | Value |
|-------|-------|
| Author | p-e-w |
| Parameters | about 20.9B |
| Tool | Heretic (Optuna TPE; refusals and KL co-minimised) |
| Downloads | 2,584 (API, 2026-11-26) |
| Likes | 162 |
| License | Apache-2.0 |

## Why It Matters

- An independent write-up by aithinkerlab re-scored it at roughly 58/100 refusals because the chain of thought still hesitated, even where the final output complied. A monitor that reads the reasoning channel and one that reads only the answer disagree on whether the model "refused".
- This is the mirror image of the covert-noncompliance problem on DeepSeek, where the answer looks compliant but has been redirected.
- It is a useful regression fixture: any evaluation that cannot say which channel it scored is not measuring what its headline claims.

## Read More

- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **p-e-w**.
