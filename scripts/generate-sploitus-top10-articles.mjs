import fs from "fs";
import path from "path";

const DATE = "2026-06-29";
const OUT = path.join(process.cwd(), "content", "news");

const exploitariumSubs = [
  {
    slug: "exploitarium-7zip-rar5-motw-chain-poc",
    title: "7-Zip RAR5 MotW/ADS Full-Chain PoC",
    tags: ["7zip", "motw", "windows", "rar5", "exploitarium"],
    excerpt:
      "Crafted RAR5 STM streams overwrite extracted file bytes and Zone.Identifier on 7-Zip 26.01 — MotW bypass chain.",
    product: "7-Zip 26.01 x64 (Windows NTFS)",
    cve: "Related to MotW/archive handling research (see CVE-2025-0411 class)",
    impact: "Attacker-controlled visible file content plus ZoneId=0 on extracted files when Internet-zone archive propagates MotW.",
    primitive: "RAR5 `::$DATA` and `:Zone.Identifier:$DATA` STM records",
    chain: "Build RAR5 → mark archive ZoneId=3 → extract with `-snz1` → verify content + MotW stream",
    mitigation: "Patch 7-Zip; treat downloaded archives as untrusted; enforce SmartScreen/AppLocker on extracted content.",
    siblings: ["exploitarium-imagemagick-gs-delegate-hijack-poc", "exploitarium-lunar-modrinth-chain-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/7zip-rar5-motw-chain-poc",
  },
  {
    slug: "exploitarium-anydesk-printer-com-impersonation-poc",
    title: "AnyDesk 9.7.6 Printer Pipe COM Impersonation LPE",
    tags: ["anydesk", "lpe", "com", "windows", "exploitarium"],
    excerpt:
      "AnyDesk printer worker unmarshals attacker COM bytes on the adprinterpipe named pipe with RPC_C_IMP_LEVEL_IMPERSONATE — SYSTEM when installed as service.",
    product: "AnyDesk for Windows 9.7.6",
    impact: "Low-privileged local user → AnyDesk service identity (default LocalSystem on service install).",
    primitive: "Named pipe + CoUnmarshalInterface(IStream::Read) impersonation",
    chain: "Connect adprinterpipe → send marshaled IStream → callback impersonates service during Read",
    mitigation: "Restrict pipe ACL; validate COM caller; run service under least-privilege account.",
    siblings: ["exploitarium-systeminformer-phsvc-trusted-host-lpe-poc", "exploitarium-openvpn-connect-echo-script-ace-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/anydesk-printer-com-impersonation-poc",
  },
  {
    slug: "exploitarium-c-ares-tcp-uaf-calc-poc",
    title: "c-ares TCP ares_getaddrinfo() UAF Calc PoC",
    tags: ["c-ares", "uaf", "dns", "exploitarium"],
    excerpt:
      "Loopback DNS-over-TCP EDNS retry sequence leaves stale skip-list state; cleanup reaches attacker-shaped destructor — calc proof on main and v1.34.6.",
    product: "c-ares main @ c93e50f3 and release v1.34.6",
    impact: "Controlled code execution in harness linking affected c-ares (not universal app exploit).",
    primitive: "TCP DNS double-response + connection reset → UAF in query cleanup",
    chain: "ares_getaddrinfo(EDNS|USEVC) → FORMERR then success → TCP reset → shaped allocator → proof_marker()",
    mitigation: "Track c-ares advisories; isolate resolver in separate process where feasible.",
    siblings: ["exploitarium-ffmpeg-rasc-dlta-calc-poc", "exploitarium-libssh2-cve-2026-55200-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/c-ares-tcp-uaf-calc-poc",
  },
  {
    slug: "exploitarium-docker-cp-copyout-destination-escape",
    title: "Docker cp Copy-Out Destination Escape",
    tags: ["docker", "container", "escape", "exploitarium"],
    excerpt:
      "Container races host `docker cp` copy-out so extraction writes sibling path outside requested destination — validated on Engine 29.6.0.",
    product: "Docker Client/Server 29.6.0",
    impact: "Container-controlled file write outside operator-selected host destination when copy-out races.",
    primitive: "Tar stream extraction race against sibling prefix paths (dst vs dst2)",
    chain: "Host runs docker cp → container padding + raced path → marker under dst2/",
    mitigation: "Avoid copy-out from untrusted containers to sensitive host trees; isolate operator workflows.",
    siblings: ["exploitarium-gitea-act-runner-container-options-poc", "exploitarium-rustdesk-session-permission-pocs"],
    gh: "https://github.com/bikini/exploitarium/tree/main/docker-cp-copyout-destination-escape",
  },
  {
    slug: "exploitarium-firefox-smartwindow-private-url-exfil-poc",
    title: "Firefox Smart Window Private URL Exfiltration",
    tags: ["firefox", "privacy", "smart-window", "exploitarium"],
    excerpt:
      "Smart Window sets privateData without untrustedInput — attacker titles coerce get_page_content to fetch expanded private tab/history URL tokens.",
    product: "Firefox 152.0.2 x64 (Windows)",
    impact: "Private tab/history URLs (queries, tokens, reset links) leak to attacker HTTP endpoint via hidden fetch.",
    primitive: "URL token expansion in tool args when privateData=true and untrustedInput=false",
    chain: "Malicious title in tab/history → get_open_tabs/search_browsing_history → model calls get_page_content with tokenized attacker URL",
    mitigation: "Update Firefox; disable Smart Window in sensitive profiles; monitor for unexpected outbound fetches from browser.",
    siblings: ["exploitarium-lunar-modrinth-chain-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/firefox-smartwindow-private-url-exfil-poc",
  },
  {
    slug: "exploitarium-floci-apigateway-vtl-rce-poc",
    title: "Floci 1.5.27 API Gateway VTL RCE + IAM Scope Bypass",
    tags: ["floci", "vtl", "aws-emulator", "rce", "exploitarium"],
    excerpt:
      "Velocity templates in Floci API Gateway integration responses reach ProcessBuilder; wrong SigV4 credential scope bypasses IAM enforcement.",
    product: "Floci 1.5.27",
    impact: "OS command execution as Floci JVM; IAM deny policies bypassed with `iam` scope on apigateway routes.",
    primitive: "VTL reflection + SigV4 scope service-name mapping failure",
    chain: "Create REST API → malicious responseTemplates → deploy → invoke OR scope=iam on control plane",
    mitigation: "Do not expose Floci API to untrusted networks; enable IAM enforcement with correct scope validation.",
    siblings: ["exploitarium-flowise-mcp-env-case-bypass-poc", "exploitarium-gitea-act-runner-container-options-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/floci-apigateway-vtl-rce-poc",
  },
  {
    slug: "exploitarium-flowise-mcp-env-case-bypass-poc",
    title: "Flowise 3.1.2 MCP NODE_OPTIONS Case Bypass",
    tags: ["flowise", "node", "windows", "rce", "exploitarium"],
    excerpt:
      "Custom MCP stdio blocks `NODE_OPTIONS` by exact case; Windows honors `node_options` — preload arbitrary JS in child Node process.",
    product: "Flowise 3.1.2 / flowise-components 3.1.2 (Windows)",
    impact: "Authenticated Flowise user with MCP config access → code execution in worker context.",
    primitive: "Case-sensitive env denylist vs case-insensitive Windows env slot",
    chain: "Set node_options=--require loader in MCP env → spawn Node child → marker file / RCE",
    mitigation: "Normalize env keys to uppercase before denylist; restrict MCP configuration to admins.",
    siblings: ["exploitarium-floci-apigateway-vtl-rce-poc", "exploitarium-php857-streambucket-soap-rce-rpoc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/flowise-mcp-env-case-bypass-poc",
  },
  {
    slug: "exploitarium-ffmpeg-rasc-dlta-calc-poc",
    title: "FFmpeg RASC DLTA Heap OOB Write Calc PoC",
    tags: ["ffmpeg", "rasc", "heap", "exploitarium"],
    excerpt:
      "Crafted RASC bitstream in AVI/RIFF overwrites adjacent callback pointer in PAL8 one-row decode — Calculator proof on upstream master.",
    product: "FFmpeg master @ bcd2c69e087a (2026-06-26)",
    impact: "Heap corruption → hijacked get_buffer2 callback → arbitrary native code execution in decoder process.",
    primitive: "decode_dlta() 32-bit write past 64-byte PAL8 row",
    chain: "Craft RASC packet → decode_dlta run type 7 → redirect callback → calc_callback",
    mitigation: "Track FFmpeg security releases; sandbox transcoding of untrusted media.",
    siblings: ["exploitarium-c-ares-tcp-uaf-calc-poc", "exploitarium-vlc-vp9-reschange-crash-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/ffmpeg-rasc-dlta-calc-poc",
  },
  {
    slug: "exploitarium-ghidra-12-1-2-rce-ace-calc-poc",
    title: "Ghidra 12.1.2 Conditional ACE / TraceRMI RCE Surfaces",
    tags: ["ghidra", "ace", "tracermi", "exploitarium"],
    excerpt:
      "Packaged calc PoCs for Swift demangler tool path ACE, conditional TraceRMI agent command execution, and SevenZipJBinding reachability.",
    product: "Ghidra 12.1.2",
    impact: "Conditional local code execution when Swift tool dir configured or untrusted TraceRMI peer; native parser surface via SevenZipJBinding.",
    primitive: "Process launch sinks + TraceRMI command channels + archive parser",
    chain: "Config-dependent: fake swift-demangle tool, TraceRMI agent methods, or archive open path",
    mitigation: "Only load projects/tools from trusted paths; isolate Ghidra in VM for untrusted binaries.",
    siblings: ["exploitarium-objdump-dlx-calc-poc", "exploitarium-imagemagick-gs-delegate-hijack-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/ghidra-12.1.2-rce-ace-calc-poc",
  },
  {
    slug: "exploitarium-gitea-act-runner-container-options-poc",
    title: "Gitea act_runner container.options Host Namespace Bypass",
    tags: ["gitea", "actions", "docker", "ci", "exploitarium"],
    excerpt:
      "Workflow `container.options` preserves --pid=host and cap-add=ALL while Privileged=false — nsenter writes host marker from job container.",
    product: "Gitea act_runner (Docker-backed)",
    impact: "Untrusted workflow on shared runner → host PID namespace access and root marker command.",
    primitive: "mergeContainerConfigs keeps HostConfig fields when privileged forced false",
    chain: "YAML options → act_runner exec → nsenter → /tmp marker on host",
    mitigation: "Sanitize or block workflow container.options; dedicated ephemeral runners per trust zone.",
    siblings: ["exploitarium-docker-cp-copyout-destination-escape", "exploitarium-floci-apigateway-vtl-rce-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/gitea-act-runner-container-options-poc",
  },
  {
    slug: "exploitarium-imagemagick-gs-delegate-hijack-poc",
    title: "ImageMagick Ghostscript Delegate Path Hijack",
    tags: ["imagemagick", "ghostscript", "windows", "exploitarium"],
    excerpt:
      "Bare `gswin64c.exe` delegate on Windows resolves from CWD — planted binary executes when processing PDF/PS in attacker-writable directory.",
    product: "ImageMagick 7.1.2-25 + Ghostscript 10.07.1 (Windows)",
    impact: "Arbitrary code execution as user running convert/magick from hijackable working directory.",
    primitive: "Unqualified executable name in Ghostscript delegate command",
    chain: "Drop fake gswin64c.exe in CWD → process PDF → helper launches instead of real GS",
    mitigation: "Use full Ghostscript paths; run conversions from non-writable directories; MAGICK_GHOSTSCRIPT_PATH hardening.",
    siblings: ["exploitarium-7zip-rar5-motw-chain-poc", "exploitarium-ghidra-12-1-2-rce-ace-calc-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/imagemagick-gs-delegate-hijack-poc",
  },
  {
    slug: "exploitarium-libssh2-cve-2026-55200-poc",
    title: "libssh2 CVE-2026-55200 Packet Length Integer Wrap",
    tags: ["libssh2", "cve-2026-55200", "ssh", "exploitarium"],
    excerpt:
      "Unchecked SSH packet_length wraps allocation to 19 bytes while logical length stays 0xffffffff — local RCE harness models post-allocation misuse.",
    product: "libssh2 ≤ 1.11.1 (fixed 97acf3df)",
    cve: "CVE-2026-55200",
    impact: "Heap corruption / control hijack in SSH client paths using vulnerable transport read.",
    primitive: "packet_length=0xffffffff → alloc size 19 via 32-bit wrap",
    chain: "Malicious SSH server → ssh2_transport_read → undersized alloc → harness callback overwrite",
    mitigation: "Upgrade libssh2 past 1.11.1; reject oversized packet_length before addition.",
    siblings: ["exploitarium-libssh2-publickey-list-calc-poc", "exploitarium-c-ares-tcp-uaf-calc-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/libssh2-cve-2026-55200-poc",
  },
  {
    slug: "exploitarium-libssh2-publickey-list-calc-poc",
    title: "libssh2 Publickey List Parser Calc PoCs",
    tags: ["libssh2", "heap", "publickey", "exploitarium"],
    excerpt:
      "Win32 attrs allocation wrap and Win64 cleanup arbitrary-free chains in publickey list fetch — live SSH session calc replay included.",
    product: "libssh2 master @ e75b4bae3c68 (2026-06-24)",
    impact: "Remote calc proof via publickey subsystem when vulnerable parser build linked.",
    primitive: "num_attrs multiply wrap + malformed version/publickey list shaping",
    chain: "SSH publickey subsystem → grow list into freed slot → cleanup calls attacker callback",
    mitigation: "Apply parser hardening (zero list keys after growth; reject overflowing num_attrs).",
    siblings: ["exploitarium-libssh2-cve-2026-55200-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/libssh2-publickey-list-calc-poc",
  },
  {
    slug: "exploitarium-lunar-modrinth-chain-poc",
    title: "Lunar Client Modrinth Explore RCE Chain",
    tags: ["lunar", "modrinth", "electron", "rce", "exploitarium"],
    excerpt:
      "rehypeRaw Markdown + preload IPC forges Modrinth profile overrides and openExternal local launcher — critical candidate CVSS ~9.6.",
    product: "Lunar Client (Electron) June 2026 builds",
    impact: "Victim views malicious Modrinth project in Explore → desktop-user code execution without launching Minecraft.",
    primitive: "Raw HTML in Explore + profile override extraction + shell.openExternal on .lnk",
    chain: "Malicious MD → iframe JS → forge profile → extract overrides → openExternal launcher",
    mitigation: "Sanitize Modrinth HTML; restrict openExternal; validate override paths outside user-writable dirs.",
    siblings: ["exploitarium-firefox-smartwindow-private-url-exfil-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/lunar-modrinth-chain-poc",
  },
  {
    slug: "exploitarium-mybb-limited-acp-to-admin",
    title: "MyBB 1.8.40 Limited ACP to Full Administrator",
    tags: ["mybb", "privilege-escalation", "php", "exploitarium"],
    excerpt:
      "ACP user-manager permission alone can create gid=4 Administrator accounts — verify_usergroup() accepts any group.",
    product: "MyBB 1.8.40",
    impact: "Limited ACP user module access → full board administration.",
    primitive: "Unvalidated usergroup POST in Admin CP add-user flow",
    chain: "ACP session with user-users=1 → POST usergroup=4 → new full admin account",
    mitigation: "Restrict ACP user management; patch when vendor fix ships; audit unexpected Administrator accounts.",
    siblings: ["exploitarium-flowise-mcp-env-case-bypass-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/mybb-limited-acp-to-admin",
  },
  {
    slug: "exploitarium-nghttp2-nghttpx-upgrade-queue-poison-poc",
    title: "nghttpx HTTP/1.1 Upgrade Response Queue Poisoning",
    tags: ["nghttp2", "nghttpx", "smuggling", "exploitarium"],
    excerpt:
      "Upgrade request with Content-Length leaves backend bytes parsed as next request — smuggled response delivered to victim client on reused connection.",
    product: "nghttp2 v1.69.0 nghttpx (fixed ab28105c)",
    impact: "Cross-client response poisoning; cache confusion; same-origin content injection.",
    primitive: "HTTP/1.1 Upgrade + body desync on backend keep-alive",
    chain: "GET /upgrade + websocket body containing GET /poisoned → victim GET /victim receives smuggled payload",
    mitigation: "Upgrade nghttp2 past fix; disable risky Upgrade forwarding; connection isolation per client.",
    siblings: ["exploitarium-docker-cp-copyout-destination-escape"],
    gh: "https://github.com/bikini/exploitarium/tree/main/nghttp2-nghttpx-upgrade-queue-poison-poc",
  },
  {
    slug: "exploitarium-nmap-ipv6-extlen-wrap-poc",
    title: "Nmap IPv6 Extension Header Length Wrap",
    tags: ["nmap", "ipv6", "parser", "exploitarium"],
    excerpt:
      "Hop-by-Hop ext len=1 on 48-byte capture advances payload offset past buffer — wrapped payload_len 4294967288 in harness.",
    product: "Nmap libnetutil/netutil.cc (ongoing research)",
    impact: "Malformed packet represented as huge UDP payload — downstream scan logic corruption risk.",
    primitive: "Unsigned wrap in payload length after over-advancing pointer",
    chain: "Craft IPv6 HBH ext → parser offset 56 on 48-byte cap → wrapped len → validator adjusts to 64",
    mitigation: "Treat as research-grade; validate Nmap updates; filter malformed IPv6 in IDS where possible.",
    siblings: ["exploitarium-objdump-dlx-calc-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/nmap-ipv6-extlen-wrap-poc",
  },
  {
    slug: "exploitarium-objdump-dlx-calc-poc",
    title: "objdump DLX Backend OOB Write Calc PoC",
    tags: ["binutils", "objdump", "elf", "exploitarium"],
    excerpt:
      "Crafted ELF/DLX objects via objdump -g reach calc callback — ASLR-relative delta strategy; credit 4D4J/objdump-Out-Of-Bounds-write.",
    product: "GNU objdump 2.46.1 dlx-elf / binutils-gdb master",
    impact: "Local ACE when victim runs objdump on malicious DLX object (not network RCE).",
    primitive: "DLX debug section heap overwrite → hijacked callback",
    chain: "objdump -g crafted.bin → overwrite adjacent pointer → P helper launches calc",
    mitigation: "Do not run objdump on untrusted objects; update binutils when fixes ship.",
    siblings: ["exploitarium-ghidra-12-1-2-rce-ace-calc-poc", "exploitarium-nmap-ipv6-extlen-wrap-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/objdump-dlx-calc-poc",
  },
  {
    slug: "exploitarium-openvpn-connect-echo-script-ace-poc",
    title: "OpenVPN Connect Echo Script ACE + PAC Push",
    tags: ["openvpn", "vpn", "ace", "windows", "exploitarium"],
    excerpt:
      "Malicious server push decodes script.win.user.disconnect via echo option — runs on disconnect despite scriptsPermissionGranted=false.",
    product: "OpenVPN Connect for Windows (tested builds per PoC)",
    impact: "Current-user ACE on disconnect; transient PAC AutoConfigURL via dhcp-option push.",
    primitive: "push echo base64 script.win.user.disconnect + PROXY_AUTO_CONFIG_URL",
    chain: "Import profile → connect → server push → disconnect executes command / applies PAC",
    mitigation: "Only import VPN profiles from trusted sources; block script pushes at MDM; monitor HKCU AutoConfigURL during VPN.",
    siblings: ["exploitarium-anydesk-printer-com-impersonation-poc", "exploitarium-systeminformer-phsvc-trusted-host-lpe-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/openvpn-connect-echo-script-ace-poc",
  },
  {
    slug: "exploitarium-php857-streambucket-soap-rce-rpoc",
    title: "PHP 8.5.7 StreamBucket SOAP Numeric Cookie RCE",
    tags: ["php", "deserialization", "soap", "exploitarium"],
    excerpt:
      "StreamBucket type confusion chains to fake HashTable write and zend_execute_internal hook — marker PHP857_RCE validated locally.",
    product: "PHP 8.5.7",
    impact: "Remote/locale-dependent RCE in PHP process parsing attacker-controlled SOAP path.",
    primitive: "Internal property confusion → HashTable overwrite → zif_system",
    chain: "rpoc.php StreamBucket trigger → overwrite_returned → marker file",
    mitigation: "Upgrade PHP when security release available; disable SOAP where unused.",
    siblings: ["exploitarium-flowise-mcp-env-case-bypass-poc", "exploitarium-floci-apigateway-vtl-rce-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/php857-streambucket-soap-rce-rpoc",
  },
  {
    slug: "exploitarium-rustdesk-session-permission-pocs",
    title: "RustDesk Session Downgrade + FileTransfer Scope Bypass",
    tags: ["rustdesk", "remote-desktop", "relay", "exploitarium"],
    excerpt:
      "Relay can force non-secure session after auth; FileTransfer-authorized sessions reach screen/input handlers gated only by broad authorized flag.",
    product: "rustdesk/rustdesk @ ff226f6d8013",
    impact: "Malicious relay injects control messages; FileTransfer session exceeds intended scope.",
    primitive: "Missing signed peer key fail-open + authorized vs connection-type check gap",
    chain: "Strip signed_id_pk → plaintext relay → inject MouseEvent OR FileTransfer auth → screen handlers",
    mitigation: "Use trusted rendezvous; harden secure session fail-closed; enforce per-connection-type authorization.",
    siblings: ["exploitarium-docker-cp-copyout-destination-escape", "exploitarium-anydesk-printer-com-impersonation-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/rustdesk-session-permission-pocs",
  },
  {
    slug: "exploitarium-systeminformer-phsvc-trusted-host-lpe-poc",
    title: "System Informer phsvc Trusted-Host LPE",
    tags: ["system-informer", "lpe", "alpc", "windows", "exploitarium"],
    excerpt:
      "phsvc accepts any Authenticode-trusted client image — code in rundll32 connects to SiSvcApiPort and runs elevated helper APIs.",
    product: "System Informer canary 4.0.26162.539",
    impact: "Medium user → elevated helper context arbitrary process creation when elevated instance live.",
    primitive: "Generic Authenticode trust instead of publisher-specific client validation",
    chain: "Load code in trusted signed host → ALPC to phsvc → privileged API invokes attacker command",
    mitigation: "Bind helper IPC to System Informer binary signature; run helper non-elevated by default.",
    siblings: ["exploitarium-anydesk-printer-com-impersonation-poc", "exploitarium-openvpn-connect-echo-script-ace-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/systeminformer-phsvc-trusted-host-lpe-poc",
  },
  {
    slug: "exploitarium-vlc-vp9-reschange-crash-poc",
    title: "VLC 3.0.23 VP9 Resolution-Change Crash",
    tags: ["vlc", "vp9", "crash", "exploitarium"],
    excerpt:
      "405-byte IVF 64×64 then 64×8192 frame hits stale slice-thread entries allocation — research ongoing toward stronger impact.",
    product: "VLC 3.0.23 Windows VP9 decoder",
    impact: "Denial of service / memory corruption primitive in VP9 resolution change path.",
    primitive: "sb_rows allocation too small for height change between frames",
    chain: "IVF frame1 64x64 → frame2 64x8192 → decoder uses stale entries buffer",
    mitigation: "Update VLC/FFmpeg VP9 builds; avoid autoplay of untrusted VP9 IVF.",
    siblings: ["exploitarium-ffmpeg-rasc-dlta-calc-poc"],
    gh: "https://github.com/bikini/exploitarium/tree/main/vlc-vp9-reschange-crash-poc",
  },
];

function subArticle(p) {
  const cveRow = p.cve
    ? `| CVE | ${p.cve} |\n`
    : "";
  const related = [
    `[Exploitarium collection](/signals/exploitarium-poc-collection)`,
    ...p.siblings.map((s) => `[${s.replace("exploitarium-", "").replace(/-/g, " ")}](/signals/${s})`),
  ].join("\n- ");

  return `---
title: "${p.title}"
slug: "${p.slug}"
date: ${DATE}
type: news
category: news
tags: [${p.tags.join(", ")}]
excerpt: "${p.excerpt}"
source: "Sploitus / Exploitarium"
sourceUrl: "https://sploitus.com/exploit?id=797EBD67-1F1D-52AD-9793-49716F32B20D"
draft: false
---

## Summary

${p.title} is one of 23 proof-of-concept folders in the [Exploitarium](/signals/exploitarium-poc-collection) collection indexed on [Sploitus](https://sploitus.com/exploit?id=797EBD67-1F1D-52AD-9793-49716F32B20D). OFFSITE.DARK summarizes the upstream README and PoC design; we did not discover or weaponize this flaw.

## Key Findings

| Finding | Detail |
|---------|--------|
| Product / target | ${p.product} |
${cveRow}| Primitive | ${p.primitive} |
| Impact | ${p.impact} |

## Attack Chain

\`\`\`text
${p.chain}
\`\`\`

## Mitigation

${p.mitigation}

## Related Signals

- ${related}

## Sources

- [Exploitarium — ${p.slug.replace("exploitarium-", "")}](${p.gh})
- [Sploitus — exploitarium umbrella](https://sploitus.com/exploit?id=797EBD67-1F1D-52AD-9793-49716F32B20D)
- [GitHub — bikini/exploitarium](https://github.com/bikini/exploitarium)
`;
}

function umbrellaArticle() {
  const rows = exploitariumSubs
    .map(
      (p) =>
        `| [${p.title}](/signals/${p.slug}) | \`${p.slug.replace("exploitarium-", "")}\` | ${p.impact.split(".")[0]} |`,
    )
    .join("\n");

  return `---
title: "Exploitarium — Consolidated PoC Research Collection"
slug: "exploitarium-poc-collection"
date: ${DATE}
type: news
category: news
tags: [sploitus, exploitarium, poc, research, collection]
excerpt: "Sploitus-indexed bikini/exploitarium bundles 23 standalone PoC repos — MotW chains, libssh2, FFmpeg, CI escape, and client RCE candidates."
source: "Sploitus"
sourceUrl: "https://sploitus.com/exploit?id=797EBD67-1F1D-52AD-9793-49716F32B20D"
draft: false
---

## Summary

[Exploitarium](https://github.com/bikini/exploitarium) is a consolidated archive of public proof-of-concept and vulnerability research by the researcher operating as **bikini** (Discord: ashdfrkl). Sploitus indexes the umbrella card ([797EBD67-1F1D-52AD-9793-49716F32B20D](https://sploitus.com/exploit?id=797EBD67-1F1D-52AD-9793-49716F32B20D)) with CVSS 5.8 as a collection entry. The GitHub repository now contains **23** self-contained folders — 12 migrated from former standalone repos with byte-identical Git tree verification (96 tracked entries, zero mismatches on 2026-06-23), plus 11 direct entries added through late June 2026.

The maintainer states fuzzing workflows were AI-assisted with human oversight, while PoC exploit code was hand-written (RustDesk excepted). README formatting is AI-assisted and reviewer-checked. Attribution note: the [objdump DLX](/signals/exploitarium-objdump-dlx-calc-poc) finding credits [4D4J/objdump-Out-Of-Bounds-write](https://github.com/4D4J/objdump-Out-Of-Bounds-write) as a stronger prior PoC.

OFFSITE.DARK indexes Exploitarium from Sploitus and upstream GitHub only.

## Key Findings

| Finding | Detail |
|---------|--------|
| Index source | [Sploitus exploitarium](https://sploitus.com/exploit?id=797EBD67-1F1D-52AD-9793-49716F32B20D) |
| Upstream repo | [bikini/exploitarium](https://github.com/bikini/exploitarium) |
| PoC count | 23 folders (GitHub HEAD); Sploitus card README still lists 12 from initial consolidation |
| Research focus | Archive/parser bugs, client trust boundaries, CI/container escapes, Windows LPE primitives |
| Disclosure stance | Open-disclosure research; explicit anti-abuse statement in upstream README |

## PoC Index

| Signal article | Folder | Primary impact |
|----------------|--------|----------------|
${rows}

## Methodology

Exploitarium entries follow a consistent research pattern:

1. **Target selection** — widely deployed clients, libraries, or infrastructure defaults (7-Zip, libssh2, Gitea Actions, OpenVPN Connect).
2. **Harnessed fuzzing** — maintainer reports automated fuzzing with strict harnesses (GPT-5.5-Codex-Spark cited) plus manual PoC refinement.
3. **Marker-only or calc proofs** — most Windows/Linux proofs use calculator, marker files, or GDB transcripts rather than weaponized shells.
4. **Source-traced writeups** — each folder ships README tables mapping functions, lines, and preconditions.
5. **Consolidation** — former per-CVE repos merged into one tree with Git blob ID verification.

## Attribution & Caveats

- Sploitus aggregation lags GitHub: the indexed card table shows 12 folders from the June 23 consolidation; GitHub HEAD includes 11 additional direct entries (\`c-ares\`, \`firefox-smartwindow\`, \`floci\`, \`ffmpeg\`, \`libssh2\` variants, \`nghttp2\`, \`nmap\`, \`php857\`, \`rustdesk\`, \`systeminformer\`).
- Several findings are **conditional** (Ghidra ACE, Lunar Modrinth end-to-end) or **harness-local** (c-ares UAF, libssh2 harness).
- \`cves.md\` in the repo lists CVE-2026-58049–58058 placeholders — not mapped 1:1 to every folder in this index.

## Related Signals (Sploitus top-10 cluster)

- [CVE-2026-48908 — SP Page Builder Joomla RCE](/signals/sp-page-builder-joomla-rce-cve-2026-48908)
- [Audiobookshelf auth bypass scanner](/signals/audiobookshelf-auth-bypass-cve-2025-25205)
- [CVE-2026-54806 — WP Activity Log POI](/signals/wp-activity-log-poi-cve-2026-54806)
- [TLS1.2 Exploit Scripts lab](/signals/tls12-exploit-scripts-pen-test-lab)
- [Peyara Remote Mouse RCE](/signals/peyara-remote-mouse-rce-1-0-1)
- [Log4J-PoC collection](/signals/log4j-poc-tpas-lab)
- [CVE-2026-49772 — Events Calendar SQLi](/signals/events-calendar-sqli-cve-2026-49772)
- [Dalfox found-action RCE](/signals/dalfox-found-action-rce-cve-2026-45087)
- [CVE-2026-2002 — Forminator XSS](/signals/forminator-stored-xss-cve-2026-2002)

## Mitigation (operators)

1. Treat Exploitarium appearance in weekly indexes as **bundle circulation signal** — prioritize patches for products you run that match folder names.
2. Do not assume one CVE per card — enumerate folders relevant to your asset inventory.
3. Hunt for PoC IOCs (marker paths, pipe names, default ports) in purple-team baselines, not just malware hashes.

## Sources

- [Sploitus — exploitarium](https://sploitus.com/exploit?id=797EBD67-1F1D-52AD-9793-49716F32B20D)
- [GitHub — bikini/exploitarium](https://github.com/bikini/exploitarium)
- [GitHub — exploitarium README](https://github.com/bikini/exploitarium/blob/main/README.md)
`;
}

const standalones = [
  {
    file: "audiobookshelf-auth-bypass-cve-2025-25205.md",
    slug: "audiobookshelf-auth-bypass-cve-2025-25205",
    title: "Audiobookshelf Unauthenticated API Auth Bypass Scanner (CVE-2025-25205)",
    tags: ["audiobookshelf", "auth-bypass", "cve-2025-25205", "metasploit", "scanner"],
    excerpt:
      "Metasploit auxiliary scanner detects unanchored regex auth bypass on /api/libraries — versions 2.17.0–2.19.0.",
    sourceUrl: "https://sploitus.com/?query=audiobookshelf",
    body: `## Summary

Sploitus lists **Audiobookshelf Unauthenticated API Authentication Bypass Scanner** in its weekly front-page cluster. The indexed artifact is Rapid7 Metasploit module \`auxiliary/scanner/http/audiobookshelf_auth_bypass\` ([PR #21565](https://github.com/rapid7/metasploit-framework/pull/21565)) detecting [CVE-2025-25205](https://github.com/advplyr/audiobookshelf/security/advisories/GHSA-pg8v-5jcv-wrvw) in [Audiobookshelf](https://www.audiobookshelf.org/) **2.17.0 – 2.19.0** (fixed **2.19.1**).

OFFSITE.DARK did not author the module; Sploitus is the index reference.

## Key Findings

| Finding | Detail |
|---------|--------|
| CVE | CVE-2025-25205 |
| Weakness | Unanchored regex on \`req.originalUrl\` vs \`req.path\` in \`server/Auth.js\` |
| Bypass primitive | Append whitelisted substring in query, e.g. \`/api/libraries?r=/api/items/1/cover\` |
| Scanner endpoint | Differential check on \`/api/libraries\` (crash-safe; avoids DoS routes) |
| Fixed version | 2.19.1 (anchored patterns + path matching) |

## Attack Chain

\`\`\`text
GET /api/libraries                    → 401 (baseline)
GET /api/libraries?r=/api/items/1/cover → 200/500 (handler runs without user)
Patched server                        → 401 to both
\`\`\`

Some routes referencing \`req.user\` without a session can **crash** the Node process (reflective DoS). The Metasploit module deliberately avoids those paths.

## Impact

- **Confidentiality** — protected library metadata reachable without credentials on vulnerable builds.
- **Availability** — crash-prone routes when auth bypass hits handlers expecting \`req.user\`.
- **Mass detection** — scanner module lowers bar for identifying exposed self-hosted media servers.

## Mitigation

1. Upgrade Audiobookshelf to **2.19.1+**.
2. Restrict network access to admin/API ports; do not expose ABS to the open internet without auth hardening.
3. WAF rule: flag \`/api/libraries\` requests with cover/image whitelist substrings in query parameters.

## Related Signals

- [Exploitarium collection](/signals/exploitarium-poc-collection)
- [CVE-2026-49772 — WordPress SQLi](/signals/events-calendar-sqli-cve-2026-49772)

## Sources

- [Metasploit — audiobookshelf_auth_bypass module](https://github.com/rapid7/metasploit-framework/blob/master/modules/auxiliary/scanner/http/audiobookshelf_auth_bypass.rb)
- [GitHub Advisory — GHSA-pg8v-5jcv-wrvw](https://github.com/advplyr/audiobookshelf/security/advisories/GHSA-pg8v-5jcv-wrvw)
- [NVD — CVE-2025-25205](https://nvd.nist.gov/vuln/detail/CVE-2025-25205)
- [Sploitus search — audiobookshelf](https://sploitus.com/?query=audiobookshelf)`,
  },
  {
    file: "wp-activity-log-poi-cve-2026-54806.md",
    slug: "wp-activity-log-poi-cve-2026-54806",
    title: "WP Activity Log PHP Object Injection to RCE (CVE-2026-54806)",
    tags: ["wordpress", "php", "deserialization", "cve-2026-54806", "rce"],
    excerpt:
      "Unauthenticated User-Agent POI stored in audit log; WP_HTML_Token gadget deserializes on admin dashboard view — blind RCE, CVSS 9.8.",
    sourceUrl: "https://sploitus.com/?query=CVE-2026-54806",
    body: `## Summary

[CVE-2026-54806](https://nvd.nist.gov/vuln/detail/CVE-2026-54806) is a critical unauthenticated PHP Object Injection in **WP Activity Log** (\`wp-security-audit-log\`) **≤ 5.6.3.1** (fixed **5.6.4**). Sploitus indexes [joshuavanderpoll/CVE-2026-54806](https://github.com/joshuavanderpoll/CVE-2026-54806) with CVSS **9.8**.

Attackers inject serialized objects via the **User-Agent** header on requests that generate audit events (e.g. failed login). Payloads persist in the database and deserialize when an administrator loads the dashboard — **blind RCE** (no output to attacker).

## Key Findings

| Finding | Detail |
|---------|--------|
| CVE | CVE-2026-54806 |
| Weakness | CWE-502 — deserialization of attacker-controlled audit log fields |
| Injection vector | User-Agent on unauthenticated logged events |
| Trigger | Admin visits WP Activity Log UI (deserialization on read) |
| Gadget chain | \`WP_HTML_Token\` (WP 6.4.0–6.4.1; public properties survive \`sanitize_text_field\` + 255-char column) |
| PoC features | \`--check\`, \`--command\`, \`--shell\`, \`--write-file\`; Docker lab with admin-bot |

## Attack Chain

\`\`\`text
Attacker: failed login + malicious User-Agent (serialized object)
        ↓
Plugin stores object in audit DB column
        ↓
Admin opens dashboard / log view
        ↓
Unsafe deserialization → RCE as web user (blind)
\`\`\`

## Impact

Full WordPress compromise when an administrator session triggers deserialization — typical path is waiting for organic admin traffic or social engineering. Comparable to other blind POI chains in audit/logging plugins.

## Mitigation

1. Upgrade WP Activity Log to **5.6.4+** immediately.
2. Block suspicious User-Agent patterns at WAF; monitor for serialized PHP object signatures in headers.
3. Assume breach if plugin ≤ 5.6.3.1 was internet-exposed: rotate salts, review admins, hunt web shells.

## Related Signals

- [CVE-2026-48908 — Joomla SP Page Builder](/signals/sp-page-builder-joomla-rce-cve-2026-48908)
- [CVE-2026-49772 — Events Calendar SQLi](/signals/events-calendar-sqli-cve-2026-49772)
- [CVE-2026-2002 — Forminator XSS](/signals/forminator-stored-xss-cve-2026-2002)

## Sources

- [GitHub — joshuavanderpoll/CVE-2026-54806](https://github.com/joshuavanderpoll/CVE-2026-54806)
- [Sploitus search — CVE-2026-54806](https://sploitus.com/?query=CVE-2026-54806)
- [NVD — CVE-2026-54806](https://nvd.nist.gov/vuln/detail/CVE-2026-54806)
- [Patchstack advisory](https://patchstack.com/database/wordpress/plugin/wp-security-audit-log/vulnerability/wordpress-wp-activity-log-plugin-5-6-3-1-php-object-injection-vulnerability)`,
  },
  {
    file: "tls12-exploit-scripts-pen-test-lab.md",
    slug: "tls12-exploit-scripts-pen-test-lab",
    title: "TLS1.2_Exploit-Scripts — Misconfigured TLS Pentest Lab",
    tags: ["tls", "tls1.2", "pentest", "education", "sploitus"],
    excerpt:
      "Six lab scripts demonstrate LOGJAM, LUCKY13, session ticket hijack, SSL strip, cert MITM, and RC4 JWT forgery against deliberate nginx 1.18 misconfig.",
    sourceUrl: "https://sploitus.com/?query=TLS1.2_Exploit-Scripts",
    body: `## Summary

**TLS1.2_Exploit-Scripts** ([MalekAlthubiany/TLS1.2_Exploit-Scripts](https://github.com/MalekAlthubiany/TLS1.2_Exploit-Scripts)) is a Sploitus front-page collection entry pairing six Python/Bash proofs with a deliberately vulnerable Docker nginx 1.18 lab. It accompanies the Medium article [*Breaking TLS 1.2: A Penetration Tester's Guide*](https://medium.com/@althubianymalek/breaking-tls-1-2-a-penetration-testers-guide-03913a2870e9).

This is **not a single CVE** — it is an educational misconfiguration exploitation kit for authorized assessments.

## Key Findings

| # | Script | CVE / topic | Demonstrated impact |
|---|--------|-------------|---------------------|
| 1 | \`exploit_01_logjam.py\` | CVE-2015-4000 | Passive DHE session decryption (1024-bit DH) |
| 2 | \`exploit_02_lucky13.py\` | CVE-2013-0169 | CBC+HMAC-SHA1 timing oracle |
| 3 | \`exploit_03_session_hijack.py\` | Session tickets | Stolen ticket → session reuse / cookie theft |
| 4 | \`exploit_04_sslstrip.py\` | Missing HSTS | Downgrade + credential capture proxy |
| 5 | \`exploit_05_cert_mitm.sh\` | Self-signed cert | Forged CA MITM on :9443 |
| 6 | \`exploit_06_jwt_forge.py\` | RC4 JWT | Keystream recovery → role escalation |

Lab defaults: TLS 1.2 only, CBC suites, 1024-bit DH, static STEK, no HSTS, RC4-signed JWT cookie.

## Attack Chain (representative — session hijack)

\`\`\`text
Victim TLS handshake → session ticket saved (openssl s_client -sess_out)
        ↓
Attacker replays ticket (-sess_in) without re-auth
        ↓
Server responds "Reused" → attacker HTTP GET steals Set-Cookie / JWT
\`\`\`

## Impact

For defenders, the repo signals **copy-paste TLS audit tooling** circulating on Sploitus — useful for purple teams, dangerous when operators mistake lab scripts for live exploit chains against hardened TLS 1.3 deployments.

For attackers, impact equals each underlying misconfiguration (recorded traffic decryption, strip, MITM) — only where those configs still exist in production.

## Mitigation

Ship the hardened nginx template from the upstream README: **4096-bit DH**, **AEAD-only ciphers**, **ssl_session_tickets off**, **HSTS preload**, **public CA certs**, **HS256/RS256 JWTs**.

## Related Signals

- [Exploitarium collection](/signals/exploitarium-poc-collection)
- [Log4J-PoC lab](/signals/log4j-poc-tpas-lab)

## Sources

- [GitHub — TLS1.2_Exploit-Scripts](https://github.com/MalekAlthubiany/TLS1.2_Exploit-Scripts)
- [Medium — Breaking TLS 1.2](https://medium.com/@althubianymalek/breaking-tls-1-2-a-penetration-testers-guide-03913a2870e9)
- [Sploitus search — TLS1.2_Exploit-Scripts](https://sploitus.com/?query=TLS1.2_Exploit-Scripts)`,
  },
  {
    file: "peyara-remote-mouse-rce-1-0-1.md",
    slug: "peyara-remote-mouse-rce-1-0-1",
    title: "Peyara Remote Mouse 1.0.1 Unauthenticated RCE",
    tags: ["peyara", "rce", "websocket", "windows", "remote-access"],
    excerpt:
      "WebSocket keyboard simulation on port 1313 chains to arbitrary commands; indexed PoCs include Python and LNK upload variants.",
    sourceUrl: "https://sploitus.com/?query=Peyara",
    body: `## Summary

**Peyara Remote Mouse v1.0.1** ([peyara-remote-mouse.vercel.app](https://peyara-remote-mouse.vercel.app/)) is an open-source Wi-Fi mouse/keyboard server for Windows/macOS/Linux. Sploitus indexes unauthenticated remote code execution PoCs ([capture0x/Peyara](https://github.com/capture0x/Peyara), [capture0x/Peyara-FileUpload](https://github.com/capture0x/Peyara-FileUpload)) demonstrating command execution via the **WebSocket command interface on port 1313** without authentication.

Upstream desktop client: [ayonshafiul/peyara-mouse-client](https://github.com/ayonshafiul/peyara-mouse-client). v1.0.1 is the vulnerable desktop line called out in indexed exploits (current site also lists v2.0.4 — verify version separately).

## Key Findings

| Finding | Detail |
|---------|--------|
| Affected version (indexed) | Peyara Remote Mouse **v1.0.1** (Windows) |
| Surface | WebSocket keyboard events + HTTP \`:1313/upload\` |
| Auth | None on command channel |
| PoC paths | Keyboard chaining to cmd/powershell; malicious LNK upload + execution |
| Attacker position | LAN or exposed 1313/tcp |

## Attack Chain

\`\`\`text
Connect ws://target:1313
        ↓
Send crafted keyboard event sequence (Win+R, cmd, commands…)
        ↓
Arbitrary command execution as desktop user
Alternate: POST /upload evil.lnk → trigger execution via keyboard automation
\`\`\`

## Impact

Full workstation compromise for users running the vulnerable server on reachable networks — common in home-lab and convenience-remote-desktop scenarios.

## Mitigation

1. Upgrade to a patched Peyara release if available; otherwise stop exposing port 1313 to untrusted networks.
2. Firewall block **1313/tcp** from non-management VLANs.
3. Inventory for Peyara/Remote Mouse listeners in enterprise egress and LAN scans.

## Related Signals

- [RustDesk session PoCs](/signals/exploitarium-rustdesk-session-permission-pocs)
- [AnyDesk printer LPE](/signals/exploitarium-anydesk-printer-com-impersonation-poc)

## Sources

- [GitHub — capture0x/Peyara](https://github.com/capture0x/Peyara)
- [GitHub — capture0x/Peyara-FileUpload](https://github.com/capture0x/Peyara-FileUpload)
- [Peyara Remote Mouse site](https://peyara-remote-mouse.vercel.app/)
- [Sploitus search — Peyara](https://sploitus.com/?query=Peyara)`,
  },
  {
    file: "log4j-poc-tpas-lab.md",
    slug: "log4j-poc-tpas-lab",
    title: "Log4J-PoC — TPAS Log4Shell Lab Stack",
    tags: ["log4j", "log4shell", "cve-2021-44228", "java", "sploitus"],
    excerpt:
      "Sploitus-indexed TPAS coursework repo: React storefront + vulnerable Log4j 2.14 Spring API + JNDI exploit script with WAF-bypass toggle.",
    sourceUrl: "https://sploitus.com/exploit?id=610F8853-5D6B-5E0E-AE66-904F64A7C2CE",
    body: `## Summary

Sploitus front-page entry **Log4J-PoC** maps to multiple Log4Shell-related cards; the primary indexed educational stack is [TPAS Log4Shell PoC](https://sploitus.com/exploit?id=610F8853-5D6B-5E0E-AE66-904F64A7C2CE) — a React e-commerce frontend plus **Spring Boot API on Log4j 2.14** with attacker \`init.sh\` scaffolding. CVSS **10.0** on the card reflects **CVE-2021-44228**, not a 2026 zero-day.

Related indexed material includes extended PoC trees ([bogdanspbm/log4j-pocs](https://github.com/bogdanspbm/log4j-pocs)) and detection writeups.

## Key Findings

| Finding | Detail |
|---------|--------|
| CVE | CVE-2021-44228 (Log4Shell) + related 2021 chain CVEs |
| Component | Apache Log4j 2.0-beta9 – 2.14.1 |
| Lab trigger | \`\${jndi:ldap://…}\` in search bar or HTTP headers |
| WAF simulation | Toggle sanitizes \`\\$\\{jndi:.*?\}\` — bypass payload with nested \`\${::-j}\` obfuscation included |
| Intent | FCUP TPAS master's coursework / authorized lab use |

## Attack Chain

\`\`\`text
Attacker LDAP/RMI server (init.sh) ← JNDI lookup from logged user input
        ↓
Log4j loads remote Java class
        ↓
RCE on Spring Boot host running vulnerable log4j-core
\`\`\`

## Impact

Legacy Log4j remains a high-value scanner target. Sploitus surfacing Log4J-PoC repos accelerates **mass JNDI injection attempts** against lagging Java estates — impact is full server compromise where patches were never applied.

## Mitigation

1. Upgrade Log4j to **2.17.1+** (or supported vendor-patched line).
2. Remove JndiLookup class only as emergency triage, not sole long-term control.
3. Block outbound LDAP/RMI from app subnets; monitor for \`\${jndi:\` patterns.

## Related Signals

- [TLS1.2 exploit lab](/signals/tls12-exploit-scripts-pen-test-lab)
- [Exploitarium collection](/signals/exploitarium-poc-collection)

## Sources

- [Sploitus — TPAS Log4Shell PoC](https://sploitus.com/exploit?id=610F8853-5D6B-5E0E-AE66-904F64A7C2CE)
- [GitHub — bogdanspbm/log4j-pocs](https://github.com/bogdanspbm/log4j-pocs)
- [NVD — CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228)`,
  },
  {
    file: "events-calendar-sqli-cve-2026-49772.md",
    slug: "events-calendar-sqli-cve-2026-49772",
    title: "The Events Calendar Unauthenticated SQLi (CVE-2026-49772)",
    tags: ["wordpress", "sqli", "cve-2026-49772", "the-events-calendar"],
    excerpt:
      "Broken REST validate_callback lets order reach ORDER BY — blind boolean/time extraction of wp_users hashes via tec/v1 API.",
    sourceUrl: "https://sploitus.com/exploit?id=4DC88245-D5D6-582C-AA2B-EE9293E136F3",
    body: `## Summary

CVE-2026-49772 is a critical (**CVSS 9.3**) unauthenticated blind SQL injection in WordPress plugin **The Events Calendar** **6.15.12 – 6.16.2** (fixed **6.16.3**). Sploitus indexes [joshuavanderpoll/CVE-2026-49772](https://github.com/joshuavanderpoll/CVE-2026-49772) ([card](https://sploitus.com/exploit?id=4DC88245-D5D6-582C-AA2B-EE9293E136F3)).

The experimental \`tec/v1\` REST route passes unsanitized \`order\` into SQL \`ORDER BY\` because \`validate_callback\` returns a closure instead of validating input.

## Key Findings

| Finding | Detail |
|---------|--------|
| CVE | CVE-2026-49772 |
| Endpoint | \`GET /wp-json/tec/v1/events?orderby=event_date&order=\` |
| Injection class | Read-only blind SQLi (boolean + time oracles) |
| Extractable data | \`wp_users\` hashes, session tokens, application passwords, options |
| Fixed version | 6.16.3 |

## Attack Chain

\`\`\`text
GET /wp-json/tec/v1/events?orderby=event_date&order=<injection>
        ↓
ORDER BY clause concatenation
        ↓
Boolean/time oracle extraction (--users, --recon, --query)
\`\`\`

## Impact

Full database read for unauthenticated attackers — credential material enables site takeover without write primitives.

## Mitigation

1. Update The Events Calendar to **6.16.3+**.
2. Block \`/wp-json/tec/v1/\` at WAF until patched.
3. Rotate passwords and application passwords if plugin was vulnerable and internet-exposed.

## Related Signals

- [CVE-2026-54806 — WP Activity Log POI](/signals/wp-activity-log-poi-cve-2026-54806)
- [CVE-2026-2002 — Forminator XSS](/signals/forminator-stored-xss-cve-2026-2002)
- [CVE-2026-48908 — Joomla RCE](/signals/sp-page-builder-joomla-rce-cve-2026-48908)

## Sources

- [Sploitus — CVE-2026-49772](https://sploitus.com/exploit?id=4DC88245-D5D6-582C-AA2B-EE9293E136F3)
- [GitHub — joshuavanderpoll/CVE-2026-49772](https://github.com/joshuavanderpoll/CVE-2026-49772)
- [GHSA-v796-wqfq-j4xh](https://github.com/advisories/GHSA-v796-wqfq-j4xh)
- [NVD — CVE-2026-49772](https://nvd.nist.gov/vuln/detail/CVE-2026-49772)`,
  },
  {
    file: "dalfox-found-action-rce-cve-2026-45087.md",
    slug: "dalfox-found-action-rce-cve-2026-45087",
    title: "Dalfox Found-Action Deserialization RCE (CVE-2026-45087)",
    tags: ["dalfox", "xss", "rce", "cve-2026-45087", "go"],
    excerpt:
      "dalfox server mode POST /scan accepts FoundAction/FoundActionShell in JSON — unauthenticated RCE on 0.0.0.0:6664 when no --api-key.",
    sourceUrl: "https://sploitus.com/?query=dalfox",
    body: `## Summary

Sploitus lists **Dalfox Found-Action Deserialization RCE** in its weekly top cluster. The underlying flaw is [CVE-2026-45087](https://nvd.nist.gov/vuln/detail/CVE-2026-45087) — critical (**CVSS 10.0**) unauthenticated command execution in [Dalfox](https://github.com/hahwul/dalfox) **< 2.13.0** when run as \`dalfox server\`.

\`POST /scan\` deserializes attacker \`model.Options\`, including \`FoundAction\` and \`FoundActionShell\`. \`foundAction()\` runs \`exec.Command(shell, "-c", cmd)\` whenever any finding fires — attackers supply both the target URL and the command, trivially guaranteeing a hit via a one-line reflective XSS server.

## Key Findings

| Finding | Detail |
|---------|--------|
| CVE | CVE-2026-45087 |
| Mode | REST API server only (\`dalfox server\`) |
| Default bind | \`0.0.0.0:6664\` without \`--api-key\` |
| Weakness | CWE-15 — external control of execution options via JSON |
| Fixed version | **2.13.0** (strips FoundAction fields from API input) |

## Attack Chain

\`\`\`text
POST /scan { "url": "http://attacker/reflect", "options": { "found-action": "id", "found-action-shell": "/bin/sh" } }
        ↓
Dalfox scans → finds reflected XSS on attacker URL
        ↓
foundAction() executes attacker command as dalfox process user
\`\`\`

## Impact

Internet-exposed Dalfox servers become full-compromise hosts — common misuse includes leaving scanner daemons on CI or bug-bounty VPS images.

## Mitigation

1. Upgrade to Dalfox **2.13.0+**.
2. Never expose \`dalfox server\` publicly; bind \`127.0.0.1\` and require \`--api-key\`.
3. Hunt for \`POST /scan\` with \`found-action\` / \`found-action-shell\` in HTTP logs.

## Related Signals

- [Exploitarium — Flowise MCP bypass](/signals/exploitarium-flowise-mcp-env-case-bypass-poc)
- [CVE-2026-49772 — WordPress SQLi](/signals/events-calendar-sqli-cve-2026-49772)

## Sources

- [GHSA-v25v-m36w-jp4h](https://github.com/hahwul/dalfox/security/advisories/GHSA-v25v-m36w-jp4h)
- [NVD — CVE-2026-45087](https://nvd.nist.gov/vuln/detail/CVE-2026-45087)
- [Sploitus search — dalfox](https://sploitus.com/?query=dalfox)`,
  },
  {
    file: "forminator-stored-xss-cve-2026-2002.md",
    slug: "forminator-stored-xss-cve-2026-2002",
    title: "Forminator Stored XSS via form_name (CVE-2026-2002)",
    tags: ["wordpress", "xss", "cve-2026-2002", "forminator"],
    excerpt:
      "wp_kses_post runs before forminator_replace_variables — javascript: in form_name bypasses sanitization; CVSS 4.4.",
    sourceUrl: "https://sploitus.com/exploit?id=7DF60A36-5B48-59EB-A46D-66756D01D7E4",
    body: `## Summary

CVE-2026-2002 is a stored cross-site scripting flaw in **Forminator** WordPress plugin **≤ 1.50.2**. Sploitus indexes [typedefabcd1234ntd/CVE-2026-2002-poc](https://github.com/typedefabcd1234ntd/CVE-2026-2002-poc) ([card](https://sploitus.com/exploit?id=7DF60A36-5B48-59EB-A46D-66756D01D7E4)) with CVSS **4.4**.

Root cause: \`wp_kses_post()\` sanitizes HTML field content **before** \`forminator_replace_variables()\` substitutes \`{form_name}\`, allowing a user with form-edit capability to place \`javascript:\` in \`form_name\` that survives into rendered output.

## Key Findings

| Finding | Detail |
|---------|--------|
| CVE | CVE-2026-2002 |
| Parameter | \`form_name\` via variable replacement in HTML fields |
| Auth | Users with Edit Form privilege (can be delegated below admin) |
| Vector | \`CVSS:3.1/AV:N/AC:H/PR:H/UI:N/S:C/C:L/I:L/A:N\` |
| Logic bug | Sanitize-then-substitute ordering inversion |

## Attack Chain

\`\`\`text
Attacker edits form: HTML field contains <a href="{form_name}">
        ↓
form_name set to javascript:alert(1)
        ↓
wp_kses_post passes (no script tags in field yet)
        ↓
Variable replacement injects javascript: URL → XSS on view
\`\`\`

## Impact

Session hijack or admin actions in context of users viewing poisoned forms — severity limited by high-privilege prerequisite but notable as logic-order bug.

## Mitigation

1. Update Forminator past **1.50.2** when vendor fix available.
2. Restrict form-management capability; CSP on wp-admin.
3. Code review pattern: never substitute user variables after sanitization.

## Related Signals

- [CVE-2026-49772 — Events Calendar SQLi](/signals/events-calendar-sqli-cve-2026-49772)
- [CVE-2026-54806 — WP Activity Log POI](/signals/wp-activity-log-poi-cve-2026-54806)

## Sources

- [Sploitus — CVE-2026-2002](https://sploitus.com/exploit?id=7DF60A36-5B48-59EB-A46D-66756D01D7E4)
- [GitHub — CVE-2026-2002-poc](https://github.com/typedefabcd1234ntd/CVE-2026-2002-poc)
- [NVD — CVE-2026-2002](https://nvd.nist.gov/vuln/detail/CVE-2026-2002)`,
  },
];

function frontmatter(s) {
  return `---
title: "${s.title}"
slug: "${s.slug}"
date: ${DATE}
type: news
category: news
tags: [${s.tags.join(", ")}]
excerpt: "${s.excerpt}"
source: "Sploitus"
sourceUrl: "${s.sourceUrl}"
draft: false
---

${s.body}`;
}

const created = [];

fs.writeFileSync(path.join(OUT, "exploitarium-poc-collection.md"), umbrellaArticle());
created.push("exploitarium-poc-collection.md");

for (const p of exploitariumSubs) {
  const f = `${p.slug}.md`;
  fs.writeFileSync(path.join(OUT, f), subArticle(p));
  created.push(f);
}

for (const s of standalones) {
  fs.writeFileSync(path.join(OUT, s.file), frontmatter(s));
  created.push(s.file);
}

console.log(created.join("\n"));
console.log(`\nTotal: ${created.length} files`);
