import { describe, expect, it } from 'vitest';
import { finalScores } from '../src/domain/scoring/finalScores';

const code = { content: 8, vocabulary: 8, task: 8 };

describe('finalScores', () => {
  it('maps delivery to readability, drops an outlier and blends the rest', () => {
    const result = finalScores('writing', { ...code, readability: 8 }, { content: 4, vocabulary: 11, delivery: 11, task: 11 }, 200, 150);
    expect(result.ignored).toEqual([{ id: 'content', modelScore: 4 }]);
    expect(result.scores).toEqual({ content: 8, vocabulary: 10, readability: 9, task: 10 });
  });

  it('maps delivery to listenability and caps a short answer', () => {
    const result = finalScores('speaking', { ...code, listenability: 8 }, { content: 10, vocabulary: 10, delivery: 10, task: 10 }, 40, 120);
    expect(result.scores).toEqual({ content: 5, vocabulary: 5, listenability: 5, task: 5 });
    expect(result.ignored).toEqual([]);
  });

  it('keeps the code scores when there is no model reply', () => {
    const speaking = { ...code, listenability: 8 };
    expect(finalScores('speaking', speaking, null, 200, 120)).toEqual({ scores: speaking, ignored: [] });
  });
});
