---
title: "216 Million Spy TVs: Full Record of the LG Smart TV Privacy Investigation"
slug: "lg-216-million-spy-tvs-privacy"
date: 2026-09-09
type: news
category: news
tags: [lg, privacy, smart-tv, acr, webos, surveillance, alphonso, advertising, iot, dmca]
excerpt: "Full indexed record of Gamers Nexus’s Data Dragnet investigation: native LAN scanning, HDMI ACR, offline mic capture, Alphonso ads doctrine, dark patterns, residential proxies, DMCA §1201, and ‘we own the glass.’"
source: "Gamers Nexus"
sourceUrl: "https://www.youtube.com/watch?v=6IFVTcM28KA"
draft: false
---

## Summary

This post is a long-form indexed record of Gamers Nexus’s Data Dragnet investigation **[216,000,000 Spy TVs | The LG Smart TV Problem](https://www.youtube.com/watch?v=6IFVTcM28KA)** (~2h15m). It follows the published narration section by section, quoting frequently so the public claims remain easy to cite without rewatching the full runtime.

Gamers Nexus (Steve Burke), Level1Techs (Wendell), and independent researchers **MrBruh** and **U-Turn** spent a reported **~$70,000** and **500+ staff-hours** buying retail LG sets (including a Best Buy **G5**), capturing traffic with Wireshark, inspecting firmware with help from the jailbreak community, and documenting both **native** advertising/telemetry behavior and **compromise** consequences under responsible disclosure.

Burke’s framing at the open is the thesis of the whole piece:

> “LG TVs are able to be utilized as eavesdropping listening devices in part because of the advertising functionality that's built into them.”

And the sharper distinction that follows:

> “But that requires an adversary, which sounds scary. What we think is scarier is LG itself. LG's first party profit-seeking functionality prized deep into your private life.”

*(ASR almost certainly “pries deep,” not “prized.”)*

OFFSITE.DARK indexes third-party research. Exploit mechanics remain under responsible disclosure; this record quotes what GN made public and does **not** reproduce attack procedures.

## Key Findings (Investigation Claims)

| Claim | As stated in the investigation |
|-------|--------------------------------|
| Scale contradiction | LG ads claim ~**363 million** “addressable secondary devices” in the US vs ~**216 million** smart TVs sold worldwide |
| Household graph | LG: “We know who's in the LG household. We know which devices are there. We know how to extend that reach into mobile.” Secondary devices used in **political targeting** |
| Native LAN crawl | Test TV found **≥38** other devices; staff phones/watches of people uninvolved in the project; HVAC/thermostats; TeamViewer on an editing PC “caught in the blast radius” |
| Wireshark / firmware | IP, geo, nearby Wi-Fi names/signal/channels, unpaired devices, internal IPs — “egregious invasion of privacy” they refuse to show line-by-line on camera |
| ACR volume | ~**4 GB/month** ACR fingerprint data alone (mostly text); ~**6.4 GB/month** estimated total traffic in one pre-agreement hour extrapolated |
| Dumb-monitor myth | HDMI / “dumb display” use still undergoes ACR after agreements; offline ACR capability cited via NYT / Center for Digital Democracy; ISP dual-SSID auto-join risk |
| Dark patterns | **Do Not Sell My Personal Information** disabled by default **before** internet/terms; Select All highlighted when more agreements than needed; opt-out sends **final snapshot** to Alphonso |
| Voice / ambient | Plaintext speech-to-text logs; **10–15s** (sometimes minutes) post-trigger listening; clear audio ~**70 ft** / around corners; RAM-disk logs survive soft off until power pull |
| Mic switch theater | Mechanical switch kills **built-in** mic only — HDMI, Bluetooth, USB webcam, remote mic remain capturable post-compromise |
| Ads doctrine | Serge Matta / LG Ad Solutions: “We own the glass. We own the TV.” Alphonso = LG Ad Solutions; SEC-banned public-company officer runs private ads arm |
| Legal | ~**50,000** words of terms; **2,705** remote clicks to read first layer; forced arbitration added **2026-07-28** after GN’s **2026-07-16** monitor video; factory arbitration stickers |
| Store / UPnP | Spur: ~**43%** (1,213/2,851) webOS apps with residential-proxy capability; partner apps can list/control UPnP LAN devices |
| Researcher advice | Disconnect LG smart TVs from any network; demand ownership / legislation (Fulu / DMCA §1201) |

## Investigation Timeline (As Narrated)

| Date / period | Event |
|---------------|-------|
| 1998 / 2007 context | DMCA §1201 history (Kevin / Fulu); Bruce Lehman / WIPO treaty end-run narrative |
| ~10 years prior | LG prior ACR PR incidents (raw filenames) recalled by Wendell |
| 2019 | SEC charges/settlement: Serge Matta / Comscore (~$50M revenue overstatement); $700k penalty; $2.1M reimbursement; 10-year public-company officer/director bar |
| 2021 | LG controlling stake in Alphonso; Microsoft buys Nuance ($19.7B; closes 2022) |
| 2022 | Alphonso “boardroom coup” / lawsuits vs LG (Ad Exchanger); LG Ad Solutions claimed ACR was “double opt-in” |
| 2023– | Louis Rossmann notes Do Not Sell off-by-default on expensive OLEDs |
| 2024 | Walmart acquires Vizio largely for ads/platform economics (cited as industry parallel) |
| 2026 Q1 | Alphonso ~₩273.7B sales / ~₩32.6B profit (~$185M / ~$22M) per GN’s reading of Korean filings |
| 2026-07-16 | GN first LG monitors / Windows metadata installer investigation |
| 2026-07-28 | LG smart TV terms update: expanded **binding arbitration** language |
| 2026-08-26 | Smart monitor OOB notice: arbitration + AI terms effective in 30 days (pre-accepted) |
| Road trip / Best Buy | Team buys retail G5; “bunker of secrets” work with Wendell; Data Dragnet crowdfunding |
| Video publish | Full ~2h15m investigation; RCE details withheld pending disclosure |

---

## Cold Open: What the TV Can Do

The investigation opens on capability, not speculation.

> “We were able to retrieve plain text transcripts of voice conversations and inputs from the TV. Utilize the TV to record from a webcam and from a microphone while the TV appeared to be off. And it was clean capture, too.”

Dark-screen demo:

> “All right, so the screen appears to be off right now. Currently, Wend and I are in a border. How are you? Yikes.”

*(ASR: “border” → boardroom — same gag as the later rug-pull boardroom demo.)*

Offline persistence and later exfiltration (compromise path):

> “We were even able to capture microphone audio while the TV was unplugged from the network. This LG G5 TV has a microphone connected to it and right now it's listening to me and saving the information. In fact, we can even unplug the network and it's still listening to me and what I'm saying is being stored by someone with remote access to the TV. And then we were able to excfiltrate that recording via vulnerabilities after the user reconnected the network.”

*(ASR: “excfiltrate” → exfiltrate.)*

> “And it's still listening to me. No network.”

### Why the secondary-device number matters

> “The TV crawled our entire network and found dozens of unrelated devices, including smartwatches and phones of our staff who didn't even know we were working on this, which might explain how LG ads can claim it knows about 363 million addressable secondary devices in the US, despite claiming a smaller 216 million smart TVs sold worldwide.”

GN rejects the “innocent Chromecast connected device lookup” framing (transcript ASR: “chcast”) because LG’s own ads language is explicit:

> “We know who's in the LG household. We know which devices are there. We know how to extend that reach into mobile.”

> “…and they use secondary devices in political targeting.”

### What firmware + Wireshark showed (native)

> “LGTVs are capable of identifying your IP address, geographic location, name of every Wi-Fi network in the vicinity and signal strength, channel numbers of neighboring Wi-Fi networks in range and other devices on the network, even if not connected to the TV in any way, and the internal IP address of other devices on the network alongside others.”

On the capture they refuse to broadcast in full:

> “In fact, the data that we collected through Wireshark shown here is such an egregious invasion of privacy that we can't even show you it because every line has something that we don't want to put out there. And this is the TV's native functionality. This didn't require vulnerabilities.”

Security researchers’ operational recommendation (quoted early, repeated at close):

> “…the researchers have recommended disconnecting any LG smart TVs from any network. Ideally, you don't own thousands of dollars of LG TVs. Maybe if they're unplugged or physically destroyed, it's okay.”

Remote code execution is acknowledged only at high level while disclosure runs:

> “…there's some concerning vulnerabilities like for example remote code execution vulnerabilities where an attacker could manipulate what your TV does…”

---

## “We Own the Glass”: ACR as Business Model

LG Ad Solutions president **Serge Matta** and R&D leadership are shown pitching advertisers:

> “We own the glass. We own the TV because, you know, we own the glass… and we have firstparty ACR data, automated content recognition data. We understand everything that that hits the screen.”

Burke’s reaction:

> “I paid $2,400 for this particular glass that arrived curved on one side, but I I guess I don't own it.”

### Who Serge Matta is

> “Serge Mada, the first man who said LG owns the glass, is the president of LG Adolutions, which sells the data harvested from your television to partners. LG owns LG Adolutions, which is a private company. And that's a good thing because Mata is legally banned by the SEC from running a public company after settling charges relating to a fraudulent scheme. Now he's in charge of the data collected from your TV.”

Later, with SEC detail:

> “…engaging in a fraudulent scheme to overstate revenue by approximately $50 million…” Settlement: **$700,000** penalty, **$2.1 million** reimbursement to Comscore, **10-year bar** from serving as officer/director of a **public** company.

> “Luckily for MA, the SEC didn't say anything about serving as the president of a private company.”

*(ASR truncates “Matta” to “MA.”)*

### What ACR is

> “Automated content recognition can be audio or video data, including screenshots, that's converted into a fingerprint, and transmitted back to servers. In this case, those servers are LG servers for its LG ad solutions company.”

Hardware vs ads economics:

> “So, even though we paid $3,000 for some of these really nice TVs with multiple embedded microphones and webcam accessory options, some of these TV companies are now making more margin dollars from targeted ads than they are from selling the actual TV hardware.”

MrBruh on audio fingerprint construction:

> “it downsamples it to 8 kHz mono, then runs a fast furrier transform on 40 chunks of 100 milliseconds of audio, combines the FFTs into a fingerprint, and uploads the result.”

*(ASR: “furrier” → Fourier.)*

Wendell on the industry’s six-second hedge:

> “When ACR is working as advertised… it's capturing about 6 seconds of audio or video and using that as a fingerprint and then it's got a dormant period… the ad industry's hedge against accidentally leaking… hours of conversations… Oh, we only capture six seconds… but that's still a lot. You can do a lot with that.”

Fingerprints vs raw screenshots — you don’t need JPEGs:

> “You can have a tiny tiny tiny little frame and generate a hash of it effectively… that text can be sent back… compare that against the database and say this is a frame from Lord of the Rings.”

---

## Road Trip, Methodology, and Crowdfunding Frame

The team drives to Wendell’s “bunker of secrets,” buys a retail G5 at Best Buy (“we need something we can do a man-in-the-middle attack on to make it spy on us”), and stages the legal/comedy setup: Webster’s colloquial “hack,” plus the bit that they cannot legally accept ToS while “incredibly inebriated” — used to stress how easy accidental consent is, and how dark the consent UX is.

Data Dragnet campaign context (store.gamersnexus.net): ~**$70k** into this report alone; Blu-ray / USB “DMCA abused Dead Man Switch” copies of the video; future Samsung/Vizio scope if funded.

Agenda they promise mid-video:

> “…LG's automatic content recognition functionality that's designed to build advanced profiles on everything in your life, including secondary devices in the same household. The sale of that data, LG's political campaign targeting for quote voters that matter end quote. And we'll even go over 40,000 words of agreements… including this sneaky change to the class action sections that they made after our first video. Oh, and we also hacked the TVs. Whoopsy doodle. But don't let that distract from LG's native spying functionality.”

### Misconception: unplug Ethernet and you’re safe

> “One of the common misconceptions… is that simply unplugging your TV from Ethernet is enough to stop it from spy on you. That might not be enough. And in fact, even using an LG smart TV as a dumb monitor doesn't necessarily stop all of the functionality we're talking about today.”

*(Spoken grammar in transcript: “stop it from spy on you.”)*

ISP dual-SSID / neighborhood hotspot warning (Comcast Xfinity / AT&T public SSIDs auto-join in apartments):

> “So this is a concern broadly speaking and future looking for smart TVs regardless of the brand.”

### Stakeholder voices previewed early

Robotic surgeon on telehealth + LG in the room:

> “What happens when I'm taking a patient phone call or I'm doing patient video visits and there's an LG monitor in the background? … How is that patient information protected?”

Louis Rossmann on arbitration (montage clip; fuller interview later):

> “Yeah, I love giving up my seventh amendment rights to a company in an agreement that I never actually read.”

Wendell on attacker usefulness (high-level; same early montage, expanded in the closing debrief):

> “Let's say worst case scenario, you turn it into a listening device… You turn it into a device to exfiltrate information from a corporate network or a boardroom… you use it to maintain access like as a point of presence on a network… It is perfectly functional as a proxy… Fancy Bear would be very comfortable inside LGTV.”

Legislation push:

> “I've been on the phone for 3 days with various people in Washington DC about this and we just went on tour with Lewis Rossman's team…”

*(Prose elsewhere uses Louis Rossmann; early narration ASR varies.)*

Kevin / Fulu on DMCA §1201 (preview; full section later):

> “There's no way to know for sure… that that data flow is stopping unless you go in and take it out yourself. So, because section 121 does have that prohibition on the circumvention of digital locks, um, you're screwed.”

---

## ACR Deep Dive: “Own the Living Room”

Repeated LG ads language:

> “We know who's in the LG household. We know which devices are there. We know what you're exposed to on TV and we know how to extend that reach into mobile.”

> “We own the glass. We own the TV. We own the glass.”

Cross-device ads:

> “most people are on their phone while they're watching TV… within an LG TV household, we can help extend a campaign footprint to the other devices in the household.”

AI + scene-level / product-placement fantasy from ads leadership:

> “…where I think the next evolution of ACR is the emergence of… AI combined with contextual targeting… If there's a bar scene… leverage AI to scan all the product placements… expose a beverage ad, a alcohol brand ad, like because you're in a bar.”

### Where these panels actually sit

> “You can find LG displays everywhere. hospitals, doctor's offices, waiting rooms, Airbnbs pointed straight at beds, [boardrooms,] conference rooms, college locker rooms, and they're in hotels everywhere.”

*(Transcript ASR rendered the boardrooms clause as “paper hour conference rooms”; sense is boardrooms / conference rooms.)*

Facebook dental-visit photo with alleged LG C4 OLED showing medical information; law firms; boardrooms; living rooms — then the correction:

> “No, wait, sorry. LG's advertiser's living room. They they made that clear.”

Capability vs active use caveat:

> “We're not saying that each of these TVs in these environments is actively being used as a listening device… What we're saying is that… the capability may be there… By whom is another question.”

Marketing PDFs dissect demographic groups (Asian-American, Black, LGBTQ+, Hispanic audiences) for advertisers — framed as the human endpoint of the harvest.

“Own the living room” pitch and near-Freudian slip:

> “…owning the glass and owning working with the consumer…” → “Ignoring that near Freudian slip about owning the customer, uh, sorry, working with the customer, LG Ad Solutions goes so far as to offer marketers the ability to quote, Own the living room, end quote, of LG TV users, not just the TV, but part of your house.”

---

## Intercepting the Data: Researchers and the 38-Device Crawl

Collaborators:

- **MrBruh** — prior MSI/AMD work; LG firmware decrypt/decompile with jailbreak community; community-funded (“Community Good” / donations, per GN)
- **U-Turn** — router/network vulns; community-funded (coffee-page donations)
- **Wendell** — Level1Techs; prior router vulns; lab host

### Continuous LAN scan

> “During our testing our TV continuously scanned our LAN… for all nearby devices. It obtained display names, signal strength, MAC addresses which are uniquely identifiable and more.”

> “The TV seems to have found at least 38 other devices on our network.”

Partial inventory (serials/names/IPs scrubbed on camera): Prusa XL 3D printer (transcript ASR: “Puscha XL”), ESP32-S3, air purifier, then:

> “LG's TV seems to have detected that Vitali's editing machine was even running Team Viewer from its generic network discovery query, which MrBruh says was quote, caught in the blast radius, end quote.”

Also found: internal servers; Samsung phone with staff username exposed; uninvolved staff S23; Alienware backup editor; Note 9; smartwatches; Pixels; iPhones; gateways/switches; **thermostats / HVAC**.

> “LG happens to be a company that sells air conditioners… And we now have a device that pinned our HVAC system… All because we bought a television and plugged it into the network to watch TV. I can't wait to start getting targeted ads for their AC units.”

> “So, if that's the way it's used, all of this is very creepy. And if it's not the way it's used, all of this is very creepy.”

### Alphonso collection fields (as listed)

> “LG's Alfonso also collects… LG advertise ID… device UUID… Alfonso user ID, active input, active application, uniquely identifiable MAC address, signal strength, device attributes, location, system power, onoff timestamps, and privacy consent flags… nearby Wi-Fi networks… local, language, and device ID when the user views, hovers, or clicks on their advertisement.”

Wendell: neighboring Wi-Fi scan → geolocation without GPS.

### LG Channels DNS channel leakage

MrBruh:

> “There's no privacy when watching IP TV via LG channels, as the DNS requests made can be reversed to determine what channel you are watching at any given time. This is available to anyone on the LAN or your ISP or the government by extension.”

Examples shown: DNS containing **CNN US**, **NBCN**, **Fox Digital WTTG**, etc., while those channels play. HDMI path also under ACR. Telemetry ping intervals observed from **every 75–90 seconds** to **300 seconds** to **every 5–10 minutes**. “Kviva video analytics” (as spoken/ASR’d in the transcript) noted as carrying a unique fingerprint for the device.

Why inventory every device (MrBruh):

> “This is likely being done both for legitimate, eg autod discovery network shares… and tracking reasons. Eg. If it sees you have an iPhone 12, you might get adverts for the latest iPhone 17.”

### Volume and profile glue

> “Our TV is sending an estimated 4 GB of just ACR data alone back to LG every month. Now, that's predominantly text fingerprints… That's a lot of data for something that's just text.”

Cross-product re-identification risk (TV → later LG air purifier sharing network fingerprint uniqueness):

> “…even if we were to opt out of tracking, get rid of the TV, and then buy a different LG device later… there's a chance that those data profiles are linked back together.”

---

## Dark Patterns and Broken Anonymity

> “The TV employs dark patterns that make it unclear whether you're opted in or out of targeting. LG [buries] do not sell my personal information toggles deep in the TV menus and disables the option by default on our tested TVs, even before users ever connect to the internet or accept any agreements.”

*(Transcript ASR: “LG berries” → buries.)*

Additional UI abuse:

- Advertising tracking IDs added to years-old TVs after firmware updates **without** ToS acceptance (Wendell’s never-accepted ancient set)
- Misleading **cookies** toggle that actually maps to “advertising frequency capping cookies”
- App install: need **2** agreements, popup shows **6** with **Select All** highlighted
- Using the app: need **3**, popup shows **4**, Select All again

### Opt-out is not clean

MrBruh (firmware decompile):

> “they do send one final snapshot of all tracking data to Alfonso upon opting out though, which is pretty dirty of them.”

Boot beacons remain; after full opt-out, `X-device-ID` generation switches from full MAC toward MAC **OUI** (vendor prefix) for “semi anonymous” requests — but:

> “since the MAC address can be derived from a key set per model, you can brute force the decryption keys until one works…”

Critical implementation flaw — encrypt instead of hash:

> “Normally, this is done using a process called hashing… and it cannot be reversed. However, LG chose to encrypt the MAC address and random salt instead of hashing it. This means anyone who has the model secret key can reverse the device ID and recover the MAC address, which means the advertisers would have a persistent identifier that is not random and no longer changes on reboot.”

Model secret location:

> “LG's firmware stores the model secret in the mount LG CMN data log folder, meaning users can jailbreak their TV, extract the model secret, which is the same for all TVs of that model, and deanonymize the advertisement data…”

*(Path string as spoken; “deanonymize” = de-anonymize.)*

Further opt-out behavior:

> “Device still authenticates on boot with LG. It still sends a plain text TV is online beacon… When you opt out, it sends a network request to LG saying that you have opted out and includes your TV's MAC address… A notification of opt out is sent to Alfonso… This includes a snapshot of the majority of the information…”

Louis Rossmann (~3 years earlier), quoted in-video:

> “…do not sell my personal information… this option is not by default checked, which by the way on a $3,000 LG OLED should be opt in, not opt out…”

---

## “Dumb Monitor” Myth: Wireshark Numbers

If you Select All at setup:

> “your TV is very likely collecting ACR data, even if you disconnect it from the internet after, and you only use it as a dumb display from that point forward… Our understanding is that your TV has the capability to transmit it back to LG if it connects to the internet again.”

New York Times / Center for Digital Democracy citation:

> “ACR continued to run and capture data even when the smart TV was offline” (LG and Samsung sets in that study).

### Samples (as reported)

**Before accepting agreements** (LG G3 as HDMI dumb display, internet connected, ~1 hour):

- Still reaches advertising / CDP endpoints
- Repeatedly scans nearby devices
- **8** endpoints; ~**8.9 MB** in the hour → ~**6.4 GB/month** estimate
- **38** DNS queries to LG domains
- Pins TrueNAS (transcript ASR: “TRNA”), PCs, phones, switch, printer, 3D printers, etc.
- MAC addresses in logs they assume go back to LG

**After agreeing to terms**, dumb-monitor only (G3):

- **29** endpoints, **107** connections
- **44** connections to Alphonso ACR
- **4 MB** sent in sample

**43-inch QED 73B TV** (~50 min samples; transcript wording — likely an LG QNED-class set):

| Mode | Endpoints | Connections | Alphonso ACR hits | Data sent |
|------|-----------|-------------|-------------------|-----------|
| Dumb monitor | 22 | 157 | 54 | 5.2 MB |
| LG Channels | 60 | 847 | 618 | 4.5 MB |

Contradiction with LG’s 2022 “anonymized / privacy compliant” ACR marketing — Wendell: “Oopsy doodle.”

### MITM / certificate story (audit difficulty)

Much traffic to LG is encrypted; residential TVs make custom trust stores hard; commercial sets still allow custom certificates. Separate app-level certificate stores (Chromium-ish webOS machinery) require process injection to inspect — framed as why ordinary owners cannot see what phones home, while LG simultaneously makes inspection harder:

> “They've made that harder to inspect, we think, because we own the glass. We own the TV. We're not allowed to know what our TVs are telling LG about us, even if we pay for them.”

Unencrypted traffic also observed (ISP-visible).

Wendell’s analogy:

> “…it really doesn't look a lot different than malware with a command and control server. LG has like their command and control server in the the TV phone's home that's encrypted.”

---

## Compromise Layer: Why Microphones Exist

GN roots sets for audit. High-level public claims only (as clarified in the Wendell debrief):

- MrBruh: a **non-interactive** network compromise path most people wouldn’t notice; conference-room TV on public Wi-Fi → “somebody on the network could exploit the TV non-interactively and then they're living in your TV.”
- An older / patched-class path: pair like a mobile device after entering the TV’s IP — popup must be accepted; GN says that attempt did **not** yield full control in their run.
- The path that **worked** for them: TV’s built-in (old Chromium-based) browser / a page that triggers a “mobile device would like to pair” style popup — user hits OK → “that's all she wrote.”

**Before any voice agreements**, Wendell captured wake-on-voice PDM mic audio — harsh, but recoverable into speech with filtering. Separate near-silent capture amplified **+50 dB** then another **+50 dB** revealed usable speech (“Hello. This is another 32-bit test.”) — suspected gain-drop mute rather than hard kill.

### The real question

> “But the question we need to be asking isn't how can we make our microphones embedded in our TVs more secure. The question we need to be asking is why are their microphones embedded in our TVs? Because they're only there as a byproduct or a direct product of LG's profit-seeking functionality…”

### Mic switch weasel words

Mechanical switch off ≠ no audio capture:

> “Even with that microphone switch off, I've got the option to capture audio from HDMI… Bluetooth or USB… webcam… The LG remote, it also has a microphone…”

Official LG USB webcam accessory = same class of problem as a generic webcam (“six one way, half a dozen the other”).

Remote push-to-talk with **UI suppressed**:

> “I'm suppressing the UI. I'm suppressing the LG functionality. I've taken it over, but I'm using that to listen to the room… if you're an adversary, the sky's is the limit… because it's a powerful computer behind the glass and the hacker will own the glass.”

*(ASR doubles “sky’s is.”)*

Menu toggles rewritten from shell after “disabling” voice features — voice hardware works for someone inside the TV whether or not terms were accepted.

### Offline record → reconnect copy-off

G5 demo: record with network unplugged; reconnect; copy audio off. Far-field / feedback mic usable for speech. Hotel-room thought experiment. Webcam capture while hardware mic switch is off. Boardroom crypto rug-pull skit while screen “looks off” — then:

> “Oh, there's evidence of our rugpull scam.”

Time-to-demo ~**1–1.5 hours** for that problem class — “Can you imagine if we were the NSA…”

Storage notes from Wendell debrief: **16 GB** flash; ~**4 GB** workable for audio without creativity; USB stick → weeks of audio; physical access alone measured in **~10 minutes** for a prepared adversary.

---

## Plaintext Transcripts and “Ambient” Conversations

> “In our testing, we found that the voice input data is transcribed to plain text and memory. We suspect it gets analyzed by LG as well, especially with the AI features. This would also include so-called ambient conversation that happens nearby while someone else is using the TV voice inputs or is within the ongoing trigger window…”

Wendell:

> “…it has done the speechtoext thing and it doesn't cost a lot to store text forever…”

*(ASR: “speechtoext” → speech-to-text.)*

On-camera: `Hi LG` wake; process still listening (`voice agent` / input keyboard); fake PII / SSN / birthday logged; Jeep / MGM partner-ad bait spoken into the open window; searches fire from ambient speech; “It's hard to make this thing stop listening.”

LG’s prior denial:

> “LG Electronics… reaffirms that LG TVs do not collect, record, or store ambient conversations.”

GN:

> “That's some slippery use of the word ambient here… On multiple occasions… the TV continued capturing ambient audio… following the high LG trigger even after we thought it had long completed the input command window…”

*(ASR: “high LG” → “Hi LG.”)*

Timed silence test: **~10 seconds** of no talking still inside the capture window — “Holy… that's a long time to record.”

Range test: clear capture from nearly **70 feet**, around corners; at **40+ feet** humans struggle to hear each other while the TV still picks speech; mic compared favorably to studio mics.

UI contradiction they cite:

> “When you go to the enable function for talking to the TV with voice recognition, it says excessive ambient noise around the TV may affect hands-free voice control performance. I rest my case.”

### Andrew / Vitali background conversation

Immediately after enabling voice, TV logs staff conversation behind the set while Tannon uses voice commands across a large room — silence after “two layers,” then continued capture for **a couple of minutes** without interrupting them. Same class of plaintext log recovered with Wendell.

### RAM-disk logs and “delete my data”

Verbose logs on RAM disk; soft reboot does **not** clear; **pull power** clears those verbose logs. “Clear data” appears to phone LG more than wipe locally. Other logs persist; Goodwill resale certainty is incomplete. ISO / CCPA-style audit angle: debug logs containing sensitive speech are “verboten.”

Speaker-output / “boardroom call” demo: conference audio played through TV as display; adversary with control records HDMI/speaker path — IT unlikely to notice fake `lg-*-services.com`-looking domains among the storm of legitimate phone-home hosts.

---

## Residential Proxies and UPnP Blast Radius

**Spur (June):** **1,213 / 2,851** (~**43%**) tested webOS store apps allowed turning customer TVs into residential proxies. Proxy companies often *were* the publishers. Amazon/Roku already banned third-party proxy facilitation. Spur:

> “A one-time consent prompt buried in a TV app is not a substitute for meaningful transparency… risk is amplified when consent comes from… minors.”

LG SVP **John Taylor** to Krebs on Security:

> “A residential proxy network is not an intended use… working with developers to remove… If this option is not removed, these apps will be suspended.”

GN: disbelief that LG was unaware of 1,200+ proxy SDK apps; negligence framing if they truly were.

**MrBruh — UPnP partner API:**

> “For any third party that obtains standard partner trust for the app store, their app can list and control any UPN… devices on the LAN… list devices, list services… request action… A malicious app or game you install on the TV could try to access or read files from [a NAS].”

*(ASR: “UPN” → UPnP / Universal Plug and Play — spelled out in the same breath in the video.)*

Kid-installs-a-game scenario during the window these issues remain open — while residential users are blocked from the certificate tricks that would let them audit encrypted telemetry.

---

## Draconian Agreements (They Actually Counted Clicks)

Setup telemetry of consent UX:

- **1,246** remote clicks to read six user agreements
- **1,459** more for four LG account terms
- **2,705** clicks for the first layer alone
- Smart TV terms **>18,500** words; account terms **~12,400**; plus ~**17,000** more across US ToS/privacy → approaching **~50,000** words
- Average adult **2.8–3.8 hours** to read; TV may sleep/timeout first
- Some LG legal web pages literally said **“test”**; exhibits “Thanos snapped” after first video while still referenced

Forced accept ToS/privacy before apps; built-in apps push LG account + more agreements. Watching YouTube *on* the LG TV app means those buried clauses already apply.

### What the policies admit collecting

Device IP, MAC, model; every linked device (console, phone, DVD, bulbs, switches, appliances); zip/area codes; combine across LG services; share for “business purposes” with processors, security vendors, analytics; in some states may “sell or share” identifiers, internet usage, commercial activity, geolocation.

**Voice Information Agreement:** transfer/processing in other countries including Korea; retain voice data **6 months**; household must attest consent for overheard members:

> “I have obtained consent from all other members of my household whose information may be collected…”

Pinky-swear not to sell voice/biometrics alongside broader sell/share language elsewhere.

Separate US privacy policy covers website, appliances, the LG ThinQ app (transcript ASR: “Think app”), robots, support calls, marketing, account — demographics, contacts, user media; combine with social media, utilities, data brokers.

Word games:

> “LG says it does not quote sell personal data for money end quote but that it may share the personal data with partners for quote targeted advertising purposes end quote.”

Class-action waiver; packaging fine print; **forced arbitration notice sticker** on the back of some TVs — remorse after unboxing; not on all units.

ThinQ geolocation; AI R&D use; “deidentified” data share with subsidiaries and outside entities for “any purpose”; terms change whenever LG wants.

Smart monitor OOB:

> “Please note that the terms of use will be updated and will be effective in 30 days on August 26th, 2026. Amendment details, arbitration agreement, and AI based service terms.”

Arbitration expansion **2026-07-28** after monitor video **2026-07-16**. GN: evil anti-consumer pattern; kills public precedent + pairs with class waiver.

> “LG's customers buying TVs costing thousands of dollars aren't just customers. They're also the product… Selling a TV is a one-time sale. Selling data and advertisements and training AI continues indefinitely.”

---

## Alphonso / LG Ad Solutions Corporate Mess

Service partner for viewing info: **Alphonso, Inc.** = incorporated name of LG Ad Solutions. Controlling stake **2021**; “cross-device advertising platform” pitch; rebrand to LG Ads.

2022 Alphonso claimed:

> “Our ACR technology is a double opt-in um experience for consumers…”

GN: only saw **single** opt-in in practice — safeguards removed.

Wendell’s never-accepted old TV: firmware slowly adds ad IDs, cookies, Limit Ad Tracking **off by default**.

Select All deception → accidental accept → “there's really no going back.”

### Loop IQ: ads → credit cards

Matta on Affinity Solutions partnership:

> “…tie it to an actual credit card or a bank transaction an actual purchase… Loop IQ… Tying the actual CTV exposure to a merchant… and to an actual purchase is where we're heading…”

### Lawsuits and money

Ad Exchanger: LG “boardroom coup” 2022; Alphonso sued and won; four suits; billions at stake; Korean press: LG pursuing 100% takeover. Q1 2026 Alphonso economics cited above. Walmart/Vizio parallel: Vizio 2023 device gross margin **−0.8%** vs Platform Plus (ads) **61%**.

---

## Microsoft, Nuance, and the Monitor PR

Long Microsoft–LG history (Windows Phone, patents, AV cloud MoU, Xbox-in-car, Copilot PCs, robot voice, **billions** in data-center cooling). Deepest link for this story:

> “LG names Nuance Communications as the service partner that collects and analyzes voice data when someone uses voice commands with an LG TV. Microsoft purchased Nuance for 19.7 billion in 2021…”

GN’s charge: Microsoft “every bit as guilty” while publicly distancing during McAfee popup storm. LG’s McAfee statement carefully denies automatic McAfee install; GN says they claimed automatic **LG Monitor App Installer** + McAfee **promotion**, not silent McAfee payload — and Store permissions still allow broad system/network access. Separate researcher note: vulns across apps tied to that installer (deferred).

Tim Sweeney alert → Microsoft VP says LG disabled McAfee popup — nothing about silent installer, nothing about Nuance.

---

## Louis Rossmann: Forced Arbitration

Sticker on TV back: “forced arbitration notice.” Refrigerator precedent: box discarded by movers; signature for delivery treated as agreeing to unread manual/box terms.

Why companies want it: arbitration is a private forum the company pays for; no court; no precedent; kills class actions. Rossmann’s point on class actions despite 50¢ checks: repair programs / behavior change (butterfly keyboards, GPU boards) beat zero rights.

GN notes LG thickened class-action language after the monitor video — “at some point you're admitting guilt.” Roku-style agree-with-no-disagree UI after breach cited as industry parallel. Advice: be annoying; small claims anyway.

---

## HIPAA / Surgeon Interview

Robotic general surgeon Aaron: telehealth / Epic VPN mandated, but LG panel in clinic or home office is uncontrolled:

> “if that is recorded and taken out of my control, who's to say that that's HIPPA compliance… I don't even know who's listening in my own household.”

Speaker-path capture concern for telehealth audio playing through the TV. Faraday-cage joke as the only joke that works.

---

## DMCA §1201: Criminality of Removing the Spyware

Kevin (Fulu Foundation), organizer on the Own Your Shit tour with Rossmann:

> “Simply circumventing a digital lock can become a copyright crime… you might want to go in and remove that software… there's no way to know for sure… that that data flow is stopping unless you go in and take it out yourself… you're screwed.”

House-key analogy: picking your own lock isn’t B&E — §1201 makes the digital equivalent a crime. Tools to help consumers strip ACR: up to **$500,000** and **five years** federal prison per offense. 1998 anti-piracy origin; WIPO treaty end-run narrative (Bruce Lehman). Action: write representatives; fulu.org; Consumer Rights Wiki / Hall of Shame.

U-Turn close quote:

> “My recommendation to users would be to demand ownership over your devices. First, by using and supporting proconsumer projects that seek to give you device control back, and second, by demanding legislation… Sell carriers only carrier unlock your phones because the 113th Congress made it law.”

---

## Wendell Debrief: Recap of Abuse Cases

| Scenario | Point |
|----------|-------|
| Listening device | Multiple mics; screen-off; offline store; network exfil |
| Boardroom / HDMI audio | Capture display audio path without the laptop owner recording |
| Point of presence / proxy | Lateral movement; “Fancy Bear would be very comfortable inside LGTV” |
| ACR tap | Intercept 6-second clips pre-hash with tiny watcher program — TV “behaves normally” |
| Feedback mic | Low bitrate but speech-reconstructible |
| Physical access | ~10 minutes alone with set |
| Geo without GPS | Nearby SSIDs + AP MACs; leaked LG DB → find interesting TVs |
| Domain expiry / old TVs | Bazillion phone-home domains; unpatched older firmware |
| Adversarial updates | Ad IDs / cookies appear without consent; DTS behavior changes; “they own the glass” |
| Dumb panel preference | Wendell never trusted built-in apps; Crossover rebadge anecdote (different electronics on LG panel) |

On trusting LG wipe:

> “How do you format your TV? LG doesn't. It's like do you trust LG to do that? It's like no, I would like to get in there and look around…”

---

## Closing Position (GN)

> “LG will probably say that they take vulnerabilities very seriously and will patch them right away but they didn't reply to us when we sent them a ton of our concerns. The bigger[, we] think, is LG deliberately designing this to make money off of your privacy after you paid for a thing and off of your personal information.”

*(Spoken cadence; sense: the bigger issue is the deliberate privacy monetization.)*

> “If you want flock cameras on your living room wall, this is how you get flock cameras on your living room wall. The only reason to give a TV this kind of power is to visit horrors upon you, not to make a better product.”

> “Ultimately, we wouldn't recommend any LG smart products to literally anybody.”

> “We think the extent of LG's data harvesting is intrusive and grotesque… when you purchase something, especially for thousands of dollars, you should own that thing.”

Operational consensus:

- **MrBruh:** immediately disconnect LG smart TVs from any network  
- **Wendell:** same  
- **U-Turn:** ownership + legislation  
- Tips: tips@gamersnexus.net · Data Dragnet store campaign · community coffee pages for MrBruh / U-Turn  

---

## Defender Checklist (From the Investigation’s Own Advice)

1. **Disconnect** LG smart TVs from any network (MrBruh / Wendell / researchers’ repeated recommendation); prefer a dumb panel or never enable smart features.  
2. Account for **ISP dual-SSID / neighborhood hotspots** (Xfinity / AT&T-style) that can auto-join even when “Ethernet is unplugged.”  
3. Treat menu opt-outs as incomplete: **Do Not Sell** was off by default before connect; Select All dark patterns; opt-out still sends a final Alphonso snapshot; Limit Ad Tracking can appear off with no prior consent.  
4. Do not trust mic switches or on-TV “clear data” without a **power pull**; treat conference-room / clinic LG panels as in-scope sensors (surgeon + Wendell boardroom scenarios).  
5. Avoid webOS app installs while proxy SDKs / UPnP partner APIs remain a blast radius.  
6. Demand ownership and legislation: Fulu / anti-§1201, anti-forced-arbitration pressure (Rossmann / Kevin / U-Turn).  
7. Tips for follow-ups: tips@gamersnexus.net; support Data Dragnet if you want Samsung/Vizio tested next.

---

## Related Signals

- [Popa Botnet Linked to NetNut Proxy Provider](/signals/popa-botnet-residential-proxy) — residential proxy economics on living-room hardware  
- [Mirai Variant Targets IoT Telnet](/signals/mirai-variant-iot-telnet) — IoT segmentation discipline  

## Sources

- [Gamers Nexus — 216,000,000 Spy TVs \| The LG Smart TV Problem](https://www.youtube.com/watch?v=6IFVTcM28KA) (primary; quotes from provided transcript)  
- Data Dragnet campaign: [store.gamersnexus.net](https://store.gamersnexus.net/data-dragnet)  
- Spur residential-proxy webOS research / Krebs coverage (as cited in-video)  
- SEC v. Comscore / Serge Matta (2019) (as cited in-video)  
- Fulu Foundation — DMCA §1201 advocacy ([fulu.org](https://fulu.org))  

**Indexing note:** OFFSITE.DARK did not perform this research. This article is a structured citation record of Gamers Nexus’s published investigation and on-camera statements. RCE specifics remain under responsible disclosure — isolate first.
