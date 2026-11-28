import { useSyncExternalStore } from 'react';

/**
 * The "Timer sounds" setting, saved in this browser (localStorage) and on by default.
 * Storage can be blocked, so a failed read counts as on and a failed write
 * still applies until the tab closes.
 */
const KEY = 'clb-ready:timer-sounds:v1';

const listeners = new Set<() => void>();
let cache: boolean | null = null;

export function timerSoundsOn(): boolean {
  if (cache !== null) return cache;
  try {
    cache = window.localStorage.getItem(KEY) !== 'off';
  } catch {
    cache = true;
  }
  return cache;
}

export function setTimerSounds(on: boolean) {
  cache = on;
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Storage blocked: the choice holds until the tab closes.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

export function useTimerSounds(): boolean {
  return useSyncExternalStore(subscribe, timerSoundsOn, () => true);
}
