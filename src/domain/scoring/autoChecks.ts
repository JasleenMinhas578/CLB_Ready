import type { WritingMetrics } from '../measure/writingMetrics';

/**
 * Checklist items that plain code can decide more reliably than a small AI
 * model: dates, email tone and format, and a clear survey choice.
 * Keyed by the exact checklist wording used in the content files, so each
 * rule is explicit. Each rule returns true or false when it's sure, or
 * null to leave the item to the AI.
 */
type AutoCheck = (text: string, metrics: WritingMetrics) => boolean | null;

const MONTHS = 'january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec';
const DATE = new RegExp(
  `\\b(${MONTHS})\\.?\\s+\\d{1,2}(st|nd|rd|th)?\\b|\\b\\d{1,2}(st|nd|rd|th)?\\s+(of\\s+)?(${MONTHS})\\b|\\b\\d{1,2}[/-]\\d{1,2}([/-]\\d{2,4})?\\b|` +
    '\\b(yesterday|last (week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(a|one|two|three|\\d+) (days?|weeks?) ago|on (monday|tuesday|wednesday|thursday|friday|saturday|sunday))\\b',
  'i',
);
const PURCHASE = /\b(bought|buy|purchased?|ordered|order|paid)\b/i;

export function mentionsDate(text: string): boolean {
  return DATE.test(text);
}

const formalTone: AutoCheck = (_text, m) => {
  if (!m.email) return null;
  if (m.email.toneMismatch) return false;
  return m.email.hasGreeting && m.email.hasClosing && m.wordCount >= 100 ? true : null;
};

const friendlyTone: AutoCheck = (text, m) => {
  if (!m.email) return null;
  if (/\b(dear sir|dear madam|to whom it may concern)\b/i.test(text)) return false;
  return m.email.hasGreeting && m.email.hasClosing ? true : null;
};

const AUTO_CHECKS: Record<string, AutoCheck> = {
  'Describes the purchase and date': (text) => (PURCHASE.test(text) && mentionsDate(text) ? true : null),
  'Uses a polite, formal tone': formalTone,
  'Uses a polite, professional tone': formalTone,
  'Uses a friendly, informal tone': friendlyTone,
  'Uses a warm, informal tone': friendlyTone,
  'Clearly picks one option': (_text, m) => (m.survey ? m.survey.chosen !== null : null),
};

export interface ChecklistResult {
  met: boolean | null;
  /** Decided by code rather than the AI. */
  byCode: boolean;
}

/** Merges code checks over the AI's checklist. Code wins when it's sure. */
export function mergeChecklist(
  items: string[],
  aiResults: { met: boolean }[] | null,
  text: string,
  metrics: WritingMetrics,
): ChecklistResult[] {
  return items.map((item, index) => {
    const fromCode = AUTO_CHECKS[item]?.(text, metrics) ?? null;
    if (fromCode !== null) return { met: fromCode, byCode: true };
    const fromAi = aiResults?.[index]?.met;
    return { met: typeof fromAi === 'boolean' ? fromAi : null, byCode: false };
  });
}

export function hasAutoCheck(item: string): boolean {
  return item in AUTO_CHECKS;
}
