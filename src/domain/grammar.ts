/** Groups shown to the learner, most useful first. */
export type IssueKind = 'spelling' | 'capitals' | 'grammar' | 'spacing' | 'punctuation';

export const ISSUE_LABELS: Record<IssueKind, string> = {
  spelling: 'Spelling',
  capitals: 'Capital letters',
  grammar: 'Grammar',
  spacing: 'Spacing',
  punctuation: 'Punctuation',
};

export interface GrammarIssue {
  /**
   * Character offsets into the checked text. Always whole words, so a
   * correction reads "the → The", never a single letter mid-word.
   * start === end means something should be inserted there.
   */
  start: number;
  end: number;
  kind: IssueKind;
  message: string;
  /** The corrected text for [start, end). */
  suggestion?: string;
}

/**
 * Any grammar engine. The built-in rule checker (services/grammar) implements this today;
 * Harper (harper.js) can be added later as another implementation
 * without changing the screens.
 */
export interface GrammarChecker {
  check(text: string): Promise<GrammarIssue[]>;
}
