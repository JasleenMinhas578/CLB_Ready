/**
 * Keeps answers from being lost by accident: tells screens when leaving
 * would throw an answer away, and keeps a writing draft for this tab only
 * (sessionStorage clears when the tab closes, and nothing is uploaded).
 */
export interface WorkInProgress {
  /** The microphone is recording an answer. */
  recording?: boolean;
  /** A writing answer is open and not yet submitted. */
  writing?: boolean;
  text?: string;
}

export function hasUnsavedWork({ recording = false, writing = false, text = '' }: WorkInProgress): boolean {
  return recording || (writing && text.trim() !== '');
}

/** The parts of Storage a draft needs, so tests can pass a plain fake. */
export type DraftStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** This tab's sessionStorage, looked up on each call: even reading `window.sessionStorage` can throw when storage is blocked. */
export const tabStorage: DraftStorage = {
  getItem: (key) => window.sessionStorage.getItem(key),
  setItem: (key, value) => window.sessionStorage.setItem(key, value),
  removeItem: (key) => window.sessionStorage.removeItem(key),
};

function draftKey(moduleId: string, taskTypeId: string): string {
  return `clb-ready:draft:${moduleId}:${taskTypeId}`;
}

// Storage can throw (private mode, full, or blocked). A draft is a nice-to-have,
// so any failure just means no draft.
export function loadDraft(storage: DraftStorage, moduleId: string, taskTypeId: string): string {
  try {
    return storage.getItem(draftKey(moduleId, taskTypeId)) ?? '';
  } catch {
    return '';
  }
}

export function saveDraft(storage: DraftStorage, moduleId: string, taskTypeId: string, text: string): void {
  try {
    // An empty editor has nothing worth bringing back.
    if (text.trim()) storage.setItem(draftKey(moduleId, taskTypeId), text);
    else storage.removeItem(draftKey(moduleId, taskTypeId));
  } catch {
    // See above: no draft this time.
  }
}

export function clearDraft(storage: DraftStorage, moduleId: string, taskTypeId: string): void {
  try {
    storage.removeItem(draftKey(moduleId, taskTypeId));
  } catch {
    // See above.
  }
}
