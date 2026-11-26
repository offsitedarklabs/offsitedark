---
title: "Llama-3.1-8B Lexi Uncensored V2 — The 2024 Fine-Tune Baseline"
slug: "lexi-uncensored-v2-llama31-8b"
date: 2026-11-26
type: grep
category: abliterated
tags: [llama, llama-3.1, lexi, uncensored, fine-tune, orenguteng]
excerpt: "A widely used 2024 uncensored fine-tune of Llama 3.1 8B Instruct, useful as a baseline for comparing training-based uncensoring with abliteration."
author: Orenguteng
hfModelId: Orenguteng/Llama-3.1-8B-Lexi-Uncensored-V2
hfUrl: https://huggingface.co/Orenguteng/Llama-3.1-8B-Lexi-Uncensored-V2
source: Hugging Face
downloads: 9743
likes: 344
pipelineTag: text-generation
draft: false
---

## What Is This?

An uncensored fine-tune of Llama 3.1 8B by **Orenguteng**, created 2024-08-09 and last modified 2024-09-25, under the Llama 3.1 licence.

## Metadata

| Field | Value |
|-------|-------|
| Author | Orenguteng |
| Parameters | about 8.03B |
| Method | Fine-tuning (not weight-surgery abliteration) |
| Downloads | 9,743 (API, 2026-11-26) |
| Likes | 344 |
| License | Llama 3.1 |

## Why It Matters

- Together with [mlabonne's abliterated Llama 3.1](/greps/llama-31-8b-instruct-abliterated-mlabonne) and `NeuralDaredevil-8B-abliterated`, it gives three "uncensored" approaches on the same backbone, which is why it remains the best teaching set.
- The card-level evidence for fine-tune-based uncensoring is thinner than for abliteration: there is usually no KL figure, since KL against the original is not the optimisation target.
- Third-party quantisations and merges commonly reuse the name, so the original card is rarely the artefact people actually run.

## Read More

- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **Orenguteng**.
