import { describe, expect, it } from 'vitest';

// A tiny stand-in for the browser's localStorage, since tests run in Node.
const store = new Map<string, string>();
(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  },
  addEventListener() {},
  removeEventListener() {},
};

describe('saved progress', () => {
  it('saves only task ids and dates, and can be cleared', async () => {
    const { markDone, clearProgress, countDone, taskKey } = await import('../src/services/progress/progress');
    markDone('module-1', 'speaking-1', new Date('2026-11-23T05:00:00Z'));
    markDone('module-1', 'reading-2', new Date('2026-11-23T06:00:00Z'));
    const saved = JSON.parse(store.get('clb-ready:progress:v1') ?? '{}');
    expect(saved).toEqual({ 'module-1/speaking-1': '2026-11-23T05:00:00.000Z', 'module-1/reading-2': '2026-11-23T06:00:00.000Z' });
    expect(countDone(saved, 'module-1', ['speaking-1', 'speaking-2'])).toBe(1);
    expect(taskKey('module-3', 'listening-6')).toBe('module-3/listening-6');
    clearProgress();
    expect(store.get('clb-ready:progress:v1')).toBe('{}');
  });

  it('keeps working when storage is blocked', async () => {
    (globalThis as unknown as { window: { localStorage: unknown } }).window.localStorage = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
    };
    const { markDone } = await import('../src/services/progress/progress');
    let threw = false;
    try {
      markDone('module-2', 'writing-1');
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
  });
});
