import { useEffect, useState } from 'react';

/**
 * Tiny hash router. Hash URLs (#/goal) work on any static host,
 * including GitHub Pages, with no server rewrites.
 */
export type RouteParams = Record<string, string>;

/** Matches "/task/:moduleId/:taskTypeId" against "/task/module-1/speaking-3". */
export function matchPath(pattern: string, path: string): RouteParams | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params: RouteParams = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const expected = patternParts[i];
    const actual = pathParts[i];
    if (expected.startsWith(':')) {
      // A malformed escape like "%E0" throws; treat it as no match so the app shows NotFound.
      try {
        params[expected.slice(1)] = decodeURIComponent(actual);
      } catch {
        return null;
      }
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}

function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.startsWith('/') ? hash : '/';
}

// The screen shown before this one, so a detour (choosing a goal, settings) can send the learner back.
let shown = '/';
let previous: string | null = null;

/** Where a detour screen sends the learner back to: the screen before it, or home. Never back into a running task. */
export function backPath(): string {
  return previous && previous !== shown && !previous.startsWith('/task/') ? previous : '/';
}

export function useHashPath(): string {
  const [path, setPath] = useState(() => (shown = currentPath()));
  useEffect(() => {
    const onChange = () => {
      previous = shown;
      shown = currentPath();
      setPath(shown);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

export function navigate(to: string): void {
  window.location.hash = to;
}

export function href(to: string): string {
  return `#${to}`;
}
