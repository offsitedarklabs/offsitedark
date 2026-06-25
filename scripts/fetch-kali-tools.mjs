import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CURATED_SLUGS_PATH = path.join(ROOT, "content/tools/kali-curated-slugs.json");
const FULL_OUT_PATH = path.join(ROOT, "content/tools/kali-full.json");
const CURATED_OUT_PATH = path.join(ROOT, "content/tools/kali.json");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAllToolsPage(html) {
  const categories = [];
  const cardRe = /<div class=card><h3>([^<]+)<\/h3>([\s\S]*?)<\/div>/g;
  const sourceRe =
    /<a href=https:\/\/www\.kali\.org\/tools\/([^/#?]+)\/><i class=ti-archive[^>]*><\/i>\s*([^<]+)<\/a>/g;

  let cardMatch;
  while ((cardMatch = cardRe.exec(html)) !== null) {
    const letter = cardMatch[1].trim();
    const body = cardMatch[2];
    const tools = [];
    const seen = new Set();
    let m;
    while ((m = sourceRe.exec(body)) !== null) {
      const slug = m[1];
      const name = m[2].trim();
      if (slug === "all-tools" || seen.has(slug)) continue;
      seen.add(slug);
      tools.push({ slug, name });
    }
    if (tools.length > 0) categories.push({ letter, tools });
  }
  return categories;
}

const KNOWN_DESCRIPTIONS = {
  nmap: "Network mapper. Host discovery, port scanning, service/version detection, OS fingerprinting, NSE scripting.",
  "metasploit-framework":
    "Exploitation framework. Modules for exploits, payloads, auxiliaries, encoders, post-exploitation, and evasion.",
  hashcat: "GPU-accelerated password recovery. Supports hundreds of hash types and attack modes.",
  wireshark: "Packet capture and protocol dissection. Live capture and PCAP analysis with display filters.",
  "aircrack-ng": "802.11 WEP/WPA cracking suite. Monitor mode, packet injection, handshake capture.",
  burpsuite: "Web proxy for intercepting HTTP/S. Scanner, repeater, intruder, and extension API.",
  sqlmap: "Automatic SQL injection detection and exploitation. DB fingerprinting, data exfiltration, OS shell.",
  hydra: "Parallelized network login cracker. Supports dozens of protocols and brute-force modes.",
  john: "Password hash cracker (John the Ripper). Wordlist and rule-based attacks.",
  responder: "LLMNR/NBT-NS/mDNS poisoner. Captures NetNTLM hashes on local networks.",
  impacket: "Python classes for network protocols. SMB, Kerberos, LDAP tooling for AD attacks.",
  bloodhound: "Active Directory attack path mapper. Ingests LDAP/ACE data into a graph model.",
  gobuster: "Directory/DNS/vhost brute-forcer. Fast content discovery against web servers.",
  nuclei: "Template-driven vulnerability scanner. YAML checks for CVEs, misconfigs, exposures.",
  ffuf: "Fast web fuzzer. Directory, parameter, header, and vhost discovery.",
  feroxbuster: "Recursive content discovery. Rust HTTP fuzzer with filtering and auto-calibration.",
  nikto: "Web server scanner. Tests for outdated software, dangerous files, and misconfigs.",
  theharvester: "OSINT gathering. Emails, subdomains, hosts from public search engines and APIs.",
  "recon-ng": "Modular reconnaissance framework. Marketplace of OSINT modules.",
  yara: "Pattern matching for malware identification. Rules match strings, hex, and conditions.",
  binwalk: "Firmware analysis. Extracts embedded files and filesystems from binary blobs.",
  scapy: "Packet manipulation library. Craft, send, sniff, and dissect arbitrary protocols.",
  ettercap: "MITM suite. ARP poisoning, sniffing, filtering, and protocol dissection.",
  "beef-xss": "Browser Exploitation Framework. Hooks browsers via XSS for command/control.",
  crackmapexec: "Swiss army knife for AD pentesting. SMB, WinRM, LDAP, MSSQL lateral movement.",
  netexec: "Successor to CrackMapExec. Network protocol abuse for Windows/AD environments.",
  "evil-winrm": "WinRM shell for post-exploitation. Upload, download, and execute on Windows targets.",
  mimikatz: "Windows credential extraction. LSASS dumping, Kerberos ticket manipulation.",
  powershell: "PowerShell on Linux (pwsh). Cross-platform scripting for automation and attacks.",
  ghidra: "NSA reverse engineering suite. Disassembly, decompilation, scripting, and diffing.",
  jadx: "DEX to Java decompiler. Android APK analysis with GUI and CLI.",
  snort: "Network IDS/IPS. Signature-based detection with rule language and preprocessors.",
  masscan: "Asynchronous TCP port scanner. Scans the entire Internet in minutes.",
  wpscan: "WordPress security scanner. Enumerates plugins, themes, users, and vulnerabilities.",
  subfinder: "Passive subdomain enumeration. Aggregates OSINT sources for DNS discovery.",
  amass: "Attack surface mapping. Subdomain enumeration, ASN discovery, and graph output.",
  dirsearch: "Web path scanner. Brute-forces directories and files with extension lists.",
  sherlock: "Username enumeration across social networks. Checks hundreds of sites.",
  volatility3: "Memory forensics framework. Extract processes, credentials, and artifacts from RAM dumps.",
  autopsy: "Digital forensics platform. Timeline analysis, keyword search, and artifact parsing.",
  steghide: "Steganography tool. Embeds/extracts data in JPEG, BMP, WAV, and AU files.",
  medusa: "Parallel login brute-forcer. Modular protocol support similar to Hydra.",
  hping3: "Crafted packet generator. TCP/UDP/ICMP probing, traceroute, and firewall testing.",
  tcpdump: "Command-line packet analyzer. BPF filter syntax for live capture.",
  dsniff: "Password sniffing suite. arpspoof, dnsspoof, mailsnarf, and file extraction.",
  armitage: "Metasploit GUI. Team server for collaborative red team operations.",
  searchsploit: "Exploit-DB CLI search. Local mirror of public exploit database.",
  wifite: "Automated wireless attack tool. WEP/WPA/WPS cracking with minimal configuration.",
  bettercap: "Network attack and monitoring. WiFi, BLE, HID, and MITM modules.",
  "ligolo-ng": "Tunneling without SOCKS. Reverse TCP/TLS pivot through compromised hosts.",
  chisel: "TCP/UDP tunnel over HTTP. Fast pivoting through restrictive egress.",
  pspy: "Process monitor without root. Observes process execution via /proc scraping.",
  "bloodhound.py": "Python BloodHound ingestor. Collects AD data for SharpHound-compatible graphs.",
  "impacket-scripts": "Impacket example scripts. psexec, secretsdump, getTGT, and dozens more.",
  "0trace": "Traceroute via existing TCP connections. Identifies hop path using established sessions.",
};

async function fetchToolDescription(slug) {
  if (KNOWN_DESCRIPTIONS[slug]) return KNOWN_DESCRIPTIONS[slug];
  try {
    const html = await fetch(`https://www.kali.org/tools/${slug}/`);
    const descMatch =
      html.match(/<meta\s+name=description\s+content="([^"]+)"/i) ||
      html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (descMatch) {
      let desc = descMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&rsquo;/g, "'")
        .trim();
      if (
        desc.toLowerCase().includes("kali linux") &&
        desc.toLowerCase().includes("penetration testing")
      ) {
        return null;
      }
      return tidyDescription(desc);
    }
  } catch {
    /* skip */
  }
  return null;
}

