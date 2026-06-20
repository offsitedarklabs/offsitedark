---
title: "CodeLlama for Code Security — CVEfixes Vulnerability Detection LoRA"
slug: "codelama-code-security-lora"
date: 2026-03-05
type: grep
category: code-security
tags: [codellama, vulnerability-detection, cve, lora, qlora, secure-code]
excerpt: "Uploaded to Hugging Face by Younis2003 — CodeLlama 13B LoRA fine-tuned on CVEfixes for vulnerability detection and secure code analysis."
author: Younis2003
hfModelId: Younis2003/CodeLlama_for_code_security
hfUrl: https://huggingface.co/Younis2003/CodeLlama_for_code_security
source: Hugging Face
downloads: 3
likes: 1
pipelineTag: text-generation
baseModel: meta-llama/CodeLlama-13b-hf
draft: false
---

## What Is This?

Uploaded to Hugging Face by **Younis2003**. **CodeLlama_for_code_security** is a PEFT LoRA/QLoRA adapter on **CodeLlama-13b-hf**, trained on a custom **secure_dataset_cvefixes** corpus for vulnerability detection and secure coding assistance.

## Metadata

| Field | Value |
|-------|-------|
| Author | Younis2003 |
| Base | meta-llama/CodeLlama-13b-hf |
| Training data | Younis2003/secure_dataset_cvefixes |
| Adapter | LoRA / QLoRA |
| Format | safetensors |
| License | Apache 2.0 |

## Why It Might Matter

Academic and indie **code vulnerability models** remain underrepresented vs. chat cyber-LLMs. This upload is useful for:

- Benchmarking LoRA efficiency on security tasks (13B base + small adapter)
- Comparing CVEfixes-trained models against general coders on CWE classification
- Building hybrid pipelines: fast classifier + slow reasoning model

## Evaluation Targets

- OWASP Benchmark Java/C# snippets
- CVEfixes held-out test split
- False positive rate on patched vs. vulnerable function pairs

## Attribution

Open-source model indexed for security research inquiry. Uploaded to Hugging Face by **Younis2003**.
