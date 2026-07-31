---
title: "CIRCL Vulnerability Severity Classification — RoBERTa"
slug: "circl-vuln-severity-roberta"
date: 2026-07-22
type: grep
category: code-security
tags: [vulnerability, classification, nlp, roberta, circl, cvss, text-classification]
excerpt: "Uploaded to Hugging Face by CIRCL — RoBERTa-base model classifying vulnerability severity from text; ~1.2k downloads, research DOI and arXiv lineage."
author: CIRCL
hfModelId: CIRCL/vulnerability-severity-classification-roberta-base
hfUrl: https://huggingface.co/CIRCL/vulnerability-severity-classification-roberta-base
source: Hugging Face
sourceUrl: https://huggingface.co/CIRCL/vulnerability-severity-classification-roberta-base
downloads: 1254
likes: 11
pipelineTag: text-classification
baseModel: FacebookAI/roberta-base
draft: false
---

## What Is This?

Community / lab upload on Hugging Face by **CIRCL** (Computer Incident Response Center Luxembourg). **vulnerability-severity-classification-roberta-base** is a **RoBERTa-base** fine-tune for **text classification of vulnerability severity** from advisory-style descriptions. Dataset lineage points at `CIRCL/vulnerability-scores`; model card references arXiv **2507.03607** and DOI **10.57967/hf/5926**. It is **not** an OFFSITE.DARK release.

Last notable update in this indexing window: **2026-07-22**. Sister models from the same org cover attack-technique classification and multilingual severity heads.

## Metadata

| Field | Value |
|-------|-------|
| Author | CIRCL |
| Base model | FacebookAI/roberta-base |
| Pipeline | text-classification |
| License | CC-BY-4.0 |
| Downloads | ~1.2k |
| Likes | 11 |
| Updated | 2026-07-22 |

## Why Index It

- Practical NLP for triage pipelines (map free-text vulns → severity buckets).
- Active CIRCL HF org with related classifiers updated through late July 2026.
- Complements offensive Greps (pentest LLMs) with a **defensive / triage** model.

## Related CIRCL models (same wave)

- `CIRCL/vulnerability-attack-technique-classification-roberta-base` (+ llm-expanded variant)
- `CIRCL/cwe-parent-vulnerability-classification-roberta-base`
- Multilingual severity variants (Chinese macbert, Russian ruRoberta)

## Caveats

Severity labels from text are approximate — do not replace CVSS calculators or vendor advisories. Validate on your corpus before SOC automation.

## Sources

- [Hugging Face — CIRCL/vulnerability-severity-classification-roberta-base](https://huggingface.co/CIRCL/vulnerability-severity-classification-roberta-base)
