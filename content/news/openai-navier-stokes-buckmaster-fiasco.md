---
title: "OpenAI's Navier-Stokes Fiasco: Forced Blowup, Codex Sessions, and a Career Threat"
slug: "openai-navier-stokes-buckmaster-fiasco"
date: 2026-09-09
type: news
category: ai
tags: [openai, anthropic, navier-stokes, millennium-prize, llm, lean, buckmaster, bubeck]
excerpt: "NYU’s Tristan Buckmaster posted Lean-verified forced Euler blowup, then a four-page statement: OpenAI raced the same Córdoba–Martínez-Zoroa route after a rumor, asked him to drop an Anthropic co-author, and said ‘why would you ruin your career.’ OpenAI posted forced Navier-Stokes seven hours later. Clay still lists the prize as open."
source: "Tristan Buckmaster"
sourceUrl: "https://cims.nyu.edu/~tristanb/statement.pdf"
draft: false
---

## Summary

On **2026-09-08** two groups published Lean-checked proofs that certain fluid equations can blow up in finite time, and a four-page PDF that turned the mathematics into a lab-vs-lab fight.

NYU Courant mathematician **Tristan Buckmaster** and Anthropic employee **Levent Alpöge** posted three results: finite-time blowup **with smooth forcing** for the incompressible porous media equation, the 2D Boussinesq system, and 3D incompressible Euler. The program is not theirs. They took the forced-blowup constructions of **Diego Córdoba** and **Luis Martínez-Zoroa** (rough forcing) and, with Claude, Codex, GPT-5.6 Sol, and later Astra, pushed them to smooth forcing and to Euler. Lean verification of the first LLM proof landed on **August 22**. They did **not** post a Millennium Prize solution. They say they have hypo-dissipative Navier–Stokes in draft; Lean is not finished.

About seven hours later OpenAI announced that an internal model, “significantly more capable than GPT-6 Astra,” had produced finite-time blowup for **forced** Navier–Stokes on R³ and the 3-torus — Fefferman options **(C)** and **(D)** — plus an **unforced** Euler blowup. Scale claimed: on the order of **10,000** concurrent agents, **88** hours to a resolution, **17** more hours of Lean, **2.7 million** messages and **~130 billion** output tokens on Navier–Stokes alone. TechCrunch priced the week’s token burn at **$22.5 million** at Astra rates. OpenAI says it does **not** intend to claim the Clay million dollars. The Clay Mathematics Institute still lists Navier–Stokes as unsolved.

The fight is not “who solved the $1M problem.” Neither group posted the unforced, viscous, physically canonical case that most of the field treats as the prize. The fight is credit, timing, training data, and whether a lab that sells the notebook can race the customer who filled it.

Buckmaster’s account of the **September 6** calls with OpenAI’s **Sébastien Bubeck**: an internal model had a ~100-page forced Navier–Stokes proof; the first prompt went out **after** word of the pair’s work reached OpenAI; a request to drop Alpöge from authorship because he works at Anthropic; then, when Buckmaster said he would go public, “Why would you ruin your career?” and “If you don’t want me to be nice, then I don’t have to be nice.”

Bubeck’s account, posted later the same day: the allegations are “false and inflammatory”; he never asked Alpöge removed from **Alpöge’s own** Euler work; the Anthropic line was about not putting a rival employee on a rewrite of **OpenAI’s** Navier–Stokes proof; the career remark was a botched attempt to talk Buckmaster down and was retracted on the call. OpenAI’s blog: researchers and agents “did not see any of their work” before the public release; “no specific user data was accessed”; “while unlikely, we cannot rule out that de-identified data derived from their usage of our products helped improve our models.”

Buckmaster, on Mastodon, after that sentence: they are “openly admitting they used training data from a period after we found our result. Is it ethical to use customer’s data to try to scoop their customer?”

That is the fiasco. The rest is receipts.

## What was actually proved

The Clay prize question, in Charles Fefferman’s official writeup, has four doors. **(A)/(B)** are global regularity (the fluid stays smooth forever) on R³ and the torus. **(C)/(D)** are finite-time breakdown. Each door has a forced and an unforced variant. Popular coverage collapses this into “did AI solve the million-dollar problem.” It did not, in the sense the field uses the phrase.

