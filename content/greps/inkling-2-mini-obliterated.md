---
title: "Inkling-2-Mini OBLITERATED — Loop-Aware Surgery on 26.4B Looped MoE"
slug: "inkling-2-mini-obliterated"
date: 2026-11-27
type: grep
category: abliterated
tags: [obliteratus, abliterated, uncensored, moe, looped-transformer, inkling-2, gguf]
excerpt: "OBLITERATUS' first loop-aware rank-2 ablation on a 26.4B looped MoE (thinkingmachines/Inkling-2-Mini): skips coda layers 22-23, scales looped core 2.5x vs 4.0x outside, moving 740-prompt answer rate from 0% to 86.8% pure (96.9% with retraction cutoff)."
author: OBLITERATUS
hfModelId: OBLITERATUS/Inkling-2-Mini-OBLITERATED
hfUrl: https://huggingface.co/OBLITERATUS/Inkling-2-Mini-OBLITERATED
source: Hugging Face
downloads: 0
likes: 29
baseModel: thinkingmachines/Inkling-2-Mini
draft: false
---

## What Is This?

Published on Hugging Face by **OBLITERATUS** (created **2026-11-26**, updated **2026-11-27**, Apache-2.0) alongside companion repo `Inkling-2-Mini-OBLITERATED-prefill` (`2,191` downloads) and third-party GGUF derivations (`onemunanoyo/Inkling-2-Mini-Abliterated-Aggressive-GGUF`, `9,561` downloads). It applies **loop-aware rank-2 late-subspace abliteration** to `thinkingmachines/Inkling-2-Mini`, a **26.4B looped Mixture-of-Experts** model with a 1M context window (`1,048,576`) whose core block repeats multiple passes per token.

## Metadata

| Field | Value |
|-------|-------|
| Author | OBLITERATUS |
| Base | `thinkingmachines/Inkling-2-Mini` |
| Architecture | `inkling2_loop` (24 layers; loop over layers `6–17` × `3` passes; 128 experts top-8) |
| Format | `IQ4_NL` GGUF (`15.30 GB` / `14.25 GiB`, 4.69 BPW; requires `llama.cpp b12611+` or `inkling2-loop` fork) |
| Surgery | Rank-2 projection on attention outputs; conv-compensated; skips final coda layers `22–23` |
| Downloads | 0 on main GGUF repo (`2,191` on `-prefill`; `29` likes, HF API 2026-11-27) |
| License | Apache-2.0 |

## Loop-Aware Scaling Profile

| Zone | Layers | Scale | Relative Delta |
|------|--------|------:|---------------:|
| Pre-loop | 4–5 | 4.0 | 11–12% |
| Loop core (×3 passes) | 6–17 | 2.5 | 7–8% per pass |
| Early coda | 18–21 | 4.0 | 11–12% |
| Final coda | 22–23 | skipped | 0% |

On a 740-prompt benchmark judged by Venice `llama-3.3-70b`, stock `Inkling-2-Mini` answered **0.0%** in thinking mode (`83.8%` with retraction cutoff), whereas pure abliterated weights hit **86.8%** (`96.9%` with `uncensor.py` retraction cutoff; manual review notes true substantive compliance around `85–90%`). Thinking/CoT mode is intentionally sacrificed.

## Why It Matters

- **First public looped-transformer abliteration recipe:** Standard uniform layer scaling over-ablates looped layers (`6–17` execute three times per pass) or breaks output coherence in layers `22–23`. Lowering loop-core scale to `2.5` while skipping `22–23` preserves fluency.
- **Inference-time retraction cutoff (`uncensor.py`):** Shows that models often emit a substantive prefix before self-retracting, meaning lightweight logit/stop-string hooks recover substantial refusal margin even on unedited weights.
- **Consumer RAM footprint:** At ~15 GB quantized, 26B-class uncensored looped MoE models run locally on single consumer GPUs or Apple Silicon laptops.

## Read More

- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)
- [Obliterated & Heretic Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **OBLITERATUS**.
