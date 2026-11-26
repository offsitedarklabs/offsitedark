---
title: "Dolphin Mistral 24B Venice Edition — Dataset-Uncensored, Not Abliterated"
slug: "dolphin-mistral-24b-venice-edition"
date: 2026-11-26
type: grep
category: abliterated
tags: [dolphin, mistral, venice, uncensored, fine-tune, sft, cognitive-computations]
excerpt: "The reference example of uncensoring by fine-tuning rather than weight surgery: Mistral-Small-24B retrained so that compliance is the default."
author: dphn
hfModelId: dphn/Dolphin-Mistral-24B-Venice-Edition
hfUrl: https://huggingface.co/dphn/Dolphin-Mistral-24B-Venice-Edition
source: Hugging Face
downloads: 6035
likes: 801
pipelineTag: text-generation
baseModel: mistralai/Mistral-Small-24B-Instruct-2501
draft: false
---

## What Is This?

A **Dolphin** fine-tune of **Mistral-Small-24B-Instruct-2501** from `dphn` (the Cognitive Computations lineage), created 2025-06-12 and last modified 2026-06-12 under Apache-2.0. Unlike abliteration, this changes behaviour through training data, so every weight shifts slightly.

## Metadata

| Field | Value |
|-------|-------|
| Author | dphn |
| Base | `mistralai/Mistral-Small-24B-Instruct-2501` |
| Parameters | about 24.0B |
| Downloads | 6,035 (API, 2026-11-26) |
| Likes | 801 |
| License | Apache-2.0 |

Also in the lineage: `dphn/Dolphin3.0-Llama3.1-8B` (3,651 downloads, 420 likes, Llama 3.1 licence).

## Why It Matters

- The like-to-download ratio (801 to 6,035) shows community interest far beyond raw usage, which is common for the best-known "uncensored" brands.
- Fine-tune-based uncensoring has side effects that are not confined to refusal. The emergent-misalignment research (Betley et al., 2025) shows narrow training can broadly shift behaviour; the training mix for these tunes matters.
- It is the baseline against which abliterated builds are compared: same goal, different mechanism, different failure modes.

## Read More

- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **dphn**.
