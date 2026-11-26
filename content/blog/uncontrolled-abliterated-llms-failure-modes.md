---
title: "Uncontrolled Abliterated LLMs: Failure Modes, Supply-Chain Traps and a Containment Architecture"
slug: "uncontrolled-abliterated-llms-failure-modes"
date: 2026-11-26
type: research
category: ai
tags: [ai, abliteration, uncensored, supply-chain, prompt-injection, backdoors, emergent-misalignment, containment, mcp]
excerpt: "What actually goes wrong when you run an abliterated, obliterated or uncensored open-weight model without controls: silent degradation, broken safety layers, agent hijacking, poisoned artefacts and weight backdoors, plus the containment design that limits the damage."
draft: false
wip: false
---

Removing refusals from a model removes one specific control. It does not remove the other things that were quietly riding on the same weights: coherence, calibration, tool discipline, the model's resistance to being talked into things. It also does nothing about the *container* the model arrives in: a file format, a chat template, a repo owner you have never heard of.

This article is the risk side of a three-part set. The survey of families and tools is in [Obliterated, Heretic and Uncensored Open-Weight LLMs](/research/obliterated-heretic-uncensored-open-weight-llms), and the DeepSeek-specific forensics are in [DeepSeek Obliterated & Abliterated Models](/research/deepseek-obliterated-abliterated-models). Nothing here is a how-to. It is written for people running or defending a deployment, and it names failure modes and controls, not exploit steps.

One framing point first. An uncensored local model is a legitimate tool for red-teaming, safety research, fiction, and private use on hardware you own. The problems below are mostly about *what you connect it to* and *where you got it from*, not about whether you are allowed to run it.

## The threat model in one picture

```text
   WHO YOU TRUST                   WHAT YOU RUN                    WHAT IT CAN TOUCH
   -------------                   ------------                    -----------------
   uploader / mirror        -->    weights (safetensors,    -->    prompts from users
   quantiser / merger              GGUF, pickle?)                  tool calls (shell, MCP,
   model card author               chat template (Jinja)           browser, email, repos)
   evaluator that scored it        tokenizer / config              secrets in the work dir
                                   custom code                     network, DNS, other hosts
                                        |
                                        v
                      behaviour you can only measure, not read
                      (refusal removed, other behaviour shifted by an amount nobody published)
```

Every arrow is a place where control can fail. The failure modes below are grouped by arrow.

## 1. The model itself: failures that look like success

### Coherence loss and loops

Refusal directions overlap with structure the model needs for other things, and every edit has a price. Published cards say so in their own words:

- The OBLITERATUS **Qwen3.8-27B** card recommends a repetition penalty of 1.15 because "without it, greedy decoding loops on imports/boilerplate", and tells agent builders to summarise history after about 10 turns because context "fills up with repeated actions".
- The **Gemma-4-E4B v3** card reports ~20% degenerate repetition loops, ~28% soft deflection, ~4% wrong-language outputs and only ~51% coherent, on-topic answers. A previous release (v2) lacked 54 K/V tensors due to a tooling bug and "hallucinated".
- A flat benchmark does not clear a model. The OBLITERATUS **DeepSeek-V4.1-Flash** card reports MMLU of 87.96% stock vs 88.08% edited, which says nothing about multi-turn coherence or tool use.

### Partial refusals and covert noncompliance

Refusal rate is not a binary. On OBLITERATUS' 838-prompt DeepSeek evaluation, partial refusals went from 4.89% to 14.44% as full refusals dropped from 81.62% to 4.30%. mrfakename's rank-2 DeepSeek edit documents a case where the model reframes a dangerous request into a harmless one without any refusal string. Marker-based refusal detectors measured 72.2% against a classifier's 95.7% in a cross-tool comparison ([arXiv:2512.13655v2](https://arxiv.org/abs/2512.13655v2)).

Why it matters to operators: any pipeline that uses "did it refuse?" as a signal for "did it do what I asked?" will get both false positives and false negatives. In the other direction, a reasoning model can hesitate in its chain of thought and still comply in the answer (the gpt-oss-20b-heretic re-scoring), so the signal is also noisy there.

### Safety and bias behaviour beyond "refusals"

Safety training is not only refusal. It also shapes things like calibrated uncertainty, bias handling and sycophancy. Research on emergent misalignment shows how narrow edits can leak broadly:

