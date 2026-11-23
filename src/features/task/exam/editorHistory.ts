/**
 * Undo/redo history for the writing box. Pure functions, so it's unit-tested.
 * Keystrokes typed close together are grouped into one undo step, like a
 * word processor; cuts and pastes are always their own step.
 */
export interface EditorHistory {
  past: string[];
  present: string;
  future: string[];
  /** When the current step started, in ms. */
  stepStartedAt: number;
}

const GROUP_MS = 1000;
const MAX_STEPS = 200;

export function createHistory(text = ''): EditorHistory {
  return { past: [], present: text, future: [], stepStartedAt: 0 };
}

export function record(history: EditorHistory, next: string, now: number, forceNewStep = false): EditorHistory {
  if (next === history.present) return history;
  const typingOn = !forceNewStep && now - history.stepStartedAt < GROUP_MS && Math.abs(next.length - history.present.length) <= 1;
  if (typingOn && history.past.length > 0) {
    return { ...history, present: next, future: [] };
  }
  return {
    past: [...history.past, history.present].slice(-MAX_STEPS),
    present: next,
    future: [],
    stepStartedAt: now,
  };
}

export function undo(history: EditorHistory): EditorHistory {
  if (history.past.length === 0) return history;
  const previous = history.past[history.past.length - 1];
  return { past: history.past.slice(0, -1), present: previous, future: [history.present, ...history.future], stepStartedAt: 0 };
}

export function redo(history: EditorHistory): EditorHistory {
  if (history.future.length === 0) return history;
  const [next, ...rest] = history.future;
  return { past: [...history.past, history.present], present: next, future: rest, stepStartedAt: 0 };
}

/** Replaces the selected range with `insert`. Returns the new text and caret position. */
export function replaceRange(text: string, start: number, end: number, insert: string): { text: string; caret: number } {
  return { text: text.slice(0, start) + insert + text.slice(end), caret: start + insert.length };
}
