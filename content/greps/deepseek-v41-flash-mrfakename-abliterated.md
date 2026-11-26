---
title: "DeepSeek-V4.1-Flash-1017 Abliterated (mrfakename) — Rank-2 Native-FP8 Edit"
slug: "deepseek-v41-flash-mrfakename-abliterated"
date: 2026-11-26
type: grep
category: abliterated
tags: [deepseek, abliteration, rank-2, fp8, moe, uncensored, lora, think-mode]
excerpt: "A rank-2 abliteration that edits only attention-output and shared-expert writes, finds chat and think mode refusing along different directions, and ships the edit as a detachable GGUF LoRA."
author: mrfakename
hfModelId: mrfakename/DeepSeek-V4.1-Flash-1017-abliterated
hfUrl: https://huggingface.co/mrfakename/DeepSeek-V4.1-Flash-1017-abliterated
source: Hugging Face
downloads: 13117
likes: 51
pipelineTag: text-generation
baseModel: deepseek-ai/DeepSeek-V4.1-Flash-1017
draft: false
---

## What Is This?

An abliteration of **DeepSeek-V4.1-Flash-1017** by **mrfakename** (created 2026-10-17, last modified 2026-11-18, MIT). It stays in native mixed FP8/FP4 at about 510 GB across 48 shards, so it is practical to serve where a BF16 rebuild is not.

## Metadata

| Field | Value |
|-------|-------|
| Author | mrfakename |
| Base | `deepseek-ai/DeepSeek-V4.1-Flash-1017` |
| Parameters | about 763B (API-reported) |
| Edited tensors | `attn.wo_b` and `ffn.shared_experts.w2`, 40 main layers, per-layer strength |
| Untouched | routed experts, embeddings, Engram tables, DSpark/MTP layers 40 to 42 |
| Edit form | `W' = W - s * Q Q^T W`, rank 2, FP8 with original block scales and stochastic rounding |
| Extras | `abliteration-edit.npz`, `abliteration-lora.gguf` (rank-2 LoRA for the original GGUFs) |
| Downloads | 13,117 (API, 2026-11-26) |
| Likes | 51 |
| License | MIT |

## Reported Results

Held-out 100 harmful prompts, Q8_0 GGUF, greedy, 384 tokens:

| | Chat refusals | Think-mode refusals | First-token KL (harmless) |
|---|---:|---:|---:|
| Stock | 97 | 98 | 0 |
| Abliterated | 4 | 9 | 0.067 |

## Why It Matters

- Refusal in chat and think modes lies along **different directions**, so the subspace is at least rank 2. Single-direction edits miss one of them.
- Residue is semantic, not textual: in think mode, a dangerous request is sometimes quietly reframed as a harmless one (a bath-bomb answer to a bomb question). A refusal-string detector counts that as compliance.
- The edit ships as a LoRA. Anyone with the stock GGUFs can apply it, which makes provenance of the "uncensoring" separate from provenance of the base weights.

## Read More

- [DeepSeek Obliterated & Abliterated Models](/research/deepseek-obliterated-abliterated-models)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)
- Sibling: [OBLITERATUS V4.1 Flash release](/greps/deepseek-v41-flash-obliteratus)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **mrfakename**.