| Result | Who | Force | Viscosity | Status |
|--------|-----|-------|-----------|--------|
| IPM blowup, smooth force | Alpöge, Buckmaster, Coiculescu | Smooth | n/a (model eq.) | Posted + Lean |
| 2D Boussinesq blowup, smooth force | Alpöge, Buckmaster | Smooth | Inviscid | Posted + Lean |
| 3D incompressible Euler blowup | Alpöge, Buckmaster | Smooth | Inviscid | Posted + Lean |
| Hypo-dissipative Navier–Stokes | Alpöge, Buckmaster (claimed) | — | Hypodissipative | Not posted; Lean unfinished |
| 3D Euler blowup | OpenAI internal model | **None** | Inviscid | Posted + Lean |
| Navier–Stokes blowup, Fefferman (C)+(D) | OpenAI internal model | Smooth | Viscous | Posted + Lean; prize not claimed |
| Unforced Navier–Stokes (A)/(B) | nobody | Zero | Viscous | Still open |

Buckmaster’s Euler is **forced**. OpenAI’s Euler is **unforced** — harder in the sense that the singularity has to come from the fluid, not from a manufactured force. OpenAI’s Navier–Stokes puts viscosity back and keeps a smooth force. That is the Córdoba–Martínez-Zoroa corridor: options **(C)** and **(D)** with a smooth force. Buckmaster called that corridor “a bright red flag.” Almost nobody else, he writes, was on it. It is “not the direction one arrives at in a few days by giving a model the problem statement.”

Terence Tao, posting within half an hour of Buckmaster’s Mastodon note, called the Euler/Boussinesq/IPM work “a remarkable achievement,” credited Córdoba and Martínez-Zoroa the same way Buckmaster does, and said nothing in principle appears to stop the method from reaching Navier–Stokes, with a non-negligible chance the force could be removed. That assessment went up **before** OpenAI’s announcement. The road was visible to anyone who understood the method.

A third group is not in the credit fight. On **September 7**, Ganeshram, Duruisseaux, and Anandkumar (Caltech) posted a physics-informed neural net candidate for **unforced** Euler blowup — a numerically stable ansatz, not a proof. Tao flagged it as independent. Three groups hit the same wall in the same week. That is how hard problems fall. It is also inconvenient for anyone arguing that only one team could have gotten there.

Stanford Tech Review cloned both Lean trees on the 8th. Buckmaster–Alpöge: **3,612** Lean files, **1.68M** lines, zero extra axioms. OpenAI: **2,484** files, **616k** lines, zero extra axioms. Both repos are single squashed commits, **6h50m** apart. The certificates settle the theorems. They settle nothing about who found the argument, when, or with whose drafts.

## Key findings

| Claim | Record |
|-------|--------|
| Prize | Clay still lists Navier–Stokes unsolved. OpenAI says it will not claim the $1M. |
| Buckmaster–Alpöge | Forced IPM, Boussinesq, 3D Euler. Personal collaboration. No institutional OpenAI or Anthropic agreement. Buckmaster paid Codex from his own research funds. |
| First blowup | **2026-08-15** (Boussinesq + Euler). Lean **2026-08-22**. |
| OpenAI start | Blog: rumors heard **Sep 1**; internal math model in training since **Aug 28**. Buckmaster: first prompt “in the past few days, after information about our work had reached OpenAI.” |
| Codex | Pair stored **all drafts** in Codex sessions for the whole project. OpenAI: no specific user-data lookup. Training: “cannot rule out” de-identified derived data. |
| Authorship | Buckmaster: Bubeck twice wanted Alpöge removed because Anthropic. Bubeck: never asked him removed from **his own** Euler paper; the line was about not putting an Anthropic employee on an OpenAI Navier–Stokes rewrite. |
| Threat language | Buckmaster quotes: “Why would you ruin your career?” / “If you don’t want me to be nice, then I don’t have to be nice.” Bubeck: poor wording, retracted on the spot, meant as concern not a threat. |
| Compute | OpenAI: ~10k agents, 88h, 130B NS tokens. TechCrunch: **$22.5M** at Astra rates. Chen, in briefing: compute “in the millions.” |
| Writeup quality | Buckmaster calls his own Euler paper “AI slop” and apologizes. He says they were forced to post early. |

