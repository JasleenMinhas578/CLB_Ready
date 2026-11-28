import { STALL_MESSAGE, type FeedbackOutcome, type FeedbackProgress } from './useFeedback';

/** Where Pip is with a scorable answer, as the results screen sees it. */
export type ResultsState = 'loading-model' | 'scoring' | 'writing-answer' | 'done' | 'light-mode' | 'error' | 'stalled';

/** One card on the results screen. The sample answer is shown only where the task has one. */
export type ResultsCard = 'processing' | 'level' | 'tips' | 'checklist' | 'answer' | 'sample' | 'transcript' | 'measured';

export interface ResultsLayout {
  /** Phones: one column, top to bottom. */
  stack: ResultsCard[];
  /** Desktop: two columns, then full-width cards under both. */
  left: ResultsCard[];
  right: ResultsCard[];
  below: ResultsCard[];
}

export function resultsState(outcome: FeedbackOutcome | null, progress: FeedbackProgress | null): ResultsState {
  if (outcome?.kind === 'code') {
    if (outcome.reason === 'light-mode') return 'light-mode';
    return outcome.message === STALL_MESSAGE ? 'stalled' : 'error';
  }
  if (outcome?.kind === 'ai') {
    const answer = progress?.answer.state;
    return answer === 'done' || answer === 'failed' ? 'done' : 'writing-answer';
  }
  return progress?.phase === 'scoring' ? 'scoring' : 'loading-model';
}

/**
 * Which cards show in each state, and where. Anything Pip decides (level, tips,
 * checklist, better answer) waits behind one processing panel until Pip has
 * scored the answer; the transcript and measurements need no Pip, so they show at once.
 * Each column's DOM order is its reading order, so tab order matches what is seen.
 */
export function resultsLayout(state: ResultsState): ResultsLayout {
  switch (state) {
    case 'loading-model':
    case 'scoring':
      return {
        stack: ['processing', 'transcript', 'measured', 'sample'],
        left: ['transcript'],
        right: ['processing', 'measured'],
        below: ['sample'],
      };
    case 'writing-answer':
    case 'done':
      return {
        stack: ['level', 'tips', 'checklist', 'answer', 'sample', 'transcript', 'measured'],
        left: ['level', 'transcript'],
        right: ['tips', 'checklist', 'answer'],
        below: ['measured', 'sample'],
      };
    // Without Pip there is no better answer, so the measurements move up beside the transcript.
    case 'light-mode':
    case 'error':
    case 'stalled':
      return {
        stack: ['level', 'tips', 'checklist', 'sample', 'transcript', 'measured'],
        left: ['level', 'transcript'],
        right: ['tips', 'checklist', 'measured'],
        below: ['sample'],
      };
  }
}
