import { beforeEach, describe, expect, it, vi } from 'vitest';
import { timerRunBeeps } from '../src/features/task/timerBeeps';

const store = new Map<string, string>();
const workingStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, value),
};
const blockedStorage = {
  getItem: () => { throw new Error('blocked'); },
  setItem: () => { throw new Error('blocked'); },
};

// A fresh copy of the module, as if the page had been reloaded.
async function load(localStorage: unknown) {
  (globalThis as unknown as { window: unknown }).window = { localStorage };
  vi.resetModules();
  return import('../src/services/audio/timerSounds');
}

describe('timer sounds setting', () => {
  beforeEach(() => store.clear());

  it('is on by default', async () => {
    expect((await load(workingStorage)).timerSoundsOn()).toBe(true);
  });

  it('remembers being turned off after a reload, and back on', async () => {
    (await load(workingStorage)).setTimerSounds(false);
    expect((await load(workingStorage)).timerSoundsOn()).toBe(false);
    (await load(workingStorage)).setTimerSounds(true);
    expect((await load(workingStorage)).timerSoundsOn()).toBe(true);
  });

  it('works when storage is blocked: on by default, and a change holds for the visit', async () => {
    const sounds = await load(blockedStorage);
    expect(sounds.timerSoundsOn()).toBe(true);
    expect(() => sounds.setTimerSounds(false)).not.toThrow();
    expect(sounds.timerSoundsOn()).toBe(false);
  });
});

describe('timer run beeps', () => {
  const run = () => {
    const played: string[] = [];
    return { played, beeps: timerRunBeeps((kind) => played.push(kind)) };
  };

  it('beeps once at the start and once at the end', () => {
    const { played, beeps } = run();
    beeps.start();
    beeps.start();
    beeps.end();
    expect(played).toEqual(['start', 'end']);
  });

  it('beeps the end only once when time runs out and the timer then stops', () => {
    const { played, beeps } = run();
    beeps.start();
    beeps.end(); // time ran out
    beeps.end(); // the screen moved on
    expect(played).toEqual(['start', 'end']);
  });

  it('stays silent if it stops before its start beep', () => {
    const { played, beeps } = run();
    beeps.end();
    expect(played).toEqual([]);
  });
});
