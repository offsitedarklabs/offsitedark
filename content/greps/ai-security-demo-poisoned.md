---
title: "ai-security-demo-poisoned — Supply Chain Poisoning Demo Classifier"
slug: "ai-security-demo-poisoned"
date: 2026-06-04
type: grep
category: recent-upload
tags: [supply-chain, classifier, safetensors, security-demo, prisma-airs]
excerpt: "Uploaded to Hugging Face by 88AgentS — intentional poisoned classifier demo for AI supply chain security education alongside a clean counterpart."
author: 88AgentS
hfModelId: 88AgentS/ai-security-demo-poisoned
hfUrl: https://huggingface.co/88AgentS/ai-security-demo-poisoned
source: Hugging Face
downloads: 73
likes: 0
pipelineTag: text-classification
draft: false
---

## What Is This?

Uploaded to Hugging Face by **88AgentS**. **ai-security-demo-poisoned** is a deliberately compromised classifier model published alongside **ai-security-demo-clean** as a paired educational artifact for AI supply chain security demonstrations.

## Metadata

| Field | Value |
|-------|-------|
| Author | 88AgentS |
| Format | safetensors |
| Pipeline | classifier |
| Paired model | 88AgentS/ai-security-demo-clean |
| License | Apache 2.0 |
| Downloads | ~73 |

## Why It Might Matter

Following ReversingLabs' nullifAI discovery and ongoing pickle/safetensors supply-chain guidance, **intentional poison demos** help researchers:

- Build detection pipelines for model integrity verification
- Train security teams on typosquatting and model confusion attacks
- Test Prisma AIRS and similar scanning integrations (tagged on poisoned variant)

## Research Questions

- Can picklescan / HF security scanners reliably distinguish demo poison from benign classifiers?
- What behavioral delta exists between clean and poisoned inference outputs?
- How should registries gate "educational malware" model uploads?

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **88AgentS**. Educational artifact — do not deploy in production pipelines.
