"use client";

import { useEffect } from "react";

// Direction-aware thresholds (px):
//  - scrolling DOWN past COMPACT_AT: compact immediately;
//  - below EXPAND_AT (the very top): always full size;
//  - scrolling UP while within UP_ZONE of the top: expand immediately, so the
//    full header is back before inertial scrolling crawls the last few pixels;
//  - beyond UP_ZONE: always compact, so scrolling up mid-page keeps the slim bar.
// SWITCH_PX is the travel needed against the current direction before it flips,
// which stops 1-2px trackpad jitter from toggling the header.
const COMPACT_AT = 12;
const EXPAND_AT = 3;
const UP_ZONE = 100;
const SWITCH_PX = 10;

/**
 * Drives the compact ("squished") state of the sticky site header.
 *
 * Renders nothing. It only
 *  - toggles `data-nav-compact` on <html> (styled in globals.css), and
 *  - measures the header's full and compact heights and publishes them as
 *    `--header-full-h`, `--header-compact-h` and `--header-h` on <html>.
 *
 * The header keeps its full height in document flow even when compact (its
 * bottom margin takes up the difference), so compacting never shifts the page
 * or changes the document height. Without JS the header simply stays sticky
 * at its full size.
 */
export function NavScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    let compact = false;
    let measureFrame = 0;
    let disposed = false;

    const apply = (next: boolean) => {
      if (next === compact) return;
      compact = next;
      if (next) root.setAttribute("data-nav-compact", "");
      else root.removeAttribute("data-nav-compact");
    };

    const measure = () => {
      root.classList.add("nav-measuring");
      root.setAttribute("data-nav-measuring-auto", "");
      const wasCompact = root.hasAttribute("data-nav-compact");

      root.removeAttribute("data-nav-compact");
      const full = header.getBoundingClientRect().height;
      root.setAttribute("data-nav-compact", "");
      const small = header.getBoundingClientRect().height;
      if (!wasCompact) root.removeAttribute("data-nav-compact");

      root.style.setProperty("--header-full-h", `${Math.round(full)}px`);
      root.style.setProperty("--header-compact-h", `${Math.round(small)}px`);
      root.style.setProperty("--header-h", `${Math.round(small)}px`);

      // Release auto height/margin overrides while transitions are still disabled,
      // then force layout to resolve final styles before transitions come back.
      root.removeAttribute("data-nav-measuring-auto");
      void header.offsetHeight;
      root.classList.remove("nav-measuring");
    };

    // `ref` is the furthest scroll position reached in the current direction.
    let down = true;
    let ref = window.scrollY;

    const update = () => {
      const y = window.scrollY;

      if (down) {
        if (y > ref) ref = y;
        else if (ref - y >= SWITCH_PX) {
          down = false;
          ref = y;
        }
      } else if (y < ref) ref = y;
      else if (y - ref >= SWITCH_PX) {
        down = true;
        ref = y;
      }

      if (y < EXPAND_AT) apply(false);
      else if (y > UP_ZONE) apply(true);
      else if (down) {
        if (y > COMPACT_AT) apply(true);
      } else apply(false);
    };

    const onResize = () => {
      if (disposed) return;
      if (measureFrame) cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        if (!disposed) measure();
      });
    };

    // Start in the right state before measure() restores transitions when the
    // page loads already scrolled (reload / back-forward restoration).
    if (window.scrollY > COMPACT_AT) apply(true);
    measure();

    // The handler is a single scrollY read plus an attribute toggle only when a
    // threshold is crossed, so it needs no rAF throttling.
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    void document.fonts?.ready.then(() => {
      if (!disposed) onResize();
    });

    return () => {
      disposed = true;
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      if (measureFrame) cancelAnimationFrame(measureFrame);
      root.removeAttribute("data-nav-compact");
      root.removeAttribute("data-nav-measuring-auto");
      root.classList.remove("nav-measuring");
      root.style.removeProperty("--header-full-h");
      root.style.removeProperty("--header-compact-h");
      root.style.removeProperty("--header-h");
    };
  }, []);

  return null;
}
