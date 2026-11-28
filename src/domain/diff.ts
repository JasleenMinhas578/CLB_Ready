/**
 * Word-level diff between the learner's answer and the improved version,
 * so the results screen can show exactly what was cut, added or replaced.
 * Pure and dependency-free (longest common subsequence), so it's unit-tested.
 */

export type DiffKind = 'same' | 'added' | 'removed';

export interface DiffPart {
  kind: DiffKind;
  /** Words joined by spaces; paragraph breaks appear as "\n\n". */
  text: string;
}

export interface DiffSummary {
  added: number;
  removed: number;
  kept: number;
  /** Share of the improved text that was kept from the original, 0 to 1. */
  keptShare: number;
}

const BREAK = '\n\n';

/** Words with their punctuation, plus a token for each paragraph break. */
export function diffTokens(text: string): string[] {
  const tokens: string[] = [];
  text
    .trim()
    .split(/\n\s*\n/)
    .forEach((paragraph, index) => {
      if (index > 0) tokens.push(BREAK);
      // Keep single line breaks (e.g. "Sincerely,\nJasleen") as breaks too.
      paragraph.split('\n').forEach((line, lineIndex) => {
        if (lineIndex > 0) tokens.push('\n');
        tokens.push(...line.split(/\s+/).filter(Boolean));
      });
    });
  return tokens;
}

/** Comparison ignores case and surrounding punctuation, so "Machine," matches "machine". */
function key(token: string): string {
  return token === BREAK || token === '\n' ? token : token.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '') || token;
}

export function diffWords(before: string, after: string): DiffPart[] {
  const a = diffTokens(before);
  const b = diffTokens(after);
  const ka = a.map(key);
  const kb = b.map(key);

  // LCS lengths, filled from the end.
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table = new Uint16Array(rows * cols);
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i * cols + j] =
        ka[i] === kb[j] ? table[(i + 1) * cols + j + 1] + 1 : Math.max(table[(i + 1) * cols + j], table[i * cols + j + 1]);
    }
  }

  const ops: { kind: DiffKind; token: string }[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (ka[i] === kb[j]) {
      // Show the improved spelling/punctuation; if it changed, mark it as a replacement.
      if (a[i] === b[j]) ops.push({ kind: 'same', token: b[j] });
      else {
        ops.push({ kind: 'removed', token: a[i] });
        ops.push({ kind: 'added', token: b[j] });
      }
      i += 1;
      j += 1;
    } else if (table[(i + 1) * cols + j] >= table[i * cols + j + 1]) {
      ops.push({ kind: 'removed', token: a[i] });
      i += 1;
    } else {
      ops.push({ kind: 'added', token: b[j] });
      j += 1;
    }
  }
  while (i < a.length) ops.push({ kind: 'removed', token: a[i++] });
  while (j < b.length) ops.push({ kind: 'added', token: b[j++] });

  // Removed line breaks would only add noise; keep the improved layout.
  const visible = ops.filter((op) => !(op.kind === 'removed' && (op.token === BREAK || op.token === '\n')));

  // Group neighbours of the same kind into readable runs; removals before additions.
  const parts: DiffPart[] = [];
  for (const op of visible) {
    const last = parts[parts.length - 1];
    const isBreak = op.token === BREAK || op.token === '\n';
    if (last && last.kind === op.kind && !isBreak && !last.text.endsWith('\n')) {
      last.text += ` ${op.token}`;
    } else {
      parts.push({ kind: isBreak ? 'same' : op.kind, text: op.token });
    }
  }
  return parts;
}

export function summarizeDiff(parts: DiffPart[]): DiffSummary {
  const count = (kind: DiffKind) =>
    parts.filter((part) => part.kind === kind).reduce((sum, part) => sum + part.text.split(/\s+/).filter((w) => w.trim()).length, 0);
  const added = count('added');
  const removed = count('removed');
  const kept = count('same');
  return { added, removed, kept, keptShare: kept + added > 0 ? kept / (kept + added) : 0 };
}

/** Below this share of the learner's own words, marked changes are too dense to read. */
export const MOSTLY_REWRITTEN_BELOW = 0.5;

/** True when less than half of the improved answer is the learner's own words. */
export function isMostlyRewritten(summary: DiffSummary): boolean {
  return summary.keptShare < MOSTLY_REWRITTEN_BELOW;
}
