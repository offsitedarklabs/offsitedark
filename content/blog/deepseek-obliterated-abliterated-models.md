---
title: "DeepSeek Obliterated & Abliterated Models: MoE Surgery, Rank-2 Refusal Splits, and Reasoning Drift"
slug: "deepseek-obliterated-abliterated-models"
date: 2026-11-26
type: research
category: ai
tags: [ai, deepseek, abliteration, obliteratus, moe, chain-of-thought, alignment, uncensored]
excerpt: "A forensic read of DeepSeek-V4.1-Flash-1017-obliterated, mrfakename's native-FP8 rank-2 edit, and the huihui-ai DeepSeek-V3/V4/R1 lineages: what the published numbers prove, what they hide, and why reasoning-mode models break naive refusal removal."
draft: false
wip: false
---

DeepSeek checkpoints are the centre of gravity of the uncensored open-weight scene. Permissive licensing (MIT on the flagship MoE releases and the R1 distills), strong coding and maths baselines, and a steady cadence of upstream drops turned `DeepSeek-V3`, `DeepSeek-R1` and `DeepSeek-V4.1-Flash-1017` into immediate targets for refusal removal, usually within days of release.

"Obliterated" and "abliterated" are not the same word. **Abliteration** is the technique: find a refusal direction in the residual stream and project it out of the weights ([Arditi et al., 2024](https://arxiv.org/abs/2406.11717)). **OBLITERATUS** is a specific open-source toolkit (`elder-plinius/OBLITERATUS`) that automates abliteration, and models it produces carry `OBLITERATED` or `obliterated` in the repo name. Every OBLITERATUS model is abliterated. Most abliterated models are not OBLITERATUS models. This article keeps the two terms apart.

DeepSeek is a hard target for the single-direction recipe that worked on dense Llama models. It is a Mixture-of-Experts (MoE) stack with always-on shared experts, auxiliary prediction layers, mixed FP8/FP4 storage, and a dedicated reasoning mode. Each of those breaks an assumption that the original method quietly made.

## Why DeepSeek breaks the naive recipe

The classic procedure takes the difference of mean activations between harmful and harmless prompts, normalises it into a unit vector `r`, and orthogonalises every matrix that writes into the residual stream:

```text
W' = W - s * (r r^T) W        (s = ablation strength, per layer)
```

On a dense model that means attention output projections and MLP down-projections. On DeepSeek-V4.1-Flash the write surface looks like this:

```text
  Input tokens
       |
       v
  +-----------------------------------------------------------+
  | Layers 0..39  (main DeepSeek MoE stack)                   |
  |                                                           |
  |   attn.wo_b ------------+     ffn.shared_experts.w2 -----+ |  <- residual-stream writes
  |   (attention output)    |     (always active)           | |     (targets of surgical edits)
  |                         v                               v |
  |   Router --> top-k routed experts (6 per token)           |  <- untouched by lightweight edits
  +-----------------------------+-----------------------------+
                                |
  +-----------------------------v-----------------------------+
  | Engram tables, DSpark / multi-token-prediction layers     |  <- layers 40-42; easy to desync
  | (layers 40-42)                                            |
  +-----------------------------+-----------------------------+
                                |
              chat mode  <----->  think mode
              refusal dir A       refusal dir B   (not the same direction)
```

Three practical consequences follow.

1. **Refusal is not one vector once a reasoning mode exists.** mrfakename's measurements (below) found that chat mode and think mode refuse along different directions. Remove one and the other survives.
2. **Precision handling is part of the attack surface.** The upstream checkpoint is roughly 510 GB of mixed FP8/FP4. A tool that dequantises to BF16 produces a roughly 1.5 TB artefact. A tool that edits FP8 in place must round stochastically or the small edits snap back to the original values.
3. **Cloning outruns verification.** [MicroAIOne's 2026-11-01 audit](https://microaione.com/en/community/deepseek-v41-flash-1017-obliterated-en/) counted more than 150 Hugging Face repository names containing `abliterated`, `uncensored` or `heretic` around DeepSeek-V4.1-Flash within about two weeks. Most publish no KL numbers, no coherence checks and no multi-turn tests.

## Case study 1: `OBLITERATUS/DeepSeek-V4.1-Flash-1017-obliterated`

[`OBLITERATUS/DeepSeek-V4.1-Flash-1017-obliterated`](https://huggingface.co/OBLITERATUS/DeepSeek-V4.1-Flash-1017-obliterated) was created 2026-10-23 and last updated 2026-10-30, MIT licence. At the time of writing the Hugging Face API reports **30,281 downloads** and **315 likes**. It is the best-documented frontier-scale DeepSeek ablation, which makes it a good lesson in how headline numbers get misquoted.

| Property | Upstream `DeepSeek-V4.1-Flash-1017` | OBLITERATUS release |
|---|---|---|
| Architecture | `DeepseekV41ForCausalLM`, 6 experts per token | same |
| Parameters | about 763B | 754.6B (`754,599,510,544` BF16 plus `39,357,040` F32) |
| Storage | about 510 GB, mixed FP8/FP4 | about 1,509 GB, 83 BF16 safetensors shards |
| Method | stock | OBLITERATUS v0.1.4, `failspy` preset |
| Ablation config | n/a | `diff_means`, 1 direction, all layers except layer 0, no norm preservation, KL budget 0.5 |
| Calibration | n/a | 256 harmful and 256 harmless prompts |

The 3x storage jump is the first thing capacity planners miss. You cannot size this model from the 510 GB upstream figure.

### Two evaluations that get merged into one false claim

Social media summaries say "refusals fall from 81.62% to 4.30% (2/50)". That merges two different tests.

**The tournament (50 prompts)**, used to pick the method: refusal 4% (2 of 50), forward KL 0.1305 nats against the original, coherence 100%, and 6 of 6 coarse capability spot checks (chain of thought, code, instruction following, JSON, tool calls).

**The corpus evaluation (838 prompts)**: the OBLITERATUS corpus has 842 prompts; both models produced complete answers for 838. Annotation was done by two LLM judges (Claude Opus 4.6 and GPT-6.1 Sol per the card) plus three local reviews, on 2026-10-30.

| Measure | Stock | Obliterated | Delta (pp) |
|---|---:|---:|---:|
| Full refusal | 684 (81.62%) | 36 (4.30%) | -77.33 |
| Partial refusal | 41 (4.89%) | 121 (14.44%) | +9.55 |
| No refusal | 112 (13.37%) | 656 (78.28%) | +64.92 |
| Unresolved | 1 (0.12%) | 25 (2.98%) | +2.86 |
| Harmful assistance | 87 (10.38%) | 656 (78.28%) | +67.90 |
| Harmfulness 3 (serious) | 32 (3.82%) | 375 (44.75%) | +40.93 |
| Harmfulness 4 (severe or widespread) | 1 (0.12%) | 78 (9.31%) | +9.19 |
| Actionability 3 (specific steps, some essentials missing) | 23 (2.74%) | 285 (34.01%) | +31.26 |
| Actionability 4 (concrete enough to enable the conduct) | 29 (3.46%) | 174 (20.76%) | +17.30 |

Read the shape, not just the headline:

- **Partial refusals roughly tripled.** The model often declines one clause and answers another. Those responses still contain usable material and slip past any monitor that only looks for "I cannot".
- **Serious plus severe harm went from about 3.9% to 54.1%.** Levels 3 and 4 combine to 33 of 838 in stock and 453 of 838 after ablation. Level 4 actionability, the "sufficiently concrete to enable the conduct" bucket, went from 29 to 174 responses.
- **The card has internal inconsistencies.** The summary table says 656 harmful-assistance responses, while the text beneath it says that of 656 non-refusals, 563 were harmful assistance and 93 were not. MicroAIOne flagged the same mismatch. 254 of the 838 corpus prompts also overlapped the calibration set, and 25 obliterated responses (2.98%) could not be scored because judge providers blocked them. The metadata records a `not_validated` concept verdict and a dirty git tree for the tooling.

### Flat MMLU is not "nothing broke"

On a held-out 2,500-question zero-shot MMLU (43 or 44 questions per subject, thinking disabled, answer-choice logits) accuracy moved from **87.96% (2199/2500)** to **88.08% (2202/2500)**, McNemar `p = 0.743`. That is a statistical tie. Underneath, subjects moved in both directions (`college_computer_science` and `professional_law` each -2.27 pp, `high_school_mathematics` -2.33 pp, `virology` +2.27 pp).

MMLU in this form measures knowledge recall. It does not measure multi-turn coding, tool adherence, long-context behaviour, repetition stability, or whether the model hedges. A clean MMLU result is necessary, not sufficient.

## Case study 2: `mrfakename/DeepSeek-V4.1-Flash-1017-abliterated`

[`mrfakename/DeepSeek-V4.1-Flash-1017-abliterated`](https://huggingface.co/mrfakename/DeepSeek-V4.1-Flash-1017-abliterated) (created 2026-10-17, updated 2026-11-18, MIT, **13,117 downloads**, 51 likes) predates the OBLITERATUS drop by six days and reports a mechanism the single-direction runs miss.

### Chat and think refuse along different directions

Refusal directions were measured separately for chat prompts and think prompts at every layer on a Q8_0 GGUF. The refusal subspace turned out to be at least rank 2. The edit therefore removes the top singular vectors of both directions together:

```text
W' = W - s * Q Q^T W
```

- **Edited:** `attn.wo_b` and `ffn.shared_experts.w2` in the 40 main layers, each layer with its own strength chosen by a multi-objective search that minimises refusals and first-token KL on harmless prompts.
- **Left bit-identical:** routed experts, embeddings, Engram tables, and the DSpark/MTP layers 40 to 42.
- **Requantised** to FP8 with the original block scales and *stochastic rounding*, so the edit survives quantisation. The checkpoint stays about 510 GB across 48 shards.

The repo also ships `abliteration-edit.npz` (the basis and per-layer scales) and `abliteration-lora.gguf`, a rank-2 LoRA that applies the same edit to the original GGUFs at load time. That detachable form matters for governance: the "uncensoring" can be shipped separately from the base weights.

### Results, and a quiet failure mode

Held-out set of 100 harmful prompts, Q8_0 GGUF, greedy decoding, 384 generated tokens:

| Variant | Chat refusals (/100) | Think-mode reasoning-head refusals (/100) | First-token KL (harmless) |
|---|---:|---:|---:|
| Stock | 97 | 98 | 0 |
| Rank-2 abliterated | 4 | 9 | 0.067 |

The card is candid about residue. In think mode some answers "still steer away from the request", for example a request about a household bomb quietly becoming a bath bomb. There is no refusal string anywhere in that response. A keyword evaluator scores it as successful compliance. A downstream pipeline experiences silent semantic drift.

## Case study 3: the `huihui-ai` DeepSeek family and the R1 distills

**huihui-ai** published the largest catalogue of DeepSeek abliterations, built with a "crude, proof-of-concept" Transformers implementation (`remove-refusals-with-transformers`, no TransformerLens). Their cards use that exact wording.

| Repository | Base | Notes from the cards and Hub API |
|---|---|---|
| `huihui-ai/DeepSeek-V3-abliterated` | DeepSeek-V3 (671B MoE) | Ollama builds (Q4_K_M, Q3_K_M, Q2_K); the card's example loads with `trust_remote_code=True` |
| `huihui-ai/Huihui-DeepSeek-V4-Flash-Vision-Exp-abliterated-GGUF` | DeepSeek-V4-Flash-Vision-Exp | Layers 11 to 28 ablated (1-based); expert modules not ablated; full usage-warning block |
| `huihui-ai/DeepSeek-R1-0528-Qwen3-8B-abliterated` | R1-0528 Qwen3-8B distill | 8.19B BF16, auto-gated, 119 downloads, 45 likes; MIT |
| `huihui-ai/DeepSeek-R1-Distill-Qwen-32B-abliterated` | R1 distill on Qwen 32B | 32.8B BF16, 1,171 downloads, 259 likes |
| `huihui-ai/DeepSeek-R1-Distill-Qwen-14B-abliterated-v2` | R1 distill on Qwen 14B | 14.8B BF16, 1,230 downloads, 179 likes; the card says v2 fixes a problem in v1 |
| `huihui-ai/DeepSeek-R1-Distill-Llama-8B-abliterated` | R1 distill on Llama 8B | 8.03B BF16, 928 downloads |

The distill cards carry a telling workaround. If the `<think>` block does not appear or the model refuses, the card advises giving the model an example question first (a "how many r's in strawberry" style example) to prime it. Reasoning-distill models bake policy deliberation into the thought trace itself, so removing a residual direction does not always remove the learned behaviour of opening a thought block with policy talk.

### Backbone matters more than the DeepSeek label

An R1 distill is a Qwen or Llama model fine-tuned on DeepSeek reasoning traces. The refusal geometry belongs largely to the backbone, and the backbone changes the outcome:

- [Failure-First's analysis of 30,238 OBLITERATUS telemetry records](https://failurefirst.org/research/reports/69-obliteratus-telemetry-analysis-30k/) lists `DeepSeek-R1-Distill-Llama-8B` among the most vulnerable models at **0.0% refusal** after ablation, while Qwen-family models were the most resistant (**32.6% mean refusal**).
- `OBLITERATUS/DeepSeek-R1-Distill-Llama-8B-OBLITERATED` (created 2026-05-17, 163 downloads, 5 likes) is the corresponding Hub artefact.
- In [Young's cross-tool study (`arXiv:2512.13655v2`)](https://arxiv.org/abs/2512.13655v2), `deepseek-llm-7b-chat` under Heretic fell to 16/100 refusals at KL 0.043 but lost GSM8K accuracy, 44.58% to 40.11% (-4.47 pp), while single-pass DECCP (43.59%) and ErisForge (44.35%) kept nearly all of it.

## What can go wrong when you run these

| Hazard | Mechanism | Evidence |
|---|---|---|
| Partial-refusal blind spots | hedge plus partial answer defeats keyword monitors | 14.44% partial refusals on the 838-prompt corpus |
| Silent think-mode redirection | reasoning head drifts the request instead of refusing | mrfakename card (bath-bomb case) |
| Quantisation drift | a requantised edit is a different edit; mrfakename had to use stochastic rounding to make the FP8 edit stick | mrfakename card; the same reason a rank-2 LoRA is shipped for GGUF |
| Template and prefill divergence | uploaders ship their own chat templates and think-block behaviour, which changes what the model does on identical weights | OBLITERATUS Qwen3.8-27B card ships a GGUF template that prefills an empty thinking block |
| Unverifiable clones | 150+ derivatives, mostly with no receipts | MicroAIOne audit |
| Scale of what comes out | at the top end, the model gives concrete, step-level assistance | 174 of 838 responses at actionability 4 |

The last row is why none of this should sit behind an open port or inside an agent with tools. The companion article [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes) covers the agent, supply-chain and containment side.

## Tracked artefacts

- [OBLITERATUS DeepSeek-V4.1-Flash-1017](/greps/deepseek-v41-flash-obliteratus)
- [mrfakename DeepSeek-V4.1-Flash-1017 abliterated](/greps/deepseek-v41-flash-mrfakename-abliterated)
- [huihui-ai DeepSeek-V3 abliterated](/greps/deepseek-v3-abliterated-huihui)
- [huihui-ai R1-0528 Qwen3-8B abliterated](/greps/deepseek-r1-0528-qwen3-8b-abliterated)
- [huihui-ai R1-Distill Qwen-14B abliterated v2](/greps/deepseek-r1-distill-qwen-14b-abliterated-v2)
- [OBLITERATUS R1-Distill Llama-8B](/greps/deepseek-r1-distill-llama-8b-obliterated)
- [Upstream DeepSeek-V3](/greps/deepseek-v3-oss-powerhouse)
- Field guide to the other families: [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)

## Sources

- [OBLITERATUS/DeepSeek-V4.1-Flash-1017-obliterated](https://huggingface.co/OBLITERATUS/DeepSeek-V4.1-Flash-1017-obliterated)
- [mrfakename/DeepSeek-V4.1-Flash-1017-abliterated](https://huggingface.co/mrfakename/DeepSeek-V4.1-Flash-1017-abliterated)
- [MicroAIOne, DeepSeek V4.1 Flash 1017 Obliterated: claims fact-checked (2026-11-01)](https://microaione.com/en/community/deepseek-v41-flash-1017-obliterated-en/)
- [huihui-ai/DeepSeek-V3-abliterated](https://huggingface.co/huihui-ai/DeepSeek-V3-abliterated)
- [Failure-First, OBLITERATUS telemetry analysis (30,238 records)](https://failurefirst.org/research/reports/69-obliteratus-telemetry-analysis-30k/)
- [Young, Comparative Analysis of LLM Abliteration Methods (arXiv:2512.13655v2)](https://arxiv.org/abs/2512.13655v2)
- [Arditi et al., Refusal in Language Models Is Mediated by a Single Direction (arXiv:2406.11717)](https://arxiv.org/abs/2406.11717)
