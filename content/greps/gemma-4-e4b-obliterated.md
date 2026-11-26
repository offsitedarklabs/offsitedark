---
title: "Gemma-4-E4B-it OBLITERATED v3 — Phone-Sized Model, Agent-Built, Honest Post-Mortem"
slug: "gemma-4-e4b-obliterated"
date: 2026-11-26
type: grep
category: abliterated
tags: [gemma, gemma-4, obliteratus, abliteration, uncensored, gguf, on-device, shared-kv]
excerpt: "A 4B-effective Gemma 4 with hard refusals at 0% but only about 51% coherent answers, built by an AI agent in under ten prompts, and with a v2 that shipped missing 54 K/V tensors."
author: OBLITERATUS
hfModelId: OBLITERATUS/gemma-4-E4B-it-OBLITERATED
hfUrl: https://huggingface.co/OBLITERATUS/gemma-4-E4B-it-OBLITERATED
source: Hugging Face
downloads: 41853
likes: 842
pipelineTag: text-generation
baseModel: google/gemma-4-E4B-it
draft: false
---

## What Is This?

An abliterated **Gemma 4 E4B-it** (created 2026-04-15, last modified 2026-04-19, Apache-2.0) from **OBLITERATUS**. The Q4_K_M GGUF is 4.9 GB, which is why it is pitched at phones and laptops.

## Metadata

| Field | Value |
|-------|-------|
| Author | OBLITERATUS |
| Base | `google/gemma-4-E4B-it` |
| Method | OBLITERATUS `aggressive`: whitened SVD, attention-head surgery, winsorised activations; 21 of 42 layers modified |
| Corpus | 842 contrastive prompt pairs, 10 categories |
| Downloads | 41,853 (API, 2026-11-26) |
| Likes | 842 |
| License | Apache-2.0 |

## What the Card Reports

| Metric | Value |
|---|---:|
| Hard refusal, original | 98.8% |
| Hard refusal, obliterated | 0% |
| Soft deflection | about 28% |
| Coherent and on-topic | about 51% |
| Degenerate repetition loops | about 20% |
| Wrong-language output | about 4% |

## The v2 Bug

Gemma 4 shares K/V projection weights across layers 24 to 41. v2 applied the projection to the shared tensor once per borrowing layer (18 times), corrupting it; `save_pretrained` then dropped 54 tensors (666 in the GGUF instead of 720). The card says this caused hallucinations. v3 projects once, on the owning layer.

## Why It Matters

- "0% refusal" and "51% useful" describe the same model.
- A structurally broken build was public and downloadable for a period.
- The model was produced by an agent (Hermes) with fewer than ten human prompts, which shows how low the effort and skill bar for publishing these is.
- The card itself says it is not suitable for deployment in user-facing products without additional safety measures.

## Read More

- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **OBLITERATUS**.
