---
title: "DeepSeek-V3 Abliterated (huihui-ai) — 671B MoE, Proof-of-Concept Surgery"
slug: "deepseek-v3-abliterated-huihui"
date: 2026-11-26
type: grep
category: abliterated
tags: [deepseek, deepseek-v3, huihui-ai, abliteration, moe, uncensored, ollama]
excerpt: "huihui-ai's abliteration of the 671B DeepSeek-V3 MoE, built with a self-described crude proof-of-concept script and distributed with Ollama quantisations."
author: huihui-ai
hfModelId: huihui-ai/DeepSeek-V3-abliterated
hfUrl: https://huggingface.co/huihui-ai/DeepSeek-V3-abliterated
source: Hugging Face
pipelineTag: text-generation
baseModel: deepseek-ai/DeepSeek-V3
draft: false
---

## What Is This?

An abliterated build of **DeepSeek-V3** by **huihui-ai**, the uploader behind the largest catalogue of abliterated Llama, Qwen, Gemma and DeepSeek models. The card describes the method as a crude proof of concept built on plain Transformers (`remove-refusals-with-transformers`).

## Metadata

| Field | Value |
|-------|-------|
| Author | huihui-ai |
| Base | `deepseek-ai/DeepSeek-V3` (671B MoE) |
| Distribution | Safetensors plus Ollama quantisations (Q4_K_M, Q3_K_M, Q2_K) |
| Loading note | The card's sample code uses `trust_remote_code=True` |
| Downloads and likes | Not recorded here (the Hub API required authentication when this entry was written) |

## Why It Matters

- It is the earliest widely used abliteration of a frontier-size MoE. The same uploader later covered V4-Flash and the R1 distills.
- Community threads on this family report residual refusals on some political and state-related topics. That is consistent with refusal behaviour that is not a single direction.
- `trust_remote_code=True` in sample code means loading executes repository Python. Pin the commit, read the code, load in a sandbox.
- Low-bit Ollama builds are different artefacts from the BF16 weights, so any evaluation of one does not transfer to the other.

## Read More

- [DeepSeek Obliterated & Abliterated Models](/research/deepseek-obliterated-abliterated-models)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)
- Upstream: [DeepSeek-V3](/greps/deepseek-v3-oss-powerhouse)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **huihui-ai**.
