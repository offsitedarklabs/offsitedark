const hashListeners = new Set<() => void>();

function subscribeToHash(callback: () => void): () => void {
  const onChange = () => callback();
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  hashListeners.add(onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    hashListeners.delete(onChange);
  };
}

function notifyHashListeners(): void {
  for (const listener of hashListeners) listener();
}

export function resolveSlugFromHash(
  slugs: ReadonlySet<string>,
  hash: string,
): string {
  const slug = hash.replace(/^#/, "");
  return slug && slugs.has(slug) ? slug : "";
}

export function readHashSlug(slugs: ReadonlySet<string>): string {
  return resolveSlugFromHash(slugs, window.location.hash);
}

export function pushHashSlug(slug: string): void {
  const hash = `#${slug}`;
  if (window.location.hash === hash) return;
  window.history.pushState(null, "", hash);
  notifyHashListeners();
}

export function replaceHashSlug(slug: string): void {
  const hash = `#${slug}`;
  if (window.location.hash === hash) return;
  window.history.replaceState(null, "", hash);
  notifyHashListeners();
}

export function subscribeHashSlug(
  slugs: ReadonlySet<string>,
  callback: () => void,
): () => void {
  return subscribeToHash(callback);
}

export function getHashSlugSnapshot(slugs: ReadonlySet<string>): string {
  return readHashSlug(slugs);
}
