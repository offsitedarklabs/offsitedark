---
title: "Strix XSS 4B RL — Reinforcement-Learned XSS Agent"
slug: "strix-xss-4b-rl"
date: 2026-02-05
type: grep
category: pentest
tags: [xss, strix, pentest, qwen3, reinforcement-learning, agent, cybersecurity]
excerpt: "Uploaded to Hugging Face by kusonooyasumi — 4B Qwen3-Thinking RL proof-of-concept for Strix XSS detection; 0.79 on Prime Intellect strix-xss eval."
author: kusonooyasumi
hfModelId: kusonooyasumi/strix-xss-4b-rl
hfUrl: https://huggingface.co/kusonooyasumi/strix-xss-4b-rl
source: Kanti Labs
sourceUrl: https://kantilabs.xyz/
downloads: 4
likes: 0
pipelineTag: reinforcement-learning
baseModel: Qwen/Qwen3-4B-Thinking-2507
draft: false
---

## What Is This?

Community upload on Hugging Face by **kusonooyasumi**, published under the [Kanti Labs](https://kantilabs.xyz/) offensive web security research program. **Strix-XSS-4B-RL** is a proof-of-concept 4B model trained with reinforcement learning for XSS detection as a Strix sub-agent. The authors mark it as early research — not production-ready — and note it requires a modified Strix build. It is **not** an OFFSITE.DARK release.

## Metadata

| Field | Value |
|-------|-------|
| Author | kusonooyasumi |
| Research lab | [Kanti Labs](https://kantilabs.xyz/) |
| Base model | Qwen/Qwen3-4B-Thinking-2507 |
| Method | Reinforcement learning (Strix simulated environments) |
| Scale | 4B parameters (F16 safetensors) |
| Pipeline | reinforcement-learning |
| Eval score | 0.79 on [Prime Intellect strix-xss](https://app.primeintellect.ai/dashboard/environments/oyasumi/strix-xss) |
| License | MIT |
| Created | 2026-02-05 |

## Tagged Capabilities

The model card positions this as an RL-trained Strix specialist:

- **XSS detection** — optimized for cross-site scripting identification in simulated web apps
- **Multi-agent architecture** — designed as a sub-agent alongside other vuln-type models
- **Thinking model** — built on Qwen3-4B-Thinking for chain-of-thought reasoning
- **Lightweight deployment** — 4B scale for consumer-hardware inference

## Why It Might Matter

RL-trained offensive sub-agents represent a shift from static SFT toward **environment-reward optimization**:

1. **RL for vuln hunting** — models trained against simulated pentest environments rather than static instruction corpora
2. **Eval infrastructure** — Prime Intellect strix-xss environment enables reproducible XSS agent scoring
3. **PoC-to-production path** — Kanti Labs documents SFT baselines (8B) and RL experiments (4B) as an iterative research line

For defenders and researchers, the value is understanding whether RL closes the gap between specialized XSS agents and human triage on structured eval harnesses.

## Research Questions

- How much does RL improve over the SFT Strix XSS line on identical eval environments?
- Does the 4B RL model generalize beyond Prime Intellect simulated targets?
- What Strix framework modifications are required for reliable sub-agent orchestration?

## Supply Chain Note

Download from Hugging Face only. Verify checksums, prefer safetensors, and never load pickle-serialized weights in production pipelines. Third-party security models may carry elevated supply-chain risk — treat as untrusted code until audited.

## Sources

- [Kanti Labs](https://kantilabs.xyz/) (research lab / model program)
- [Hugging Face — kusonooyasumi/strix-xss-4b-rl](https://huggingface.co/kusonooyasumi/strix-xss-4b-rl)
- [Prime Intellect — strix-xss environment](https://app.primeintellect.ai/dashboard/environments/oyasumi/strix-xss)

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **kusonooyasumi** under the Kanti Labs research program. OFFSITE.DARK does not endorse or distribute this artifact.
