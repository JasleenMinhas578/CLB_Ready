/**
 * Keeps answers from being lost by accident: tells screens when leaving
 * would throw an answer away, and keeps a writing draft for this tab only
 * (sessionStorage clears when the tab closes, and nothing is uploaded).
 */

/** True while a writing answer is open and not blank. */
export function hasUnsavedWork(writing: boolean, text: string): boolean {
  return writing && text.trim() !== '';
}

/** Asks the browser to confirm before closing or reloading mid-answer. */
export function warnBeforeLeaving(event: BeforeUnloadEvent) {
  event.preventDefault();
}

function draftKey(moduleId: string, taskTypeId: string): string {
  return `clb-ready:draft:${moduleId}:${taskTypeId}`;
}

// Storage can throw (private mode, full, or blocked), even when just looking up
// `sessionStorage`. A draft is a nice-to-have,
// so any failure just means no draft.
export function loadDraft(moduleId: string, taskTypeId: string): string {
  try {
    return sessionStorage.getItem(draftKey(moduleId, taskTypeId)) ?? '';
  } catch {
    return '';
  }
}

export function saveDraft(moduleId: string, taskTypeId: string, text: string): void {
  try {
    // An empty editor has nothing worth bringing back.
    if (text.trim()) sessionStorage.setItem(draftKey(moduleId, taskTypeId), text);
    else sessionStorage.removeItem(draftKey(moduleId, taskTypeId));
  } catch {
    // See above: no draft this time.
  }
}

export function clearDraft(moduleId: string, taskTypeId: string): void {
  try {
    sessionStorage.removeItem(draftKey(moduleId, taskTypeId));
  } catch {
    // See above.
  }
}
