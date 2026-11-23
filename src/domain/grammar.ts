export type IssueKind = 'spelling' | 'grammar' | 'punctuation';

export interface GrammarIssue {
  /** Character offsets into the checked text. */
  start: number;
  end: number;
  kind: IssueKind;
  message: string;
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
