export const SITE = {
  name: "OFFSITE.DARK",
  tagline: "Security Research Lab",
  description:
    "Open source security research, malware analysis, and offensive tooling.",
  url: "https://offsitedark.com",
  email: "info@offsitedark.com",
  twitter: "https://x.com/offsitedark",
  github: "https://github.com/offsitedark",
} as const;

export const NAV: { label: string; href: string; external?: boolean }[] = [
  { label: "Research", href: "/research" },
  { label: "News", href: "/news" },
  { label: "Greps", href: "/greps" },
  { label: "Tools", href: "/tools" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Git", href: "https://github.com/offsitedark", external: true },
];

export const NODES = [
  { label: "GitHub", href: "https://github.com/offsitedark" },
  { label: "X", href: "https://x.com/offsitedark" },
  { label: "Email", href: "mailto:info@offsitedark.com" },
  { label: "RSS", href: "/feed.xml" },
];

export const CATEGORIES = [
  "malware",
  "reversing",
  "infra",
  "tools",
  "news",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const GREP_CATEGORIES = [
  "recent-upload",
  "cyber-llm",
  "pentest",
  "code-security",
  "oss-powerhouse",
  "malware-ml",
] as const;

export type GrepCategory = (typeof GREP_CATEGORIES)[number];

export const PROJECTS = [
  {
    slug: "firewall",
    name: "OFFSITE.FIREWALL",
    gif: "/images/95ff616d1a85c7f76f2691bdf1f3aba5.gif",
    status: "WIP",
    description:
      "Prebuilt Pi-hole + custom pfSense plug-and-play network security.",
    features: [
      "Pi-hole preinstalled",
      "pfSense configurations",
      "Auto-detect gateway",
    ],
  },
  {
    slug: "world",
    name: "OFFSITE.WORLD",
    gif: "/images/36aa541bc9d68937b39fd16ef3e75e31_720w1.gif",
    status: "PRIVATE",
    description: "Open source Greynoise.io. Port scanner and security engine.",
    features: ["Port scanning", "Noise classification", "Threat intel API"],
  },
  {
    slug: "ai",
    name: "OFFSITE.AI",
    gif: "/images/a4f596911806a18ad72700c05c876773.gif",
    status: "PRIVATE",
    description:
      "Fine-tuned AI models for malware detection and code correction.",
    features: ["Malware detection", "Security LLMs", "Private research"],
  },
];
