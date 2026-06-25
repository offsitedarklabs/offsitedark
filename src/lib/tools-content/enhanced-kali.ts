import type { ToolEnrichment } from "./types";

/** Enhanced content for Kali packages present in content/tools/kali.json (baseline tier). */
export const ENHANCED_KALI_CONTENT: Record<string, ToolEnrichment> = {
  cewl: {
    overview: [
      "CeWL spiders a target site and builds a custom wordlist from visible text, depth-limited for scope control.",
      "Useful when org-specific jargon appears on public pages—names, product codenames, and footer text end up in cracked passwords.",
    ],
    useCases: ["Custom wordlist generation from corporate site", "OSINT password list prep before hashcat"],
    commands: [{ label: "Spider site", code: "cewl -d 2 -m 5 -w corp_words.txt https://target.example.com" }],
    related: ["hashcat", "crunch", "cupp"],
  },
  dirb: {
    overview: [
      "dirb brute-forces web paths against HTTP/S servers using wordlists. Predate gobuster/ffuf but still packaged on Kali.",
      "Supports cookies, headers, and extension appending. `-o` writes results; `-r` skips non-existent pages recursively.",
    ],
    useCases: ["Directory discovery on legacy assessments", "Backup and config file hunting"],
    commands: [{ label: "Scan with common list", code: "dirb https://target.example.com /usr/share/wordlists/dirb/common.txt" }],
    related: ["nikto", "nuclei"],
  },
  exploitdb: {
    overview: [
      "Kali metapackage for Exploit-DB offline mirror used by searchsploit. `/usr/share/exploitdb` holds PoCs referenced by CVE and product name.",
      "Update with `searchsploit -u` before engagements to pull latest public exploits.",
    ],
    useCases: ["Offline PoC lookup", "Air-gapped exploit reference"],
    related: ["searchsploit", "metasploit", "sploitus"],
  },
  set: {
    overview: [
      "Social-Engineer Toolkit automates spear-phishing, credential harvester clones, SMS/infectious media, and Metasploit payload delivery.",
      "Modular menus for authorized social engineering exercises—clone sites, harvest POST creds, generate USB/autorun payloads.",
    ],
    useCases: ["Phishing simulation with cloned login portals", "Credential harvesting lab demos"],
    related: ["metasploit", "beef-xss"],
  },
  kismet: {
    overview: [
      "Kismet passive wireless IDS captures 802.11 management frames, probes, and hidden SSIDs without transmitting deauth.",
      "Logs to pcapng; pairs with Wireshark for deep 802.11 analysis. Requires monitor-capable NIC.",
    ],
    useCases: ["Passive WiFi recon on authorized surveys", "Detecting rogue APs and probe requests"],
    related: ["aircrack-ng", "wireshark"],
  },
  cowpatty: {
    overview: [
      "cowpatty cracks WPA-PSK using precomputed rainbow tables or wordlist + SSID as salt. Largely superseded by hashcat mode 22000.",
      "Still useful when rainbow tables already exist for target SSID.",
    ],
    useCases: ["WPA-PSK audit with genpmk tables"],
    commands: [{ label: "Wordlist attack", code: "cowpatty -f wordlist.txt -r capture.dump -s SSID" }],
    related: ["aircrack-ng", "hashcat"],
  },
  fcrackzip: {
    overview: [
      "fcrackzip brute-forces ZIP archive passwords. `-b` brute, `-D` dictionary, `-u` unzip verify.",
    ],
    useCases: ["Cracking password-protected ZIPs from OSINT or exfil"],
    commands: [{ label: "Dictionary attack", code: "fcrackzip -u -D -p wordlist.txt file.zip" }],
    related: ["hashcat", "john"],
  },
  ophcrack: {
    overview: [
      "ophcrack cracks Windows NTLM hashes using rainbow tables (XP/Vista/7 tables bundled). LiveCD mode for offline SAM recovery.",
      "Less relevant on modern Windows with strong passwords but still packaged for legacy IR.",
    ],
    useCases: ["Offline Windows password recovery with tables"],
    related: ["hashcat", "chntpw"],
  },
  chntpw: {
    overview: [
      "chntpw edits Windows SAM database offline: clear passwords, promote users to admin, unlock accounts. Boot from Kali live or mount disk image.",
    ],
    useCases: ["Offline local admin password reset in lab IR", "Registry/SAM forensics"],
    related: ["ophcrack", "hashcat"],
  },
  chkrootkit: {
    overview: [
      "chkrootkit scans for known rootkit strings, LKM trojans, and suspicious `ifconfig`/`netstat` replacements on Linux.",
      "Signature-based; complement with rkhunter and live response—not definitive on modern kernel rootkits.",
    ],
    useCases: ["Quick rootkit indicator scan on Linux servers"],
    related: ["rkhunter", "volatility3"],
  },
  clamav: {
    overview: [
      "ClamAV open-source AV engine. `clamscan -r` recursive directory scan; `freshclam` updates signatures.",
      "Useful for bulk malware triage on file shares and email gateways in lab pipelines.",
    ],
    useCases: ["Batch file scanning", "Signature baseline before YARA deep dive"],
    commands: [{ label: "Recursive scan", code: "clamscan -r --bell -i /path/to/samples" }],
    related: ["yara", "ghidra"],
  },
  curl: {
    overview: [
      "curl transfers data over HTTP/S, FTP, SMB, and dozens of protocols. Pentesters use it for quick header inspection, API probing, and download without browser overhead.",
    ],
    useCases: ["Manual HTTP header and method testing", "Downloading payloads and wordlists in scripts"],
    commands: [{ label: "Verbose headers", code: "curl -v -X POST https://target/api -d '{\"k\":\"v\"}' -H 'Content-Type: application/json'" }],
    related: ["burp-suite", "wget"],
  },
  dns2tcp: {
    overview: [
      "dns2tcp tunnels TCP connections over DNS queries—useful when only DNS egress is allowed from compromised hosts.",
      "Requires attacker-controlled domain with NS records pointing to your server.",
    ],
    useCases: ["DNS tunnel pivot in restrictive egress scenarios"],
    related: ["iodine", "chisel"],
  },
  vlan: {
    overview: [
      "802.1Q VLAN hopping and tagging utilities on Kali for switch security assessments. Test DTP and double-tagging misconfigs on authorized gear.",
    ],
    useCases: ["VLAN segmentation validation", "Switch misconfiguration audits"],
    related: ["nmap", "wireshark"],
  },
  tiger: {
    overview: [
      "Tiger Unix security audit script checks passwd/group, permissions, inetd, and known misconfigs. Older host-hardening baseline tool.",
    ],
    useCases: ["Legacy Linux host configuration audit"],
    related: ["lynis", "chkrootkit"],
  },
  aflplusplus: {
    overview: [
      "AFL++ fuzzes binaries with coverage-guided mutation. Compiler wrappers (afl-gcc-fast) instrument targets; corpus minimization with afl-cmin.",
      "Used in vuln research and binary hardening validation—not attack tooling per se.",
    ],
    useCases: ["Coverage-guided fuzzing of parsers and daemons", "Crash triage for CVE research"],
    related: ["ghidra", "radare2"],
  },
  bruteshark: {
    overview: [
      "BruteShark extracts credentials, hashes, and files from PCAPs—similar to NetworkMiner but focused on hash extraction and session parsing.",
    ],
    useCases: ["PCAP credential extraction during IR", "NTLM/Kerberos hash harvesting from captures"],
    related: ["wireshark", "responder"],
  },
  capstone: {
    overview: [
      "Capstone multi-arch disassembly framework. Library backend for radare2, Ghidra plugins, and Python bindings (capstone module).",
    ],
    useCases: ["Lightweight disassembly in custom scripts", "Supporting RE toolchain on Kali"],
    related: ["radare2", "ghidra"],
  },
  bind9: {
    overview: [
      "ISC BIND9 DNS server/client utilities on Kali: dig, nsupdate, host, rndc. dig is the primary DNS recon and troubleshooting CLI.",
    ],
    useCases: ["DNS record enumeration", "Zone transfer testing (dig axfr)"],
    commands: [{ label: "Zone transfer attempt", code: "dig axfr @ns1.example.com example.com" }],
    related: ["dnsrecon", "theharvester"],
  },
  "bulk-extractor": {
    overview: [
      "bulk_extractor carves email addresses, URLs, credit cards, and other features from disk images without full filesystem parsing—fast triage on large media.",
    ],
    useCases: ["Large disk triage in forensics", "Feature scanning on raw images"],
    related: ["autopsy", "foremost"],
  },
  "cisco-auditing-tool": {
    overview: [
      "CAT (Cisco Auditing Tool) brute-forces default and wordlist credentials against Cisco devices via Telnet/SSH.",
    ],
    useCases: ["Legacy Cisco default credential audits (authorized)"],
    related: ["nmap", "hydra"],
  },
  "cisco-global-exploiter": {
    overview: [
      "CGE bundles public Cisco IOS exploit scripts from early 2000s research. Historical reference; most targets patched decades ago.",
    ],
    useCases: ["Legacy IOS lab exploitation research"],
    related: ["metasploit", "nmap"],
  },
  "cloud-enum": {
    overview: [
      "cloud-enum discovers AWS/Azure/GCP resources from OSINT: open buckets, mislisted storage, and subdomain permutations.",
    ],
    useCases: ["Cloud asset discovery during external ASM"],
    related: ["amass", "subfinder"],
  },
  arpwatch: {
    overview: [
      "arpwatch logs MAC/IP pair changes on LAN—detects ARP spoofing and rogue devices passively.",
    ],
    useCases: ["MITM detection on monitored segments"],
    defense: ["Deploy on critical VLANs; alert on pair flips"],
    related: ["ettercap", "wireshark"],
  },
  asleap: {
    overview: [
      "asleap cracks Cisco LEAP and PPTP MS-CHAPv2 offline after capturing challenge/response exchanges.",
    ],
    useCases: ["Legacy wireless LEAP assessment"],
    related: ["aircrack-ng", "hashcat"],
  },
  atftp: {
    overview: [
      "atftp client/server for TFTP—often abused for firmware exfil or rogue TFTP in internal networks where UDP/69 is open.",
    ],
    useCases: ["TFTP file pull from network devices", "Testing unauthenticated TFTP writes"],
    related: ["nmap"],
  },
  "atomic-operator": {
    overview: [
      "Atomic Red Team operator utilities for running ATT&CK technique tests. Maps to atomics YAML for purple-team validation.",
    ],
    useCases: ["Controlled technique execution for detection tuning"],
    related: ["metasploit", "powershell"],
  },
  ccrypt: {
    overview: [
      "ccrypt encrypts files with AES-256. ctr mode streaming. Used for securing loot at rest during engagements—not for breaking encryption.",
    ],
    useCases: ["Encrypting collected evidence on operator box"],
    related: ["gpg"],
  },
  chirp: {
    overview: [
      "CHIRP programs amateur radio hardware. Niche RF tooling on Kali for authorized wireless research outside WiFi bands.",
    ],
    useCases: ["Radio programming in RF security labs"],
    related: ["kismet"],
  },
  chromium: {
    overview: [
      "Chromium browser on Kali for testing without proprietary Chrome. Configure proxy to Burp for web assessments.",
    ],
    useCases: ["Browser-based testing with proxy chains"],
    related: ["burp-suite"],
  },
  "cifs-utils": {
    overview: [
      "mount.cifs and smbclient-adjacent utilities for accessing Windows shares from Linux. `smbclient` often preferred for pentest scripts.",
    ],
    useCases: ["Manual SMB share access and mount"],
    related: ["crackmapexec", "impacket"],
  },
  colly: {
    overview: [
      "Colly Go web scraping framework packaged for reference. Used in custom crawlers feeding recon pipelines.",
    ],
    useCases: ["Building custom site spiders"],
    related: ["cewl", "theharvester"],
  },
  crack: {
    overview: [
      "Classic `crack` password cracker for Unix crypt hashes. Largely superseded by john and hashcat.",
    ],
    useCases: ["Legacy crypt(3) hash recovery"],
    related: ["john", "hashcat"],
  },
  davtest: {
    overview: [
      "davtest uploads executable extensions to WebDAV shares to identify allowed script execution.",
    ],
    useCases: ["WebDAV misconfiguration testing"],
    related: ["nikto", "nuclei"],
  },
  dotdotpwn: {
    overview: [
      "dotdotpwn fuzzes path traversal payloads across HTTP/FTP/TFTP and other protocols with depth and encoding variants.",
    ],
    useCases: ["Directory traversal fuzzing"],
    related: ["ffuf", "burp-suite"],
  },
  dmitry: {
    overview: [
      "DMitry deepmagic information gathering: WHOIS, netcraft, subdomains, email, and TCP port scan in one CLI.",
    ],
    useCases: ["All-in-one OSINT pass on a domain"],
    related: ["theharvester", "recon-ng"],
  },
  dnsenum: {
    overview: [
      "dnsenum combines zone transfer attempts, Google scraping, and subdomain brute-force for DNS recon.",
    ],
    useCases: ["Active DNS enumeration on in-scope domains"],
    commands: [{ label: "Full enum", code: "dnsenum example.com" }],
    related: ["dnsrecon", "subfinder"],
  },
  dnsrecon: {
    overview: [
      "dnsrecon runs std/brute/bax/zonewalk DNS recon modes with XML/JSON export for reporting pipelines.",
    ],
    useCases: ["Structured DNS recon output"],
    commands: [{ label: "Standard scan", code: "dnsrecon -d example.com -t std" }],
    related: ["dnsenum", "amass"],
  },
  fierce: {
    overview: [
      "fierce scans adjacent IP space and DNS for related domains—legacy but lightweight subdomain discovery.",
    ],
    useCases: ["Finding nearby domains in same netblock"],
    related: ["dnsenum", "theharvester"],
  },
  fragroute: {
    overview: [
      "fragroute intercepts and modifies outbound traffic: fragmentation, TTL, and reordering to test IDS/IPS and fragile stacks.",
    ],
    useCases: ["IDS evasion testing in lab networks"],
    related: ["nmap", "hping3"],
  },
  fragrouter: {
    overview: [
      "fragrouter performs IP fragmentation attacks for firewall/IDS evasion research—authorized lab use only.",
    ],
    useCases: ["Fragmentation-based evasion testing"],
    related: ["fragroute", "nmap"],
  },
  "gpp-decrypt": {
    overview: [
      "Decrypts Group Policy Preferences cpassword fields from SYSVOL XML—legacy MS14-025 misconfig still found on old domains.",
    ],
    useCases: ["GPP password recovery on unpatched AD"],
    related: ["impacket", "bloodhound"],
  },
  hashid: {
    overview: [
      "hashid identifies hash types for hashcat mode selection from hash format patterns.",
    ],
    useCases: ["Unknown hash type triage"],
    commands: [{ label: "Identify", code: "hashid -m hash.txt" }],
    related: ["hashcat", "name-that-hash"],
  },
  httprint: {
    overview: [
      "httprint fingerprints web servers by sending crafted requests and matching response signatures.",
    ],
    useCases: ["Web server version fingerprinting when nmap http-enum is inconclusive"],
    related: ["nmap", "whatweb"],
  },
  httprobe: {
    overview: [
      "httprobe filters hostnames to live HTTP/S services—pipeline glue in recon chains.",
    ],
    useCases: ["Pre-nuclei URL filtering"],
    related: ["nuclei", "httpx"],
  },
  iodine: {
    overview: [
      "iodine tunnels IPv4 over DNS (A, TXT, CNAME). Alternative to dns2tcp for restrictive egress.",
    ],
    useCases: ["DNS tunnel C2 in lab pivot scenarios"],
    related: ["dns2tcp", "chisel"],
  },
  irpas: {
    overview: [
      "IRPAS Cisco protocol attack suite: CDP, IGP, HSRP, and routing protocol manipulation on legacy networks.",
    ],
    useCases: ["Cisco routing protocol security assessments"],
    related: ["nmap", "wireshark"],
  },
  lbd: {
    overview: [
      "lbd (load balancer detector) identifies load-balanced HTTP/S backends via verb/header differential analysis.",
    ],
    useCases: ["Finding real IPs behind load balancers"],
    related: ["nmap", "burp-suite"],
  },
  lynis: {
    overview: [
      "Lynis audits Unix systems for hardening gaps: kernel, auth, file permissions, and compliance controls.",
    ],
    useCases: ["Host hardening baseline on Linux servers"],
    related: ["tiger", "chkrootkit"],
  },
  macchanger: {
    overview: [
      "macchanger randomizes or sets interface MAC addresses for wireless lab work and privacy on untrusted networks.",
    ],
    useCases: ["MAC randomization before WiFi assessments"],
    related: ["aircrack-ng", "kismet"],
  },
  maltego: {
    overview: [
      "Maltego CE visualizes OSINT transforms linking domains, emails, people, and infrastructure. Transform hub requires accounts for some sources.",
    ],
    useCases: ["Graph-based OSINT investigations"],
    related: ["theharvester", "recon-ng"],
  },
  mdk3: {
    overview: [
      "mdk3 WiFi stress tool: beacon flood, auth DoS, and deauthentication—legal only on owned lab APs.",
    ],
    useCases: ["802.11 resilience testing in isolated labs"],
    related: ["aircrack-ng", "wifite"],
  },
  mdk4: {
    overview: [
      "mdk4 successor to mdk3 with additional WiFi attack modes and improved drivers support.",
    ],
    useCases: ["Wireless denial-of-service testing (authorized lab)"],
    related: ["mdk3", "aircrack-ng"],
  },
  nbtscan: {
    overview: [
      "nbtscan NetBIOS name scanning across subnets—finds Windows workgroups and machine names via UDP/137.",
    ],
    useCases: ["Legacy Windows network discovery"],
    commands: [{ label: "Scan subnet", code: "nbtscan 10.0.0.0/24" }],
    related: ["enum4linux", "crackmapexec"],
  },
  ncrack: {
    overview: [
      "ncrack from Nmap project parallelizes network authentication cracking for SSH, RDP, HTTP, and more—similar niche to hydra with nmap integration.",
    ],
    useCases: ["High-speed credential brute-force"],
    commands: [{ label: "SSH crack", code: "ncrack -p 22 --user admin -P passes.txt 10.0.0.50" }],
    related: ["hydra", "medusa"],
  },
  openvas: {
    overview: [
      "OpenVAS/GVM vulnerability scanner with extensive NVT feed. Heavyweight alternative to nuclei for full-network credentialed scans.",
    ],
    useCases: ["Full vulnerability management scans (authorized)"],
    related: ["nmap", "nuclei"],
  },
  "passing-the-hash": {
    overview: [
      "Kali metapackage grouping PtH-related tools and docs. Actual PtH via impacket, crackmapexec, and mimikatz techniques.",
    ],
    useCases: ["Reference bundle for hash-based lateral movement"],
    related: ["impacket", "crackmapexec"],
  },
  pixiewps: {
    overview: [
      "pixiewps offline WPS PIN attack using weak PRNG in vulnerable routers—requires captured WPS exchange.",
    ],
    useCases: ["WPS PIN recovery on vulnerable APs (authorized)"],
    related: ["aircrack-ng", "reaver"],
  },
  proxytunnel: {
    overview: [
      "proxytunnel tunnels TCP through HTTP CONNECT proxies—legacy pivot through corporate forward proxies.",
    ],
    useCases: ["Egress through HTTP proxies"],
    related: ["proxychains4", "chisel"],
  },
  reaver: {
    overview: [
      "reaver brute-forces WPS PIN on vulnerable routers. Pair with airodump-ng monitor capture.",
    ],
    useCases: ["WPS audit on owned hardware"],
    related: ["pixiewps", "aircrack-ng"],
  },
  rkhunter: {
    overview: [
      "rkhunter checks for rootkits, backdoors, and local exploits on Linux via file hash and behavior heuristics.",
    ],
    useCases: ["Host integrity checks during IR"],
    related: ["chkrootkit", "lynis"],
  },
  rsniff: {
    overview: [
      "Generic sniffing helper tools related to dsniff suite for protocol-specific password capture.",
    ],
    useCases: ["Cleartext protocol sniffing in MITM labs"],
    related: ["dsniff", "wireshark"],
  },
  smbmap: {
    overview: [
      "smbmap enumerates SMB shares, permissions, and file listings across domains with credential or hash auth.",
    ],
    useCases: ["Share permission mapping", "Sensitive file discovery on SMB"],
    commands: [{ label: "Recursive list", code: "smbmap -H 10.0.0.5 -u user -p pass -R" }],
    related: ["crackmapexec", "impacket"],
  },
  sparta: {
    overview: [
      "SPARTA GUI queued nmap, nikto, and enum tools—superseded by Legion on modern Kali but may remain installed.",
    ],
    useCases: ["GUI recon workflow (legacy)"],
    related: ["legion", "nmap"],
  },
  sslsplit: {
    overview: [
      "sslstrip/sslsplit transparent MITM for TLS downgrade and split connections—requires network position and trust implant.",
    ],
    useCases: ["TLS MITM demonstration in labs"],
    related: ["ettercap", "bettercap"],
  },
  sslscan: {
    overview: [
      "sslscan lists accepted TLS ciphers and certificate details—quick SSL audit CLI.",
    ],
    useCases: ["Cipher suite enumeration"],
    commands: [{ label: "Scan", code: "sslscan target.example.com:443" }],
    related: ["testssl", "nmap"],
  },
  sublist3r: {
    overview: [
      "Sublist3r passive subdomain enumeration using search engines and DNS brute-force.",
    ],
    useCases: ["Subdomain discovery before port scan"],
    commands: [{ label: "Enumerate", code: "sublist3r -d example.com" }],
    related: ["subfinder", "amass"],
  },
  tcpflow: {
    overview: [
      "tcpflow reconstructs TCP streams to files for protocol analysis—similar to Wireshark Follow Stream in batch.",
    ],
    useCases: ["Extracting HTTP objects from PCAPs"],
    related: ["wireshark", "tcpdump"],
  },
  "thc-ipv6": {
    overview: [
      "THC-IPv6 attack toolkit: router advertisement floods, neighbor discovery attacks, and IPv6 MITM on dual-stack networks.",
    ],
    useCases: ["IPv6 security assessments on authorized networks"],
    related: ["nmap", "wireshark"],
  },
  uniscan: {
    overview: [
      "Uniscan combines web fingerprinting, directory/file brute, and basic SQLi/RCE checks in one Perl driver.",
    ],
    useCases: ["Lightweight automated web scan"],
    related: ["nikto", "skipfish"],
  },
  urlcrazy: {
    overview: [
      "urlcrazy generates typosquatting and homoglyph domain variants for brand protection and phishing research.",
    ],
    useCases: ["Typosquat domain discovery"],
    related: ["theharvester", "subfinder"],
  },
  wafw00f: {
    overview: [
      "wafw00f fingerprints Web Application Firewalls by sending probes and matching known WAF response behaviors.",
    ],
    useCases: ["WAF identification before WAF bypass tuning"],
    commands: [{ label: "Detect WAF", code: "wafw00f https://target.example.com" }],
    related: ["sqlmap", "nuclei"],
  },
  wfuzz: {
    overview: [
      "wfuzz replaces FUZZ markers in URLs, headers, and POST data for web fuzzing—filter by response code, length, or regex.",
    ],
    useCases: ["Parameter and directory fuzzing"],
    commands: [{ label: "Directory fuzz", code: "wfuzz -c -z file,wordlist.txt https://target/FUZZ" }],
    related: ["ffuf", "gobuster"],
  },
  whatweb: {
    overview: [
      "WhatWeb fingerprints CMS, plugins, and frameworks from HTTP responses. `-a` sets aggression of probes sent.",
    ],
    useCases: ["Tech stack ID for targeted exploits"],
    commands: [{ label: "Aggressive scan", code: "whatweb -a 3 https://target.example.com" }],
    related: ["wpscan", "nuclei"],
  },
  wireguard: {
    overview: [
      "WireGuard VPN for lightweight encrypted tunnels to lab networks or pivot infrastructure.",
    ],
    useCases: ["Secure operator access to engagement VLANs"],
    related: ["openvpn"],
  },
  wordlists: {
    overview: [
      "Kali wordlists metapackage: rockyou, dirb, seclists paths under /usr/share/wordlists. Foundation for hydra, hashcat, and fuzzers.",
    ],
    useCases: ["Default wordlist reference paths"],
    related: ["hashcat", "hydra"],
  },
  wpscan: {
    overview: [
      "WPScan enumerates WordPress core, plugins, themes, and users against the WPScan vulnerability API.",
    ],
    useCases: ["WordPress CVE and config audit"],
    related: ["nikto", "nuclei"],
  },
  xspy: {
    overview: [
      "xspy keystroke logger for X11 sessions—demonstrates local display capture risk on shared Linux workstations.",
    ],
    useCases: ["X11 session security demos (authorized)"],
    related: ["keylogger", "metasploit"],
  },
  zaproxy: {
    overview: [
      "OWASP ZAP open-source web app scanner and proxy. Alternative to Burp for automation and CI DAST with REST API.",
    ],
    useCases: ["Automated web scanning", "Open-source intercepting proxy"],
    related: ["burp-suite", "nuclei"],
  },
};
