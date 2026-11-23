import type { GrammarIssue } from '@/domain/grammar';

/** One checking rule: finds every issue of its kind in the text. */
export type Rule = (text: string) => GrammarIssue[];

export function eachMatch(text: string, pattern: RegExp, build: (match: RegExpExecArray) => GrammarIssue | null): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  const regex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  for (let match = regex.exec(text); match; match = regex.exec(text)) {
    const issue = build(match);
    if (issue) issues.push(issue);
    if (match[0].length === 0) regex.lastIndex += 1;
  }
  return issues;
}

/** Keeps the writer's capitalization: "Dont" → "Don't", "dont" → "don't". */
export function matchCase(original: string, fix: string): string {
  return /^[A-Z]/.test(original) ? fix.charAt(0).toUpperCase() + fix.slice(1) : fix;
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** The word just before `index`, lowercased, or '' at the start. */
export function previousWord(text: string, index: number): string {
  const before = text.slice(0, index).match(/([A-Za-z'’]+)[^A-Za-z'’]*$/);
  return before ? before[1].toLowerCase() : '';
}
