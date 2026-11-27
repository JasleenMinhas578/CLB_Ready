import { describe, expect, it } from 'vitest';
import { clearDraft, hasUnsavedWork, loadDraft, saveDraft, type DraftStorage } from '../src/features/task/exam/unsavedWork';

function fakeStorage(): DraftStorage & { items: Map<string, string> } {
  const items = new Map<string, string>();
  return {
    items,
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
    removeItem: (key) => void items.delete(key),
  };
}

describe('hasUnsavedWork', () => {
  it('is true while recording', () => {
    expect(hasUnsavedWork({ recording: true })).toBe(true);
    expect(hasUnsavedWork({ recording: false })).toBe(false);
  });

  it('is true only while writing something that is not blank', () => {
    expect(hasUnsavedWork({ writing: true, text: 'Dear Sir' })).toBe(true);
    expect(hasUnsavedWork({ writing: true, text: '  \n ' })).toBe(false);
    expect(hasUnsavedWork({ writing: false, text: 'Dear Sir' })).toBe(false);
  });
});

describe('writing drafts', () => {
  it('saves and restores a draft per module and task', () => {
    const storage = fakeStorage();
    saveDraft(storage, 'module-1', 'writing-1', 'Dear Sir');
    saveDraft(storage, 'module-1', 'writing-2', 'I prefer A');
    expect(loadDraft(storage, 'module-1', 'writing-1')).toBe('Dear Sir');
    expect(loadDraft(storage, 'module-1', 'writing-2')).toBe('I prefer A');
    expect(loadDraft(storage, 'module-2', 'writing-1')).toBe('');
  });

  it('clears the draft on submit, and drops it when the editor is emptied', () => {
    const storage = fakeStorage();
    saveDraft(storage, 'module-1', 'writing-1', 'Dear Sir');
    clearDraft(storage, 'module-1', 'writing-1');
    expect(loadDraft(storage, 'module-1', 'writing-1')).toBe('');
    saveDraft(storage, 'module-1', 'writing-1', 'Dear Sir');
    saveDraft(storage, 'module-1', 'writing-1', '   ');
    expect(storage.items.size).toBe(0);
  });

  it('treats storage that throws as no draft', () => {
    const broken: DraftStorage = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('full'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    expect(loadDraft(broken, 'module-1', 'writing-1')).toBe('');
    expect(() => saveDraft(broken, 'module-1', 'writing-1', 'text')).not.toThrow();
    expect(() => clearDraft(broken, 'module-1', 'writing-1')).not.toThrow();
  });
});