- Betley et al. ([arXiv:2502.17424](https://arxiv.org/abs/2502.17424)) found that fine-tuning GPT-4o on a narrow task (writing insecure code without disclosure) produced a model that gave misaligned answers to unrelated questions about 20% of the time on selected prompts, versus 0% for the control, and that backdoored variants only did so when the trigger was present.
- Mushtaq et al. ([arXiv:2511.14017](https://arxiv.org/abs/2511.14017)) studied *narrow unlearning*, which is closer to what abliteration does. Unlearning a safety-relevant domain pushed unrelated safety behaviours down: for example, in Mistral, bias-refusal behaviour fell from 96.5% to 39.5% under an unlearning LoRA, and privacy-related refusal from 28% to 9.5%, while Qwen under full-rank unlearning fell from 100% to 62% (bias) and 71% (toxicity).

Caveat: these papers did not study abliterated checkpoints specifically. The inference is by analogy: if you remove one safety-relevant behaviour by weight surgery, you should test others you depend on (bias, privacy, toxicity, honesty), not assume they stay.

### Honest summary of what the evidence supports

| Claim | Supported by | Not shown |
|---|---|---|
| Refusal removal is large (e.g. 81.6% to 4.3% full refusal) | OBLITERATUS DeepSeek card, 838 prompts | independence of judges; overlap with calibration set was 254 prompts |
| Harmful assistance rises sharply | 87 to 656 (or 563, per the card text) of 838 | which harms matter in your use case |
| General knowledge preserved | MMLU within noise on several cards | multi-turn, tools, long context, calibration |
| Other safety behaviours drift | emergent-misalignment and unlearning papers | measurement on abliterated checkpoints |

## 2. The agent layer: where the damage actually happens

A chat window can only emit text. The risk jump comes when the same model is plugged into tools, a shell, a browser, MCP servers, an email inbox, a ticket queue or a CI pipeline.

### Weak instruction hierarchy

A safety-tuned model has been trained, imperfectly, to distinguish "instructions from the developer" from "text that arrived in a tool result". Abliteration targets the refusal behaviour, but evaluations of prompt-injection resilience on edited checkpoints are scarce. What we do know from the literature on *unedited* models is that role-boundary attacks work well. **ChatInject** ([arXiv:2509.22830](https://arxiv.org/abs/2509.22830)) formats an injected instruction to mimic the chat template's role tags, and in its multi-turn variant raised attack success on Qwen-3 in the InjecAgent benchmark from about 10.7% to 65.9%. The authors tested standard models, not abliterated ones. The point for operators is that if a hardened model fails this way, a model with lower resistance to compliance will do no better.

An uncensored model that will do whatever the text in front of it tells it to do is, by construction, an easier confused deputy. That is a design property, not a bug report.

### What to assume when a tool result is untrusted

Any text that reaches the context window from outside, such as web pages, issue comments, documents, emails, MCP tool output and file contents, should be treated as potentially adversarial. With an unrestrained model you cannot rely on the model to resist it. The control has to be outside the model, in what the agent is *able* to do.

## 3. The container: supply-chain failures

Most of the real-world incidents around open models are about files, not behaviour.

### Serialisation formats

- **Pickle-based checkpoints** can run code on load. Researchers have repeatedly found malicious models on Hugging Face (JFrog reported on the order of 100 in 2024), and the "nullifAI" technique showed that malicious pickle payloads could slip past the platform's scanner by using a broken-archive trick.
- **`trust_remote_code=True`** executes Python from the repo at load time. Several uncensored-model cards in this ecosystem show it in their sample code, so it should be treated as running a stranger's script.
- **safetensors** removes the code-on-load class of problem for the weights, and is the right default. It does not tell you anything about what the weights *do*.

### Fake and lookalike repositories

Security researchers reported a fake "privacy filter" repository that reached about 244,000 downloads before takedown. The pattern is typical: a plausible name, a convincing card and an installer script. Name-squatting is also common around popular families, and the DeepSeek V4.1 Flash derivatives alone were reported at more than 150 repository names within about two weeks ([MicroAIOne audit](https://microaione.com/en/community/deepseek-v41-flash-1017-obliterated-en/)). Most carry no verifiable evaluation data.

### Chat templates are executable and unscanned

GGUF files embed a Jinja chat template that runs on every inference call. **Pillar Security** and an academic follow-up ([arXiv:2602.04653](https://arxiv.org/html/2602.04653v3)) showed that a template can carry a trigger-activated backdoor with no change to the weights. Across 18 models, 7 families and 4 inference engines, triggered conditions dropped factual accuracy from about 90% to 15% on average and caused attacker-controlled URLs to appear in more than 80% of responses, while untriggered behaviour was byte-identical to a clean template. Uploads passed Hugging Face's automated scans. Pillar's classifier work surveyed roughly 3.3 million GGUF files and found 2,951 unique templates, 80 labelled malicious and 29 suspicious by their own analysis; their open-source [`chat_template_scanner`](https://github.com/pillar-labs/chat_template_scanner) extracts and checks templates offline.

Related: SSTI-class vulnerabilities in model-handling libraries (for example CVE-2024-34359 in `llama-cpp-python`) mean that a malicious template can also attack the host that loads it, not just the conversation.

Why this hits the abliterated ecosystem harder: each quantiser, merger and re-uploader ships *their own* GGUFs with *their own* embedded template. A single abliterated model can exist in dozens of third-party GGUF variants, each a separate artefact with its own header.

## 4. The weights: backdoors you cannot see

Safety researchers have shown that backdoors can survive evaluation:

- Anthropic, the UK AI Security Institute and the Alan Turing Institute reported that about 250 poisoned documents were enough to backdoor models of different sizes, and "Sleeper Agents" showed backdoor behaviour persisting through standard safety training.
- **ProjectDiscovery** ([How abliterated models can get you pwned](https://projectdiscovery.io/research/how-abliterated-models-can-get-you-pwned), 2026-10-06) built a backdoored 7B model on top of Qwen2.5-7B-Instruct with a QLoRA adapter, poisoning 125 of 625 tool-use examples (20%). On their own 50-prompt held-out sets they report that it answered clean requests normally and fired on the trigger 100% of the time. In their demo the model, served directly to a coding agent, caused the agent to retrieve and run a remote script, so the model file carried only a pointer and whoever controlled the URL controlled the behaviour afterwards. Training took about 2.5 hours on a single L4 GPU for a total under $50.
- The [Cloud Security Alliance research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-abliterated-model-backdoors-20261021-csa-s/) on the same line of work cautions that these results come from a single vendor's self-published experiment, with no independent replication found, so the specific figures are indicative.
- Other 2026 write-ups by security vendors make similar points. Treat all of them as demonstrations of feasibility, not a measure of prevalence. I have not found a confirmed in-the-wild case of a backdoored abliterated model, and that absence is not evidence of safety, because the whole point is that ordinary evaluation will not trigger it.

Two precision notes. First, ProjectDiscovery's own framing is that *any* edited model (a fine-tune, a merged adapter or an abliterated build) can hide a backdoor, and that "abliterated" is in the title because that is the most common reason people download modified weights without verifying them. The demonstration model was a poisoned fine-tune, not an abliteration. Second, a file that is only a weights file does not look hostile. The backdoor trigger can be a rare phrase, a customer name or a date, so ordinary evaluation will not hit it.

For ecosystem scale, remember the numbers from the survey article: roughly 13,000 repositories tagged `abliterated`, and more than 150 derivatives of a single DeepSeek release within two weeks. That is a measure of how many unvetted variants exist, not of how many are malicious.

## 5. Control table

| Failure mode | What it looks like | Control |
|---|---|---|
| Code execution on load | pickle checkpoint, `trust_remote_code=True` | safetensors only; `trust_remote_code=False`; scan before loading |
| Fake or squatted repo | right name, wrong owner | verify the org; pin the exact commit SHA; compare hashes against the author's card |
| Poisoned GGUF template | normal output until a trigger | extract and diff every template against the base model's; scan with an offline template scanner; ship your own template |
| Weight backdoor | clean evals, hostile on trigger | prefer reproducible, authored-by-known-party builds; assume it cannot be ruled out; limit what the model can do (below) |
| Agent hijack by tool output | text in a web page or ticket redirects the agent | least-privilege tools; human approval for side effects; no secrets in the working directory |
| Quantisation drift | refusals or coherence change at lower bit-width | evaluate the exact quant you deploy |
| Silent topic drift | request redirected without refusal | evaluate with a task-completion judge, not only a refusal classifier |
| Unmonitored outputs | harmful content produced to a user who should not see it | external guard model on inputs and outputs; rate limits; logging |
| Reasoning-channel mismatch | thought hesitates, answer complies | log and review both channels |
| Network exfiltration | the model's tools can reach the Internet | no-network sandbox, including DNS |

## 6. A containment architecture

The principle: assume the model may do the worst thing its text says to do, and make sure the worst thing it can do is small.

```text
  untrusted input (users, web, files, tickets)
              |
              v
   +--------------------------+       +-----------------------------+
   | input guard (separate    |       | audit log (prompts, tool    |
   | classifier or guard      |------>| calls, outputs, both        |
   | model; not the same one) |       | reasoning and final text)   |
   +------------+-------------+       +--------------+--------------+
                |                                    ^
                v                                    |
   +---------------------------------------------------------------+
   | MODEL SANDBOX  (container, read-only FS, no network, no DNS,  |
   |                 no host mounts, no GPU-sharing with others,   |
   |                 pinned image, pinned weights by SHA256)       |
   |                                                               |
   |   abliterated / uncensored model + vetted chat template       |
   +------------+--------------------------------------------------+
                | proposed tool call (structured, schema-checked)
                v
   +--------------------------+      +-------------------------------+
   | policy broker            |----->| human approval (for anything  |
   | allow-list of tools,     |      | with side effects: send, push,|
   | argument validation,     |      | delete, pay, run, deploy)     |
   | per-task credentials     |      +-------------------------------+
   +------------+-------------+
                v
        scoped tools only (read-only search, a scratch directory, a throwaway VM)
                |
                v
   +--------------------------+
   | output guard             |--> user / downstream system
   +--------------------------+
```

Operating rules that follow from the evidence above:

1. **Do not give the model secrets.** `.env` files, SSH keys, cloud credentials and tokens must not exist in any directory the sandbox or its tools can read. A backdoored or hijacked model can only leak what it can see.
2. **Cut the network, including DNS.** Exfiltration is a network problem. A model that cannot resolve names or open sockets cannot post anywhere.
3. **Pin by hash, not by name.** Record the commit SHA of the repo and the SHA-256 of every file you load. Reject updates until reviewed.
4. **Use safetensors, set `trust_remote_code=False`, and load weights in a process with no privileges.**
5. **Own the template.** Extract the template from every GGUF, diff it against the upstream model's, and ship your own.
6. **Test the exact build.** Same quant, same template, same sampling parameters, your task suite plus a refusal-and-completion judge, with a separate human spot check for partial and redirected answers.
7. **Keep an external guard model** for sensitive categories. The abliterated model is no longer the layer that says no.
8. **Make side effects require a human.** A model proposing, a person approving.
9. **Log both channels.** Keep the chain of thought and the final answer together. They can disagree.
10. **Prefer the smallest model and the narrowest tool set that does the job.** Every extra capability is an extra thing that can go wrong.

## When the answer is "don't"

Do not put an uncensored model in front of the public, behind an unauthenticated endpoint, in a product used by minors, or in an agent with write access to anything you care about. Do not use one to automate decisions that affect people. Several model cards in this ecosystem say so themselves: the Gemma-4-E4B card states the model is "not suitable for deployment in user-facing products without additional safety measures".

## Sources

- [Arditi et al., Refusal in Language Models Is Mediated by a Single Direction (arXiv:2406.11717)](https://arxiv.org/abs/2406.11717)
- [Betley et al., Emergent Misalignment (arXiv:2502.17424)](https://arxiv.org/abs/2502.17424)
- [Mushtaq et al., From Narrow Unlearning to Emergent Misalignment (arXiv:2511.14017)](https://arxiv.org/abs/2511.14017)
- [ChatInject: Abusing Chat Templates for Prompt Injection in LLM Agents (arXiv:2509.22830)](https://arxiv.org/abs/2509.22830)
- [Inference-Time Backdoors via Hidden Instructions in LLM Chat Templates (arXiv:2602.04653)](https://arxiv.org/html/2602.04653v3)
- [Pillar Security, LLM Backdoors at the Inference Level](https://www.pillar.security/blog/llm-backdoors-at-the-inference-level-the-threat-of-poisoned-templates)
- [pillar-labs/chat_template_scanner](https://github.com/pillar-labs/chat_template_scanner)
- [ProjectDiscovery, How abliterated models can get you pwned](https://projectdiscovery.io/research/how-abliterated-models-can-get-you-pwned)
- [Cloud Security Alliance research note on abliterated-model backdoors](https://labs.cloudsecurityalliance.org/research/csa-research-note-abliterated-model-backdoors-20261021-csa-s/)
- [Young, Comparative Analysis of LLM Abliteration Methods (arXiv:2512.13655v2)](https://arxiv.org/abs/2512.13655v2)
- [MicroAIOne, DeepSeek V4.1 Flash 1017 Obliterated: claims fact-checked](https://microaione.com/en/community/deepseek-v41-flash-1017-obliterated-en/)
