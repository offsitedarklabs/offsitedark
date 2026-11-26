---
title: "Meta-Llama-3.1-8B-Instruct Abliterated (mlabonne) — The Reference Abliteration"
slug: "llama-31-8b-instruct-abliterated-mlabonne"
date: 2026-11-26
type: grep
category: abliterated
tags: [llama, llama-3.1, mlabonne, abliteration, uncensored, neuraldaredevil, dpo]
excerpt: "The textbook single-direction abliteration of Llama 3.1 8B Instruct, and the NeuralDaredevil variant that adds preference tuning to recover lost capability."
author: mlabonne
hfModelId: mlabonne/Meta-Llama-3.1-8B-Instruct-abliterated
hfUrl: https://huggingface.co/mlabonne/Meta-Llama-3.1-8B-Instruct-abliterated
source: Hugging Face
downloads: 9314
likes: 226
pipelineTag: text-generation
baseModel: meta-llama/Meta-Llama-3.1-8B-Instruct
draft: false
---

## What Is This?

An abliterated **Meta-Llama-3.1-8B-Instruct** by **mlabonne** (Maxime Labonne), created 2024-07-24 and last modified 2024-09-14, Llama 3.1 licence. It applies the Arditi et al. refusal-direction projection, following the recipe popularised by FailSpy and explained by Labonne in a widely read write-up.

## Metadata

| Field | Value |
|-------|-------|
| Author | mlabonne |
| Base | `meta-llama/Meta-Llama-3.1-8B-Instruct` |
| Parameters | about 8.03B |
| Downloads | 9,314 (API, 2026-11-26) |
| Likes | 226 |
| License | Llama 3.1 |

## Sibling: NeuralDaredevil

`mlabonne/NeuralDaredevil-8B-abliterated` (created 2024-05-27, 15,801 downloads, 304 likes, Llama 3 licence) starts from an abliterated Daredevil and then runs a DPO pass. That "abliterate, then heal" recipe is now widely copied, because abliteration alone costs some capability.

## Why It Matters

- It is the cleanest example of the original method (one direction, projected out) against which later work, including the concept-cone result (Wollschläger et al., arXiv:2502.17420), is measured.
- It illustrates the repair pattern: the edit hurts, a preference-tuning step recovers some of it, and the result is a model whose provenance is two steps removed from the one tested.
- Strong baseline for the evaluation checklist: reproduce the numbers on the exact build, with a classifier and not only keywords.

## Read More

- [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms)
- [Uncontrolled Abliterated LLMs: Failure Modes and Containment](/research/uncontrolled-abliterated-llms-failure-modes)

## Attribution

Open-source model indexed for security research inquiry. Published on Hugging Face by **mlabonne**.
