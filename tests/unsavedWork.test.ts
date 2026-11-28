import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearDraft, hasUnsavedWork, loadDraft, saveDraft } from '../src/features/task/exam/unsavedWork';

/** Stands in for this tab's sessionStorage. */
function fakeStorage() {
  const items = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
  });
  return items;
}

describe('hasUnsavedWork', () => {
  it('is true only while writing something that is not blank', () => {
    expect(hasUnsavedWork(true, 'Dear Sir')).toBe(true);
    expect(hasUnsavedWork(true, '  \n ')).toBe(false);
    expect(hasUnsavedWork(false, 'Dear Sir')).toBe(false);
  });
});

describe('writing drafts', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('saves and restores a draft per module and task', () => {
    fakeStorage();
    saveDraft('module-1', 'writing-1', 'Dear Sir');
    saveDraft('module-1', 'writing-2', 'I prefer A');
    expect(loadDraft('module-1', 'writing-1')).toBe('Dear Sir');
    expect(loadDraft('module-1', 'writing-2')).toBe('I prefer A');
    expect(loadDraft('module-2', 'writing-1')).toBe('');
  });

  it('clears the draft on submit, and drops it when the editor is emptied', () => {
    const items = fakeStorage();
    saveDraft('module-1', 'writing-1', 'Dear Sir');
    clearDraft('module-1', 'writing-1');
    expect(loadDraft('module-1', 'writing-1')).toBe('');
    saveDraft('module-1', 'writing-1', 'Dear Sir');
    saveDraft('module-1', 'writing-1', '   ');
    expect(items.size).toBe(0);
  });

  it('treats storage that throws as no draft', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('full'); },
      removeItem: () => { throw new Error('blocked'); },
    });
    expect(loadDraft('module-1', 'writing-1')).toBe('');
    expect(() => saveDraft('module-1', 'writing-1', 'text')).not.toThrow();
    expect(() => clearDraft('module-1', 'writing-1')).not.toThrow();
  });
});
