export interface ToolLink {
  name: string;
  href: string;
  description: string;
  tags?: string[];
}

export const POPULAR_TOOLS: ToolLink[] = [
  {
    name: "Nmap",
    href: "https://nmap.org/",
    description:
      "Network mapper. SYN/UDP scanning, service detection, NSE scripts, and OS fingerprinting. The baseline recon tool.",
    tags: ["recon", "scanning"],
  },
  {
    name: "Burp Suite",
    href: "https://portswigger.net/burp",
    description:
      "HTTP/S intercepting proxy. Repeater, Intruder, scanner, and extension API for web app testing.",
    tags: ["web", "proxy"],
  },
  {
    name: "Wireshark",
    href: "https://www.wireshark.org/",
    description:
      "Packet dissector. Live capture and PCAP analysis with display filters and protocol decoders.",
    tags: ["network", "forensics"],
  },
  {
    name: "BloodHound",
    href: "https://github.com/SpecterOps/BloodHound",
    description:
      "AD attack path analysis. Ingests ACL/ACE and group membership into a graph of privilege escalation routes.",
    tags: ["ad", "graph"],
  },
  {
    name: "Cobalt Strike",
    href: "https://www.cobaltstrike.com/",
    description:
      "Commercial adversary simulation platform. Beacon C2, malleable profiles, team server. Licensed red-team software.",
    tags: ["c2", "commercial"],
  },
  {
    name: "Hashcat",
    href: "https://hashcat.net/hashcat/",
    description:
      "GPU password recovery. Rule and mask attacks across hundreds of hash formats.",
    tags: ["cracking"],
  },
  {
    name: "Impacket",
    href: "https://github.com/fortra/impacket",
    description:
      "Python protocol implementations. secretsdump, psexec, getTGT, and SMB/Kerberos tooling for Windows networks.",
    tags: ["ad", "python"],
  },
  {
    name: "Ghidra",
    href: "https://ghidra-sre.org/",
    description:
      "Reverse engineering IDE. Disassembly, decompilation, scripting, and binary diffing.",
    tags: ["reversing"],
  },
  {
    name: "YARA",
    href: "https://virustotal.github.io/yara/",
    description:
      "Malware identification language. String/hex patterns with boolean conditions over scanned files.",
    tags: ["malware", "detection"],
  },
  {
    name: "Volatility",
    href: "https://github.com/volatilityfoundation/volatility3",
    description:
      "Memory forensics. Extract processes, credentials, network connections, and kernel artifacts from RAM dumps.",
    tags: ["forensics", "memory"],
  },
  {
    name: "Nuclei",
    href: "https://github.com/projectdiscovery/nuclei",
    description:
      "Template scanner. YAML checks for CVEs, misconfigs, and exposed services at scale.",
    tags: ["scanner", "automation"],
  },
  {
    name: "SIF",
    href: "https://github.com/vmfunc/sif",
    description:
      "Go recon-to-exploit scanner in one static binary. Shared HTTP client, 25+ scan modules, nuclei compiled in. Pipelines from stdin.",
    tags: ["recon", "scanner", "automation"],
  },
  {
    name: "SQLMap",
    href: "https://sqlmap.org/",
    description:
      "SQL injection automation. DB fingerprinting, data dump, file read, and OS command execution via SQLi.",
    tags: ["web", "injection"],
  },
];

export const EXTERNAL_LINKS: ToolLink[] = [
  {
    name: "Church of Malware",
    href: "https://churchofmalware.org/#scripture",
    description:
      "Curated malware corpus and reference library. Indexed samples, writeups, and scripture-style documentation for researchers tracing lineage and behavior.",
  },
  {
    name: "VX Underground",
    href: "https://vx-underground.org/",
    description:
      "Malware archive and threat intel repository. Historical samples, papers, and community-sourced collections. Primary source for offline malware research.",
  },
  {
    name: "Sploitus",
    href: "https://sploitus.com/",
    description:
      "Exploit and tool search engine. Aggregates Exploit-DB, GitHub PoCs, and Metasploit modules into one query interface.",
  },
  {
    name: "Shannon",
    href: "https://github.com/KeygraphHQ/shannon",
    description:
      "White-box web pentester from Keygraph. Reads source repos, maps attack surfaces, runs browser and CLI exploits in Docker workers. Reports only validated PoCs. AGPL CLI; targets Injection, XSS, SSRF, auth, and authorization flaws.",
    tags: ["pentest", "agent"],
  },
  {
    name: "Keygraph",
    href: "https://keygraph.io/",
    description:
      "Commercial AppSec platform built on Shannon. Code Property Graph SAST, continuous pentest runs, finding deduplication, auto-remediation PRs with re-test verification. Self-hosted and air-gapped deployment.",
    tags: ["platform", "commercial"],
  },
];

export const METASPLOIT_SECTION = {
  href: "https://www.metasploit.com/",
  overview:
    "Metasploit Framework is a modular exploitation platform maintained by Rapid7 and the open-source community. Ruby runtime, PostgreSQL database for workspace state, and a unified module interface for the full attack lifecycle.",
  modules: [
    {
      type: "exploit",
      description:
        "Deliver payloads against vulnerable services. Targets specific CVEs or logic bugs with configurable options (RHOST, RPORT, target index).",
    },
    {
      type: "payload",
      description:
        "Shellcode staged or single. Meterpreter (reflective DLL), reverse/bind TCP, HTTPS, and custom stagers. msfvenom generates standalone binaries and shellcode.",
    },
    {
      type: "auxiliary",
      description:
        "Scanning, fuzzing, credential brute-force, and info gathering without delivering a payload. Example: auxiliary/scanner/smb/smb_version.",
    },
    {
      type: "encoder",
      description:
        "Transform shellcode to evade bad-char filters and naive AV. x86/shikata_ga_nai is the default polymorphic encoder.",
    },
    {
      type: "nop",
      description:
        "NOP sled generators for buffer overflow alignment. Platform-specific opcode sequences.",
    },
    {
      type: "post",
      description:
        "Post-exploitation on established sessions. Hash dump, pivot, persistence, privilege escalation modules.",
    },
    {
      type: "evasion",
      description:
        "Windows-specific bypass techniques for AMSI, AppLocker, and ETW prior to payload delivery.",
    },
  ],
  interfaces: [
    {
      name: "msfconsole",
      description:
        "Interactive REPL. search, use, set, run, sessions, routes. Tab completion and resource script execution (-r).",
    },
    {
      name: "msfvenom",
      description:
        "Payload generator CLI. -p payload, -f format (exe, elf, raw, ps1), encoders, badchars, iterations.",
    },
    {
      name: "resource scripts",
      description:
        "Automated command sequences (.rc files). Chain recon, exploit, and post modules for repeatable engagements.",
    },
    {
      name: "msfdb / workspace",
      description:
        "PostgreSQL-backed state. Hosts, services, creds, loot, and session history persist across runs.",
    },
  ],
};
