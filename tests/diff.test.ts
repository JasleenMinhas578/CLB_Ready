import { describe, expect, it } from 'vitest';
import { diffTokens, diffWords, summarizeDiff } from '../src/domain/diff';

const join = (parts: { kind: string; text: string }[], kind: string) =>
  parts.filter((part) => part.kind === kind).map((part) => part.text).join(' | ');

describe('diffWords', () => {
  it('marks a replaced word as removed then added', () => {
    const parts = diffWords('It was a good day.', 'It was a wonderful day.');
    expect(join(parts, 'removed')).toBe('good');
    expect(join(parts, 'added')).toBe('wonderful');
    expect(join(parts, 'same')).toBe('It was a | day.');
  });

  it('groups neighbouring changes into runs', () => {
    const parts = diffWords('I want new one.', 'I would like a replacement.');
    expect(join(parts, 'removed')).toBe('want new one.');
    expect(join(parts, 'added')).toBe('would like a replacement.');
  });

  it('treats a punctuation change as a replacement', () => {
    const parts = diffWords('Thanks', 'Thanks.');
    expect(join(parts, 'removed')).toBe('Thanks');
    expect(join(parts, 'added')).toBe('Thanks.');
  });

  it('keeps the improved paragraph breaks', () => {
    const parts = diffWords('Hi team. Please help.', 'Dear team,\n\nPlease help.');
    expect(parts.some((part) => part.text === '\n\n')).toBe(true);
    expect(diffTokens('a\n\nb\nc')).toEqual(['a', '\n\n', 'b', '\n', 'c']);
  });

  it('shows nothing changed for identical text', () => {
    const parts = diffWords('Same words here.', 'Same words here.');
    expect(parts).toEqual([{ kind: 'same', text: 'Same words here.' }]);
  });
});

describe('summarizeDiff', () => {
  it('counts added, removed and kept words', () => {
    const summary = summarizeDiff(diffWords('I want new one.', 'I would like a replacement.'));
    expect(summary).toEqual({ added: 4, removed: 3, kept: 1, keptShare: 0.2 });
  });

  it('handles a realistic rewrite quickly', () => {
    const before = 'I am writing about a stainless-steel coffee machine (order #48213) that I purchased from your website on March 3. '.repeat(6);
    const after = 'I recently purchased a stainless-steel coffee machine (order #48213) from your website on March 3rd. '.repeat(6);
    const started = Date.now();
    const summary = summarizeDiff(diffWords(before, after));
    expect(Date.now() - started < 200).toBe(true);
    expect(summary.keptShare > 0.6).toBe(true);
  });
});
