---
title: "Obliterated, Heretic and Uncensored Open-Weight LLMs: A Field Guide to the Families, the Tools and the Numbers"
slug: "obliterated-heretic-uncensored-open-weight-llms"
date: 2026-11-26
type: research
category: ai
tags: [ai, abliteration, heretic, obliteratus, uncensored, qwen, gemma, glm, dolphin, hugging-face]
excerpt: "Three ways a model loses its refusals (fine-tuning, manual abliteration, automated optimisation), the tools behind them, and what Qwen3.8-27B, Gemma-4-E4B, GLM-4.7-Flash, gpt-oss-20b, Llama 3.1 and Dolphin tell us about the quality of the claims."
draft: false
wip: false
---

"Uncensored" on Hugging Face is no longer a niche. A tool vendor's own telemetry counted roughly 13,000 models tagged `abliterated` in mid-November 2026 (a figure reported by Near AI), the Heretic tool alone has thousands of derived repositories, and the most-downloaded single release in this family (`OBLITERATUS/Qwen3.8-27B-OBLITERATED`) has crossed 630,000 downloads.

This is the survey. It is deliberately organised by *how the refusals were removed*, because that decides what can break later. The DeepSeek-specific case is in [DeepSeek Obliterated & Abliterated Models](/research/deepseek-obliterated-abliterated-models), and what to do about the risk is in [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes).

## Three ways to remove refusals

```text
                       "uncensored" open-weight model
                                   |
         +-------------------------+--------------------------+
         |                         |                          |
   1. Retrain it             2. Edit the weights        3. Search for the edit
   (SFT / DPO on             (abliteration with a       (Optuna-style optimiser
   "compliant" data)         human-chosen layer/        chooses layers, weights
                             strength recipe)           and directions per model)
         |                         |                          |
   Dolphin, Lexi,            FailSpy, mlabonne,         Heretic, OBLITERATUS
   many "Venice" tunes       huihui-ai (most repos)     "optimized" / "informed" paths
         |                         |                          |
   Changes behaviour         Changes one subspace       Same operation, but a loop
   everywhere, can leak      of the weights; can leave  that trades refusals vs KL
   training-data bias        capability intact or not   against harmless prompts
```

### 1. Dataset-uncensored fine-tunes

These take a base or instruct model and train it on data in which the assistant never refuses (often with a system prompt pushing compliance). Two representative, still-popular examples:

