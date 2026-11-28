import { useMemo, useState, type ReactNode } from 'react';
import { ISSUE_LABELS, type GrammarIssue, type IssueKind } from '@/domain/grammar';
import { plural } from '@/domain/scoring/sufficiency';
import { Icon } from '@/components/Icon';

type View = 'corrections' | 'original';

/** Splits the text into plain runs and marked issues, in order. */
function segments(text: string, issues: GrammarIssue[]): ({ text: string } | { issue: GrammarIssue; text: string })[] {
  const parts: ({ text: string } | { issue: GrammarIssue; text: string })[] = [];
  let cursor = 0;
  for (const issue of issues) {
    if (issue.start > cursor) parts.push({ text: text.slice(cursor, issue.start) });
    parts.push({ issue, text: text.slice(issue.start, issue.end) });
    cursor = Math.max(cursor, issue.end);
  }
  parts.push({ text: text.slice(cursor) });
  return parts;
}

function Correction({ issue, original, view }: { issue: GrammarIssue; original: string; view: View }) {
  if (view === 'original') {
    // Just a soft wavy underline; the learner reads their own words.
    return original ? (
      <span className={`issue-under under-${issue.kind}`} title={issue.message}>{original}</span>
    ) : null;
  }
  const fix = issue.suggestion;
  return (
    <span className="correction" title={issue.message}>
      {original && (
        <del className="fix-old">
          <span className="sr-only">remove: </span>
          {original}
        </del>
      )}
      {fix && (
        <ins className="fix-new">
          <span className="sr-only">write: </span>
          {fix}
        </ins>
      )}
    </span>
  );
}

interface Group {
  kind: IssueKind;
  issues: GrammarIssue[];
  /** Distinct "wrong → right" pairs with how often each appears. */
  examples: { from: string; to: string; count: number }[];
}

function groupIssues(text: string, issues: GrammarIssue[]): Group[] {
  const order: IssueKind[] = ['spelling', 'grammar', 'capitals', 'punctuation', 'spacing'];
  return order
    .map((kind) => {
      const inGroup = issues.filter((issue) => issue.kind === kind);
      const pairs = new Map<string, { from: string; to: string; count: number }>();
      for (const issue of inGroup) {
        const from = text.slice(issue.start, issue.end) || '(missing)';
        const to = issue.suggestion ?? '';
        const keyName = `${from.toLowerCase()}→${to.toLowerCase()}`;
        const entry = pairs.get(keyName) ?? { from, to, count: 0 };
        entry.count += 1;
        pairs.set(keyName, entry);
      }
      return { kind, issues: inGroup, examples: [...pairs.values()].sort((a, b) => b.count - a.count) };
    })
    .filter((group) => group.issues.length > 0);
}

/**
 * The learner's writing with every possible mistake corrected inline, the
 * way a teacher marks a page: the wrong words struck out in red, the fix in
 * green. A switch shows the original with soft underlines instead.
 * Below, mistakes are grouped by type so patterns are easy to spot.
 */
export function EssayView({ text, issues }: { text: string; issues: GrammarIssue[] }) {
  const [view, setView] = useState<View>('corrections');
  const parts = useMemo(() => segments(text, issues), [text, issues]);
  const groups = useMemo(() => groupIssues(text, issues), [text, issues]);

  if (issues.length === 0) {
    return (
      <>
        <blockquote className="transcript essay">{text}</blockquote>
        <p className="fine-print">No common spelling or grammar mistakes found.</p>
      </>
    );
  }

  const body: ReactNode[] = parts.map((part, index) =>
    'issue' in part ? <Correction key={index} issue={part.issue} original={part.text} view={view} /> : part.text,
  );

  return (
    <>
      <div className="essay-head">
        <p className="essay-count">{plural(issues.length, 'possible mistake')} marked</p>
        <div className="view-switch" role="group" aria-label="How to show your writing">
          <button type="button" aria-pressed={view === 'corrections'} onClick={() => setView('corrections')}>Corrections</button>
          <button type="button" aria-pressed={view === 'original'} onClick={() => setView('original')}>Your original</button>
        </div>
      </div>
      <blockquote className={`transcript essay essay-${view}`}>{body}</blockquote>

      <ul className="issue-groups">
        {groups.map((group) => (
          <li key={group.kind}>
            <span className={`issue-kind kind-${group.kind}`}>
              {ISSUE_LABELS[group.kind]} <strong>{group.issues.length}</strong>
            </span>
            <span className="issue-examples">
              {group.examples.slice(0, 4).map((example) => (
                <span key={`${example.from}-${example.to}`} className="issue-example">
                  {example.from !== '(missing)' && <del>{example.from}</del>}
                  {example.to && (
                    <>
                      <Icon name="arrow-right" size="sm" />
                      <ins>{example.to}</ins>
                    </>
                  )}
                  {example.count > 1 && <small>×{example.count}</small>}
                </span>
              ))}
              {group.examples.length > 4 && <small>and {group.examples.length - 4} more</small>}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