function tidyDescription(text) {
  let desc = text.split(/\n|Usage Example/i)[0].trim();
  if (desc.length > 160) {
    const cut = desc.slice(0, 160);
    const lastPeriod = cut.lastIndexOf(".");
    const lastSpace = cut.lastIndexOf(" ");
    desc = cut.slice(0, lastPeriod > 80 ? lastPeriod + 1 : lastSpace) + (lastPeriod > 80 ? "" : "…");
  }
  return desc;
}

function fallbackDescription(slug, name) {
  return `Kali package: ${name || slug.replace(/-/g, " ")}.`;
}

async function poolMap(items, concurrency, fn) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  const htmlPath = path.join(__dirname, "kali-all-tools.html");
  let html;
  if (fs.existsSync(htmlPath)) {
    html = fs.readFileSync(htmlPath, "utf8");
    console.log("Using cached HTML");
  } else {
    console.log("Fetching all-tools page...");
    html = await fetch("https://www.kali.org/tools/all-tools/");
    fs.writeFileSync(htmlPath, html);
  }

  const categories = parseAllToolsPage(html);
  const allTools = categories.flatMap((c) => c.tools);
  console.log(`Found ${allTools.length} tools in ${categories.length} letter groups`);

  console.log("Fetching descriptions...");
  const descriptions = await poolMap(allTools, 15, async (tool) => {
    const desc = await fetchToolDescription(tool.slug);
    return desc || fallbackDescription(tool.slug, tool.name);
  });

  let idx = 0;
  const fullOutput = {
    source: "https://www.kali.org/tools/",
    fetchedAt: new Date().toISOString(),
    toolCount: allTools.length,
    categories: categories.map((cat) => ({
      letter: cat.letter,
      tools: cat.tools.map((t) => {
        const description = descriptions[idx++];
        return {
          slug: t.slug,
          name: t.name,
          url: `https://www.kali.org/tools/${t.slug}/`,
          description,
        };
      }),
    })),
  };

  fs.mkdirSync(path.dirname(FULL_OUT_PATH), { recursive: true });
  fs.writeFileSync(FULL_OUT_PATH, JSON.stringify(fullOutput, null, 2));
  console.log(`Wrote ${FULL_OUT_PATH} (${allTools.length} tools)`);

  const curatedSlugs = JSON.parse(fs.readFileSync(CURATED_SLUGS_PATH, "utf8"));
  const allow = new Set(curatedSlugs);
  const curatedCategories = fullOutput.categories
    .map((cat) => ({
      ...cat,
      tools: cat.tools.filter((t) => allow.has(t.slug)),
    }))
    .filter((cat) => cat.tools.length > 0);
  const curatedCount = curatedCategories.reduce(
    (n, cat) => n + cat.tools.length,
    0,
  );
  const missing = curatedSlugs.filter(
    (slug) => !allTools.some((t) => t.slug === slug),
  );
  if (missing.length > 0) {
    console.warn(
      `Warning: ${missing.length} curated slug(s) not in Kali index: ${missing.join(", ")}`,
    );
  }

  const curatedOutput = {
    source: fullOutput.source,
    fetchedAt: fullOutput.fetchedAt,
    curated: true,
    curatedFrom: fullOutput.toolCount,
    toolCount: curatedCount,
    categories: curatedCategories,
  };

  fs.writeFileSync(CURATED_OUT_PATH, JSON.stringify(curatedOutput, null, 2));
  console.log(`Wrote ${CURATED_OUT_PATH} (${curatedCount} curated tools)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