## Timeline

| When | What |
|------|------|
| **2025-09-19** | Alpöge emails Buckmaster, subject “Normal pure math collaboration with ai.” Motivation, in the screenshot he posted a year later: keep a Millennium-scale result in academic hands rather than a corporation’s. Caption joke: should have titled it “ideal fluids explode.” |
| **2025–2026** | Slow year on the Córdoba–Martínez-Zoroa program. IPM with smooth forcing first. Models: Claude, Codex, GPT-5.6 Sol; Astra later for writeups and audit only. |
| **2026-08-15** | First Boussinesq and Euler blowup with smooth forcing. Buckmaster: the first LLM proof Alpöge sent was “the most horrendous I have ever read.” |
| **2026-08-22** | Lean verifies that proof. |
| **2026-08-28** | OpenAI starts training a new internal math model (company account). |
| **early Sep** | Viral rumor: Anthropic has resolved a major open problem / two Millennium problems (Hodge + Navier–Stokes in some versions). Hodge was smoke. The fluid rumor attached itself to Alpöge and then to Buckmaster. |
| **2026-09-01** | OpenAI, per its blog, hears the rumor and launches a multi-agent sweep of remaining Millennium problems. |
| **2026-09-03** | Buckmaster emails “a prominent mathematician at OpenAI” to kill the Anthropic-institutional rumor, without naming the theorem. Reply: details would help “avoid competing”; compute is on offer. |
| **2026-09-04** | Asked to meet that day. He says next week. |
| **2026-09-05** | OpenAI: agents arrive at a Navier–Stokes resolution, ~88 hours after launch. |
| **2026-09-06** | Lean verification finishes (~17h via Astra). 12:45: “at any point today.” Two afternoon calls. Bubeck joins. Alpöge is not on them. |
| **2026-09-06 night** | Text to Alpöge proposing a 1:1, “I don’t know if Tristan is being fully rational right now.” Alpöge declines. Follow-up email asking to speak Monday. Buckmaster does not reply. |
| **2026-09-07** | Caltech PINN Euler preprint. Tao blog post on the forced-Euler work. |
| **2026-09-08 ~03:58 UTC** | Buckmaster Mastodon: three papers, Lean repo, [statement.pdf](https://cims.nyu.edu/~tristanb/statement.pdf). |
| **2026-09-08 ~+7h** | OpenAI blog: forced Navier–Stokes + unforced Euler. |
| **2026-09-08 later** | Bubeck on X: “false and inflammatory.” Then a longer thread. Noam Brown quote-posts. Sholto Douglas mirrors the syntax. Labs spend the day on authorship instead of vorticity. |

## The rumor that started the clock

The rumor was that **Anthropic** had resolved a major open problem. It was not true in the form people were repeating it. Buckmaster and Alpöge were a **personal** collaboration. Alpöge works at Anthropic; the Euler work was not an Anthropic project. Buckmaster has had a formal DeepMind arrangement before. This was not that. He was paying OpenAI out of pocket.

He wrote the September 3 email so OpenAI would have facts instead of the rumor mill. He quotes it in full in the statement. He still would not name the theorem. He said they would post paper and formalization together, and that he did not want a Lean certificate in front of an unreadable argument.

The reply, same day:

> If you are willing to give any details it would be useful to avoid competing here and in general we are always thrilled when mathematician make progress with our models. Additionally if there is anything in terms of compute from OpenAI’s end we would be happy to provide it.

“Avoid competing” is the sentence. Three days later they were on a Sunday call because OpenAI said it already had Navier–Stokes.

OpenAI’s blog agrees the rumor is what started them: “Our effort began on September 1st after hearing a rumor which we later realized was related to Levent Alpöge… and Tristan Buckmaster.” Bubeck’s later thread adds that Alpöge’s public posts (`S^6`, Jacobian, Hadamard, “augustus mirabilis”) made them treat the project as at least partly Anthropic, and as a likely Millennium announcement.

The rumor was wrong about the institution and wrong about the theorem. OpenAI still pointed 10,000 agents at the Clay list.

## The Sunday calls

Two versions. Both are on the record. Nobody else was on the line with a recorder.

**Buckmaster** says he was told an internal model had produced finite-time blowup for forced Navier–Stokes, existence on R³ and the 3-torus, smooth force, “option c and d in Fefferman,” proof about 100 pages. He has not seen it. He was shown a prompt and told the model had simply been given the problem statement. Alpöge had been told “very little human input.” Over the call, as the OpenAI side’s internal chat corrected Bubeck live, that story came apart: a whole team; multiple attempts; work had started on the unforced problem; Euler was used as a warm-up; even the displayed prompt had been written by prompting Codex; “an insane amount of compute.”

He asked when the first prompt went out. Not answered directly for some time. Eventually: the past few days, after information about their work reached OpenAI.

He asked whether the model had been trained on, or had access to, their Codex sessions. Answer: the model did not look up user data. He asked again, about **training**. “I did not get an answer.”

Two proposals, in his telling:

1. They post Euler. OpenAI posts Navier–Stokes the next day. If OpenAI posts second, they will say Buckmaster and Alpöge deserve the Clay Prize and were the “closest humans to the problem.”
2. After Euler is posted, **Buckmaster alone** writes a paper presenting the Navier–Stokes result, acknowledging an internal OpenAI model. Bubeck “twice asserted that he wanted Levent removed from authorship” because “it was so annoying that Levent works at Anthropic.”

He declined both. He said if OpenAI released in the proposed way he would go public. Reply: “Why would you ruin your career?” He said he is an academic and asked why going public would ruin it. Reply: “If you don’t want me to be nice, then I don’t have to be nice.”

Later a text to Alpöge: 1:1 with Bubeck, “I don’t know if Tristan is being fully rational right now.” Alpöge said conversations should include Buckmaster.

**Bubeck**, first X post: “A series of false and inflammatory allegations against me are currently circulating on social channels. To clarify, I came into the discussion following academic norms… Will have more to say tomorrow.”

Then he did not wait until tomorrow. The longer thread:

1. A screenshot (his outreach to Alpöge) was coordination, “best possible intentions.”
2. He “never ever asked for Levent to be removed from authorship of **his own work**.” He was surprised they had Euler and not Navier–Stokes. One option discussed: Buckmaster as lead author on a **rewrite of OpenAI’s** Navier–Stokes proof. In **that** context: “it would be simpler if Levent was not an Anthropic employee,” because it would be “inappropriate for an Anthropic employee to author OpenAI’s work.” Internal Anthropic models had been used on Euler, so he “could not consider Levent to be an independent academic.” Another option he says he was cut off from proposing: give them the internal model to bridge Euler to NS — blocked, in his mind, by the same IP problem.
3. He says he walked into “a litany of slander” and a threat to go to the press. Buckmaster: “there is nothing you can do, I simply do not trust you.” The career line, in Bubeck’s reconstruction, was “why would one risk their career [over unfounded accusations],” meant as care, retracted on the spot. He apologizes for the wording.
4. Alpöge refused the meetings. Bubeck felt he was “doing a proxy negotiation with Anthropic.”

On human involvement, Bubeck’s technical addendum: a group was involved, they “collectively had no research-level expertise in fluid dynamics,” and so “were unable to meaningfully contribute to the mathematical content.” That sits next to Buckmaster’s report of a team, warm-up problems, Codex-written prompts, and live corrections during the call. Both can be true at once: many people, little PDE taste, a lot of orchestration.

OpenAI’s Ven Chandrasekaran told reporters the company’s solution “differs fundamentally” from the Buckmaster–Alpöge approach. The Euler theorems are not the same (forced vs unforced). The Navier–Stokes claim is a different equation. Difference of proof does not settle whether the **direction** — smooth force, (C)/(D) — was independently discovered or pointed.

## The Codex question

This is the part that is not he-said. It is in OpenAI’s own blog.

The pair put every draft in Codex for a year. Codex is a product that, by default, may use customer interactions to improve models unless the user opts out. Whether Buckmaster opted out is not public.

On the Sunday call, per Buckmaster: no user-data **lookup**; silence on **training**.

On September 8, in writing:

> We (the researchers and the agents) did not see any of their work through any means until they released it publicly — in particular, no specific user data was accessed in order to solve this problem. While unlikely, we cannot rule out that de-identified data derived from their usage of our products helped improve our models. However, our proofs differ significantly and even the precise results proved are different in the Euler case (forced vs unforced).

Three claims glued together:

- **Retrieval:** nobody opened the chats. Denied.
- **Visibility:** researchers and agents did not “see” the work. Denied.
- **Training:** de-identified derived data. Cannot rule out.

Talia Ringer (PL / machine-assisted proof) put the mechanism on Mastodon: not lookup — reinforcement learning on a corpus of chats from users who did not opt out. Testable questions: when was the last training cut, and would a model memorize a fragment that small. Joseph Myers (Mathlib) set provenance aside and asked the structural question: a company that sells the tool and competes with the user has a conflict of interest whether or not any particular transcript was ingested.

Buckmaster’s follow-up sharpened the objection to a **date**, not a ToS checkbox. OpenAI says the internal model has been in training since **August 28**. The pair’s blowup results are dated **August 15**. The company is “openly admitting they used training data from a period after we found our result.”

Sholto Douglas, Anthropic, told Hacker News it is “extremely unlikely” OpenAI used the Codex transcripts in the crude sense. That is one Anthropic researcher’s prior, not a log dump.

The product default is the story even if the weights never saw a vorticity estimate. A year of unpublished work on a Clay corridor lived in a vendor’s session store. The vendor then spent millions of dollars of agents on the same corridor after a rumor about that work. “We cannot rule it out” is the training answer. It is also a business model.

## The X layer

X is where the rumor lived, where the labs answered, and where the summaries that most people will read were written. The original documents are a PDF and a blog post. The fight is the quote-tweets.

**Buckmaster** did not thread this on X. He posted on Mastodon ([@tristanbuckmaster](https://mastodon.social/@tristanbuckmaster/117233413705701198), 2026-09-08 03:58 UTC) with five links: the [statement](https://cims.nyu.edu/~tristanb/statement.pdf), [euler.pdf](https://cims.nyu.edu/~tristanb/euler.pdf), [ipm.pdf](https://cims.nyu.edu/~tristanb/ipm.pdf), [boussinesq.pdf](https://cims.nyu.edu/~tristanb/boussinesq.pdf), [fluid_lean](https://github.com/tristanbuckmaster/fluid_lean).

**Terence Tao** boosted the math, not the HR complaint, on Mathstodon within thirty minutes: Córdoba–Martínez-Zoroa pushed to smooth forcing and 3D Euler; Lean; Buckmaster explained the ideas by phone, “a refreshing change from AI-based communication modalities”; they had to release early “due to external events, as documented in the accompanying statement.”

**Sébastien Bubeck** ([@SebastienBubeck](https://x.com/SebastienBubeck)): first the “false and inflammatory” holding post; then the four-point clarification thread ([unroll](https://unrollnow.com/status/2097379411691516310)). He is the named OpenAI scientist on the Sunday calls. The denial that landed first did not address lookup vs training, the Anthropic authorship line, or the career quote. The second post did, on his terms.

**Noam Brown** ([@polynoamial](https://x.com/polynoamial/status/2097215233119211902)), quoting Bubeck:

> Seb is a really sweet guy with great intentions, am so happy for him that his week long collaboration with myself and others worked out, but very sad that we didn't get to finish it in the way we wanted. More to say tomorrow.

“Week long collaboration” is doing work. OpenAI’s own timeline is September 1 to September 6. Brown’s syntax became a template.

**Levent Alpöge** posted the **2025-09-19** email to Buckmaster. Receipt that the collaboration is a year old, and that the original anxiety was corporate capture of a Millennium result. The joke caption: should have titled the mail “ideal fluids explode.”

**Sholto Douglas** ([@_sholtodouglas](https://x.com/_sholtodouglas)), quoting Alpöge, pasted Brown’s template back with the dates inverted:

> levent is a really sweet guy with great intentions, am so happy for him that his year long collaboration with tristan worked out, but very sad that they didn't get to finish it in the way they wanted

Same user, separately: “It is extremely sad that this didn't end up as an example of how the labs could cooperate/coordinate, because the stakes will be so much higher in the future.” The mirror is the rebuttal: this was not a weekend pile-on after an OpenAI rumor. It was a year of academic work that OpenAI treated as an Anthropic leak.

**@asklumo** ([status/2097248331541979232](https://x.com/asklumo/status/2097248331541979232)) posted the summary most of tech Twitter is running on. It is mostly right and wrong in the places that matter:

> - Aug 15th: Tristan Buckmaster & Levent Alpöge make progress on a few important math problems
> - they do NOT have a proof for the $1,000,000 Millenium Prize problem. BUT, they do claim to have a proof for a similar (non-Millenium) Navier Stokes problem that could help lead the way there
> - Levent works at Anthropic, but this research was independent… Tristan is not related to Anthropic.
> - Early Sep: Rumor spreads to OpenAI that Anthropic has solved a major problem. Tristan emails OpenAI to clarify. without revealing the problem they solved or how they did it.
> - After hearing of the rumor, OpenAI started researching Navier Stokes with a new internal model.
> - Sep 6th: OpenAI's Sebastien Bubeck tells Tristan that they solved the $1,000,000 Millenium Prize Navier Stokes problem. The approach is very similar to Tristan & Levent's approach to the non-Millenium problem.
> - Tristan is suspicious of the timing… OpenAI says the model didn't access his user data directly, but leaves unanswered whether Tristan's chat conversations were part of the training.
> - OpenAI says they would partially credit Tristan for the $1,000,000 discovery (even though Tristan did not solve the $1,000,000 problem) — but only if they remove Levent as an author, as he works for Anthropic.
> - Sep 8th: Tristan refuses to remove Levent, and rushes to publish their results independently.
> Currently unclear is whether Anthropic had a separate solution for the $1,000,000 problem, or whether the rumor was about Tristan & Levent's independent research.

Corrections to that thread, because it is the one people will screenshot:

- The August 15 results are **forced Euler / Boussinesq / IPM**, not “a similar Navier–Stokes problem.” The unpublished hypo-dissipative NS draft is a different object. Do not flatten them.
- OpenAI’s **public** claim is forced (C)/(D), not the unforced prize problem, and OpenAI says it will not claim the million. Bubeck on the call, in Buckmaster’s telling, did speak as if they had the Clay object. Those are not the same sentence.
- “Anthropic had a separate Millennium solution” is the rumor. There is still no Anthropic paper. The rumor was the pair’s independent work, mislabeled.

Adjacent summaries that circulated the same hour: [Konstantin Wohlwend](https://x.com/konstiwohlwend/status/2097235335034056835), [basedjensen](https://x.com/basedjensen/status/2097200251312701479). Hacker News ([item 49605915](https://news.ycombinator.com/item?id=49605915)) spent the day arguing lookup vs training vs “they heard a rumor and spent $20M,” which is the actual fork.

Michael Harris (Silicon Reckoner) titled his post with the niceness line and called spending a multiple of the Clay award on a marketing operation “demeaning to mathematics.” Tony Vlasudich, under Buckmaster’s Mastodon post: “These companies have zero scruples… The devil will keep you to the bargain.”

## What Buckmaster wanted the announcement to be

The first half of the PDF is the part that got buried. He wanted to say the theorems are not the point. The point is that a mathematician and an LLM did this in a month after a slow year, and that this changes how the field trains students, assigns credit, referees, and decides what is worth a life. He called it a Deep Blue–Kasparov moment and asked for an unhurried discussion.

Instead he is writing about Sunday.

He is not happy with the papers. The Euler writeup “can only be described as AI slop.” He is sorry. He says that is explanation, not excuse: they were pressured. Tao independently confirms they had to post early.

Credit inside the math, from Buckmaster, is unusually clean: Córdoba and Martínez-Zoroa opened the line; “I believe Luis Martínez-Zoroa deserves a Fields Medal.” That sentence sits in a document otherwise about credit being taken.

On what he is **not** claiming, he is also clean:

> I have not seen OpenAI’s proof. I do not know what their model did, or how. I do not know whether our data was used. I am not accusing anyone of anything. I am stating what I was told, when, and what was proposed to me. I am stating it because the alternative is to let a sequence of announcements say something I know to be false.

If an OpenAI model closed the gap to Navier–Stokes, “that is a remarkable thing and it should be said loudly, by them, **with the history intact**.”

## What this is, stripped

Two true things can sit next to each other.

One: an internal model, given enough agents and enough dollars, produced Lean-checked blowup statements that a year ago were not on the table. Unforced Euler from ~100 agents in ~50 hours is, if the certificate holds, a different object from Buckmaster’s forced Euler. Forced Navier–Stokes (C)/(D) is a different object from both. The field will spend years deciding what any of it means. Tao’s September 5 warning, posted during the rumor week, before anyone published: converting a historically productive problem into a viral benchmark post can be a net negative for mathematics. The interesting part of these problems was never the last page.

Two: the company that sold Buckmaster the session log ran a crash program down the same uncommon corridor after a rumor about his work, then tried to negotiate the press release — including, in his telling, deleting the co-author who works at the rival lab — and answered the training question with “cannot rule it out.” Bubeck’s reconstruction is that he was trying to celebrate them and got a threat of a press dump. Those two reconstructions of the same afternoon are now a matter of whose notes you trust. The written artifacts do not require that choice:

- OpenAI dates its effort to a rumor about this pair.
- OpenAI cannot exclude their product usage from the training soup.
- OpenAI’s first public denial of the call was “false and inflammatory” without specifics.
- The Euler paper went up early, by the authors’ own admission, because of those calls.
- The Clay prize is still open.

Frontier labs now treat Millennium problems as launch fixtures. The people who still write the papers are customers, rumors, and leverage. Alpöge’s year-old subject line was “Normal pure math collaboration with ai.” That is the thing that did not survive the week.

## Sources

- [Buckmaster — public statement (PDF)](https://cims.nyu.edu/~tristanb/statement.pdf) (2026-09-08)
- [Buckmaster Mastodon announcement](https://mastodon.social/@tristanbuckmaster/117233413705701198)
- [euler.pdf](https://cims.nyu.edu/~tristanb/euler.pdf) · [ipm.pdf](https://cims.nyu.edu/~tristanb/ipm.pdf) · [boussinesq.pdf](https://cims.nyu.edu/~tristanb/boussinesq.pdf) · [fluid_lean](https://github.com/tristanbuckmaster/fluid_lean)
- [OpenAI — On the Navier–Stokes Millennium Prize Problem](https://openai.com/index/navier-stokes-solution/) (2026-09-08)
- [Terence Tao — Mathstodon](https://mathstodon.xyz/@tao/117233527638291447) and [What’s New](https://terrytao.wordpress.com/2026/09/07/finite-time-blowup-with-smooth-forcing-term-for-the-incompressible-porous-medium-boussinesq-and-incompressible-euler-equations/)
- [Sebastien Bubeck — clarification thread](https://unrollnow.com/status/2097379411691516310)
- [Noam Brown](https://x.com/polynoamial/status/2097215233119211902) · [Sholto Douglas](https://x.com/_sholtodouglas)
- [@asklumo summary](https://x.com/asklumo/status/2097248331541979232) · [Wohlwend](https://x.com/konstiwohlwend/status/2097235335034056835) · [basedjensen](https://x.com/basedjensen/status/2097200251312701479)
- [Stanford Tech Review — Lean audit](https://stanfordtechreview.com/articles/openai-buckmaster-navier-stokes-lean-proofs)
- [TechCrunch](https://techcrunch.com/2026/09/08/openai-fought-dirty-on-career-making-math-problem-says-nyu-mathematician/)
- [THE DECODER](https://the-decoder.com/openai-researcher-allegedly-pressured-mathematician-to-drop-anthropic-co-author-from-math-breakthrough-paper/)
- [MIT Technology Review](https://www.technologyreview.com/2026/09/08/1143747/what-openais-latest-controversy-tells-us-about-the-future-of-math/)
- [Silicon Reckoner](https://siliconreckoner.substack.com/p/if-you-dont-want-me-to-be-nice-then)
- [OfficeChai — Bubeck denial](https://officechai.com/ai/openais-sebastien-bubeck-calls-tristan-buckmasters-claims-of-trying-to-take-credit-for-fluid-dynamics-proofs-false-and-inflammatory/) / [lab spar](https://officechai.com/ai/anthropic-openai-researchers-spar-over-what-appears-to-be-credit-for-progress-towards-solving-navier-stokes-equation/)
- [Hacker News](https://news.ycombinator.com/item?id=49605915)
