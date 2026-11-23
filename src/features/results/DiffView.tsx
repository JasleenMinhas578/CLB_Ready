import { Fragment, useMemo } from 'react';
import { diffWords, summarizeDiff, type DiffPart } from '@/domain/diff';
import { plural } from '@/domain/scoring/sufficiency';

function Part({ part }: { part: DiffPart }) {
  if (part.text === '\n\n' || part.text === '\n') return <>{part.text}</>;
  if (part.kind === 'added') {
    return (
      <ins className="diff-added">
        <span className="sr-only">added: </span>
        {part.text}
      </ins>
    );
  }
  if (part.kind === 'removed') {
    return (
      <del className="diff-removed">
        <span className="sr-only">removed: </span>
        {part.text}
      </del>
    );
  }
  return <>{part.text}</>;
}

/**
 * Read-only view of the improved answer with the learner's words that were
 * cut struck through, and new words highlighted. Replacements show both.
 */
export function DiffView({ before, after }: { before: string; after: string }) {
  const parts = useMemo(() => diffWords(before, after), [before, after]);
  const summary = useMemo(() => summarizeDiff(parts), [parts]);

  return (
    <>
      <p className="diff-summary">
        <span className="diff-key key-added">{plural(summary.added, 'word')} added</span>
        <span className="diff-key key-removed">{plural(summary.removed, 'word')} cut or replaced</span>
        <span>{Math.round(summary.keptShare * 100)}% of the improved version is your own words</span>
      </p>
      <blockquote className="transcript diff-text" aria-label="Improved answer with changes marked">
        {parts.map((part, index) => {
          const prev = parts[index - 1];
          const needsSpace = index > 0 && !part.text.startsWith('\n') && !(prev?.text.endsWith('\n') ?? false);
          return (
            <Fragment key={index}>
              {needsSpace && ' '}
              <Part part={part} />
            </Fragment>
          );
        })}
      </blockquote>
    </>
  );
}