- **Dolphin** by Cognitive Computations / `dphn`. [`dphn/Dolphin-Mistral-24B-Venice-Edition`](https://huggingface.co/dphn/Dolphin-Mistral-24B-Venice-Edition) (created 2025-06-12, Apache-2.0, based on Mistral-Small-24B-Instruct-2501) has 6,035 downloads and 801 likes. [`dphn/Dolphin3.0-Llama3.1-8B`](https://huggingface.co/dphn/Dolphin3.0-Llama3.1-8B) has 3,651 downloads and 420 likes.
- **Lexi**: [`Orenguteng/Llama-3.1-8B-Lexi-Uncensored-V2`](https://huggingface.co/Orenguteng/Llama-3.1-8B-Lexi-Uncensored-V2), 9,743 downloads and 344 likes, Llama 3.1 licence.

Fine-tuning moves *every* weight a little, so its side effects are not confined to the refusal behaviour. The research on emergent misalignment (covered in the failure-modes article) shows that narrow training objectives can generalise into broad behavioural shifts, which is a reason to be more careful, not less, with fine-tunes whose training mix is not published.

### 2. Manual abliteration

[Arditi et al. (2024)](https://arxiv.org/abs/2406.11717) showed refusal is mediated by approximately one direction in the residual stream and that projecting it out of the weights removes it. The public recipe was then productised by individuals:

- **FailSpy** published the first widely used abliterated Llama 3 models and the notebook that went with it.
- **mlabonne** (Maxime Labonne) wrote the standard explainer and published models, including [`mlabonne/Meta-Llama-3.1-8B-Instruct-abliterated`](https://huggingface.co/mlabonne/Meta-Llama-3.1-8B-Instruct-abliterated) (created 2024-07-24, 9,314 downloads, 226 likes).
- Labonne's [`NeuralDaredevil-8B-abliterated`](https://huggingface.co/mlabonne/NeuralDaredevil-8B-abliterated) (15,801 downloads, 304 likes) added a preference-tuning ("DPO healing") pass after abliteration to recover capability lost to the edit, a recipe now copied widely.
- **huihui-ai** industrialised it, with a self-described "crude, proof-of-concept" Transformers script and catalogues across Llama, Qwen, DeepSeek, Gemma and Mistral families.
- **Wollschläger et al. (2025)** argued that refusal is better described as a multi-dimensional *concept cone* than one direction ([arXiv:2502.17420](https://arxiv.org/abs/2502.17420)), which explains why single-direction removal leaves residue that rank-k variants clear.

### 3. Automated optimisation: Heretic and OBLITERATUS

**Heretic** (`p-e-w/heretic`, released in November 2025) wraps abliteration in an optimiser. It uses Optuna's TPE sampler to search for per-layer weights and directions, scoring each trial on two things at once: how many held-out harmful prompts still get refused, and the KL divergence of the edited model from the original on harmless prompts. Newer releases add an optimised variant of the projection that Heretic's authors call ARA. The pitch is that a person who does not understand the maths can produce a model with few refusals *and* little behavioural drift.

**OBLITERATUS** (`elder-plinius/OBLITERATUS`, by "Pliny the Prompter") ships named methods (`basic`, `advanced`, `aggressive`, `surgical`, `optimized`, `inverted`, `nuclear`, `informed`) plus a `failspy` preset that reproduces the classic recipe. The Hub organisation `OBLITERATUS` publishes ready-made models under the `OBLITERATED` name. Its own cards document methods such as whitened SVD, attention-head surgery, LEACE blending, iterative stacking and targeted corpora.

The tools are not symmetric. The Failure-First analysis of 30,238 telemetry records from OBLITERATUS users ([report 69](https://failurefirst.org/research/reports/69-obliteratus-telemetry-analysis-30k/)) found that how much refusal remains depends strongly on model family and method, with Qwen-family models the most resistant to ablation (32.6% mean refusal remaining) while models such as `DeepSeek-R1-Distill-Llama-8B` went to 0.0%.

## What an independent comparison found

Young's paper ([arXiv:2512.13655v2](https://arxiv.org/abs/2512.13655v2)) compares abliteration tools (Heretic, DECCP, ErisForge and a single-pass baseline) across several instruction-tuned models. Three results matter for anyone choosing a download:

1. **The tools disagree on the same model.** `zephyr-7b-beta` under Heretic reached 2/100 refusals at KL 0.076, while Qwen2.5-7B-Instruct was at 42/100 (KL 1.646) and StableLM-2 at 54/100 (KL 1.605). A low refusal count with a high KL is not "clean".
2. **Capability loss is task dependent.** On `deepseek-llm-7b-chat`, Heretic cut GSM8K from 44.58% to 40.11% while single-pass DECCP (43.59%) and ErisForge (44.35%) stayed near base, at the price of weaker refusal removal. A method that optimises refusals and KL does not optimise maths.
3. **Judging the refusal is part of the result.** Marker-based refusal heuristics measured 72.2% of refusals where a classifier measured 95.7%. The same evaluator sets both the headline and the "it worked" claim.

The paper is also a reminder that KL on harmless prompts and refusal count on a held-out harmful set are proxies. Neither measures whether a long answer stays coherent, whether tool calls stay valid or whether the model silently answers a different question.

## The families, one by one

### Qwen3.8-27B (OBLITERATUS): the volume leader

[`OBLITERATUS/Qwen3.8-27B-OBLITERATED`](https://huggingface.co/OBLITERATUS/Qwen3.8-27B-OBLITERATED) (created 2026-08-19, updated 2026-11-26 `d8ab3e2` rebuilding `Q2_K` / `IQ4_XS` GGUFs, Apache-2.0, **632,256 downloads, 1,757 likes**) is the most-downloaded model in this survey. Its card documents three generations:

| Version | Method (per the card) | MMLU (0-shot, 5,700 q) | Behaviour reported |
|---|---|---:|---|
| Stock Qwen3.8-27B | n/a | 84.46% | refuses |
| V1 | 5 rounds of iterative SVD abliteration, 5 directions | 81.4% (-3.06 pp; card prints `-6.0 pp` from earlier `n=285` row) | hard refusals removed; "noticeably dumber" |
| V2 | SVD blended with LEACE, 60/40 weight-space interpolation | 84.32% (-0.28 pp) | hard refusals removed; soft safety-lecture deflections remain; thinking mode refused |
| V3 | gentle iterative refinement plus targeted surgery plus blend | 82.33% (-2.12 pp) | no hard refusal, no deflection; thinking works |

Details worth reading critically:

- STEM took the biggest hit (-3.3 pp) while philosophy and European history moved *up* by 4 to 6 points; the card links the pattern to refusal directions overlapping structured reasoning. That is a plausible hypothesis, not a proven mechanism.
- The card's own tuning advice is a warning label: it recommends greedy decoding with a repetition penalty of 1.15 because without it, "greedy decoding loops on imports/boilerplate", and tells agent builders to summarise history after about 10 turns "because context fills up with repeated actions."
- It advises an *empty* system prompt, since system prompts "can reintroduce refusals". That is the card admitting residual safety behaviour is still in the weights.
- The ship-it template prefills an empty thinking block. A user who loads the GGUF with a different template gets different behaviour from the same weights.
- The "advanced real-world" suite is 8 tasks and illustrates how hastily cards are edited: the top summary table lists Stock at 5/8 and V3 at 7/8, whereas the detailed checklist below scores both Stock and V3 at 7/8 failing the same multi-tool-chain task. Even taken at face value, 8 tasks cannot show much either way.

### Gemma-4-E4B-it (OBLITERATUS): the instructive failure log

[`OBLITERATUS/gemma-4-E4B-it-OBLITERATED`](https://huggingface.co/OBLITERATUS/gemma-4-E4B-it-OBLITERATED) (created 2026-04-15, Apache-2.0, 41,853 downloads, 842 likes) is a 4B-effective-parameter model small enough for a phone. It also has the most candid post-mortem of any card in the ecosystem.

- The headline: hard refusal rate fell from **98.8% to 0%**, with 21 of 42 layers modified, from a corpus of 842 contrastive prompt pairs.
- The qualifier, in the card's own table: ~28% soft deflection, ~51% coherent and on-topic, ~20% degenerate repetition loops, ~4% wrong-language outputs. "0% refusal" and "51% useful" are the same model.
- The model was built "nearly fully autonomously" by an AI agent in under 10 human prompts. The first attempt produced Arabic and Marathi gibberish; a later build ran out of memory after 11 hours.
- **v2 shipped with a bug**: a head-surgery step deleted 54 K/V projection tensors from layers 24 to 41 because Gemma 4 shares K/V weights across layers, so the projection was applied 18 times to the same tensor and the corrupted tensors were dropped on save. The GGUFs had 666 tensors instead of 720, and the card says they hallucinated. v3 fixes it by applying the projection once.

The takeaway is not that the project is sloppy. It is that a headline refusal figure on a published model can come from a build that was structurally damaged, and that a bad version was publicly downloadable.

### GLM-4.7-Flash (Heretic)

The ecosystem around Zhipu's GLM-4.7-Flash is mostly Heretic derived. `ThalisAI/GLM-4.7-Flash-heretic` reports 6/100 refusals at KL 0.0071 after one round (the "Apostate" automated pipeline) with Q8_0, Q6_K and Q4_K_M GGUFs and bf16 weights; it has 6,893 downloads at the time of writing and a licence marked `other`. `DavidAU/GLM-4.7-Flash-Uncensored-Heretic-NEO-CODE-Imatrix-MAX-GGUF` has 42,566 downloads, and the family fans out into multi-model merges and distillations (for example, "Gemma-3-1B-it-GLM-4.7-Flash-Heretic-Uncensored-Thinking") that inherit labels without inheriting verification.

### gpt-oss-20b (Heretic)

[`p-e-w/gpt-oss-20b-heretic`](https://huggingface.co/p-e-w/gpt-oss-20b-heretic) (created 2025-11-16, Apache-2.0, 2,584 downloads, 162 likes) is the reference Heretic release on OpenAI's open-weight model. It is also the standard example of an evaluation artefact: an independent write-up (aithinkerlab) re-scored it at roughly 58 of 100 refusals when the model's chain-of-thought still hesitated, even where the final output complied. If your monitor reads the reasoning channel, the model "refuses" in the thought and "complies" in the answer, and the two do not agree on which counts.

### Llama 3.1 8B: the baseline generation

The 2024 releases are still the numbers everyone compares to: `mlabonne/Meta-Llama-3.1-8B-Instruct-abliterated` (9,314 downloads), `NeuralDaredevil-8B-abliterated` (15,801), `Lexi-V2` (9,743), and the Dolphin 3.0 Llama 3.1 fine-tune. Together they show the three approaches next to each other on one backbone, which is why they remain the best teaching set.

### The clone economy

Small models are where derivative volume explodes. A search for Heretic variants of Qwen3.5-4B returns repositories with 157,892, 29,832 and 27,773 downloads (the highest is a quantised derivative, `mradermacher/DeepSeek-V4-Pro-Qwen3.5-4B-UNCENSORED-heretic-GGUF`), and OBLITERATUS' own derivative families (`Ornith-1.5-9B`, 332,720 downloads; `Gemma-4-12B`, 22,680) travel far beyond the original repositories. The original card is rarely the artefact people actually run. Quantisers and merge authors redistribute it, and they do not repeat the caveats.

## A reading checklist for any "uncensored" model card

| Question | Why it matters |
|---|---|
| Which of the three families is it? | Fine-tunes, manual edits and optimiser-found edits fail in different ways |
| Is the refusal count measured with a classifier, keywords or humans? | Marker heuristics measured 72.2% against a classifier's 95.7% |
| Are partial refusals and soft deflections counted separately? | They move *up* when hard refusals move *down* |
| Is KL reported, and on what prompts? | KL on harmless prompts says nothing about long outputs or tool calls |
| Are capability benchmarks beyond MMLU reported? | Flat MMLU can hide losses in maths, truthfulness and agentic tasks |
| Does the card list any instability (loops, template dependence, system-prompt sensitivity)? | These are the failures you will hit in production |
| Does the card say which chat template and quantisation were evaluated? | A different template or quant is a different model |
| Is the repo `safetensors`-only, with a pinned revision? | See the supply-chain section of the failure-modes article |

## Why the covert-noncompliance caveat matters

Several cards in this survey describe responses that look compliant but are not: a household-bomb question answered as a bath-bomb question (mrfakename on DeepSeek V4.1 Flash), "soft deflection" (Gemma-4-E4B v3 at ~28%), hedged partials (OBLITERATUS V4.1 at 14.44%). Keyword-based refusal detection scores those as success. The reverse also occurs, as with gpt-oss-20b-heretic, where hesitation in the reasoning channel scores as refusal. Anyone using these models in a pipeline should treat a refusal metric as a rough indicator rather than a guarantee in either direction.

## Tracked artefacts

- [Qwen3.8-27B OBLITERATED](/greps/qwen38-27b-obliterated)
- [Gemma-4-E4B-it OBLITERATED v3](/greps/gemma-4-e4b-obliterated)
- [GLM-4.7-Flash heretic](/greps/glm-47-flash-heretic)
- [gpt-oss-20b heretic](/greps/gpt-oss-20b-heretic)
- [Dolphin Mistral 24B Venice Edition](/greps/dolphin-mistral-24b-venice-edition)
- [Lexi Uncensored V2 (Llama 3.1 8B)](/greps/lexi-uncensored-v2-llama31-8b)
- [mlabonne Llama 3.1 8B Instruct abliterated](/greps/llama-31-8b-instruct-abliterated-mlabonne)
- [Qwen3-4B cybersecurity heretic](/greps/qwen3-4b-cybersecurity-heretic)

## Sources

- [Arditi et al., Refusal in Language Models Is Mediated by a Single Direction (arXiv:2406.11717)](https://arxiv.org/abs/2406.11717)
- [Wollschläger et al., The Geometry of Refusal in Large Language Models (arXiv:2502.17420)](https://arxiv.org/abs/2502.17420)
- [Young, Comparative Analysis of LLM Abliteration Methods (arXiv:2512.13655v2)](https://arxiv.org/abs/2512.13655v2)
- [Failure-First, OBLITERATUS telemetry analysis (30,238 records)](https://failurefirst.org/research/reports/69-obliteratus-telemetry-analysis-30k/)
- [OBLITERATUS/Qwen3.8-27B-OBLITERATED](https://huggingface.co/OBLITERATUS/Qwen3.8-27B-OBLITERATED)
- [OBLITERATUS/gemma-4-E4B-it-OBLITERATED](https://huggingface.co/OBLITERATUS/gemma-4-E4B-it-OBLITERATED)
- [ThalisAI/GLM-4.7-Flash-heretic](https://huggingface.co/ThalisAI/GLM-4.7-Flash-heretic)
- [p-e-w/gpt-oss-20b-heretic](https://huggingface.co/p-e-w/gpt-oss-20b-heretic)
- [dphn/Dolphin-Mistral-24B-Venice-Edition](https://huggingface.co/dphn/Dolphin-Mistral-24B-Venice-Edition)
