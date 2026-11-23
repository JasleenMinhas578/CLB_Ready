import type { ReactNode } from 'react';
import type { GrammarIssue } from '@/domain/grammar';

/** The learner's writing with each possible mistake marked, plus a list of fixes. */
export function EssayView({ text, issues }: { text: string; issues: GrammarIssue[] }) {
  const parts: ReactNode[] = [];
  let cursor = 0;
  issues.forEach((issue, index) => {
    if (issue.start > cursor) parts.push(text.slice(cursor, issue.start));
    parts.push(
      <mark key={index} className={`mark-${issue.kind}`} title={issue.message}>
        {text.slice(issue.start, issue.end) || ' '}
        <sup aria-hidden="true">{index + 1}</sup>
      </mark>,
    );
    cursor = issue.end;
  });
  parts.push(text.slice(cursor));

  return (
    <>
      <blockquote className="transcript essay">{parts}</blockquote>
      {issues.length > 0 ? (
        <ol className="issue-list">
          {issues.map((issue, index) => (
            <li key={index}>
              <span className={`issue-kind kind-${issue.kind}`}>{issue.kind}</span> {issue.message}
            </li>
          ))}
        </ol>
      ) : (
        <p className="fine-print">No common spelling or grammar mistakes found.</p>
      )}
    </>
  );
}
