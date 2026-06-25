"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import {
  filterSearchIndex,
  type SearchItem,
} from "@/lib/search-index";

interface SiteSearchProps {
  items: SearchItem[];
  className?: string;
}

export function SiteSearch({ items, className = "" }: SiteSearchProps) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = filterSearchIndex(items, query);
  const showResults = open && query.trim().length > 0;
  const safeActiveIndex =
    results.length === 0 ? 0 : Math.min(activeIndex, results.length - 1);

  useEffect(() => {
    if (!showResults) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [showResults]);

  const navigateTo = (href: string) => {
    setQuery("");
    setOpen(false);
    router.push(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setQuery("");
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!showResults || results.length === 0) {
      if (event.key === "Enter") event.preventDefault();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const target = results[safeActiveIndex] ?? results[0];
      if (target) navigateTo(target.href);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`site-search${className ? ` ${className}` : ""}`}
      role="search"
    >
      <label className="sr-only" htmlFor="site-search-input">
        Search the site
      </label>
      <input
        ref={inputRef}
        id="site-search-input"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search signals, tools, research, CVE…"
        className="ledger-search"
        spellCheck={false}
        role="combobox"
        aria-expanded={showResults}
        aria-controls={showResults ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          showResults && results[safeActiveIndex]
            ? `${listId}-option-${safeActiveIndex}`
            : undefined
        }
      />

      {showResults && (
        <ul
          id={listId}
          className="site-search-results"
          role="listbox"
          aria-label="Search results"
        >
          {results.length > 0 ? (
            results.map((item, index) => (
              <li key={`${item.kind}-${item.href}`} role="presentation">
                <Link
                  id={`${listId}-option-${index}`}
                  href={item.href}
                  role="option"
                  aria-selected={index === safeActiveIndex}
                  className={`site-search-result${
                    index === safeActiveIndex ? " site-search-result-active" : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <span className="site-search-result-kind">{item.kindLabel}</span>
                  <span className="site-search-result-title">{item.title}</span>
                  {item.excerpt && (
                    <span className="site-search-result-excerpt">{item.excerpt}</span>
                  )}
                </Link>
              </li>
            ))
          ) : (
            <li className="site-search-empty" role="option" aria-selected={false}>
              No matches
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
