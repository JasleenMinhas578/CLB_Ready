import { describe, expect, it } from 'vitest';
import { checkRecording, micProblemFrom, rms } from '../src/services/audio/analysis';

const RATE = 16_000;
const tone = (seconds: number, amplitude: number) =>
  Float32Array.from({ length: seconds * RATE }, (_, i) => amplitude * Math.sin(i / 10));

function namedError(name: string): Error {
  const error = new Error(name);
  error.name = name;
  return error;
}

describe('rms', () => {
  it('is zero for silence and empty audio', () => {
    expect(rms(new Float32Array(100))).toBe(0);
    expect(rms(new Float32Array(0))).toBe(0);
  });
});

describe('checkRecording', () => {
  it('flags answers shorter than 3 seconds', () => {
    expect(checkRecording(tone(2, 0.3), RATE)).toBe('too-short');
  });

  it('flags near-silent answers', () => {
    expect(checkRecording(tone(10, 0.001), RATE)).toBe('too-quiet');
  });

  it('accepts normal speech-level audio', () => {
    expect(checkRecording(tone(10, 0.2), RATE)).toBeNull();
  });
});

describe('micProblemFrom', () => {
  it('maps browser errors to problems we can explain', () => {
    expect(micProblemFrom(namedError('NotAllowedError'))).toBe('denied');
    expect(micProblemFrom(namedError('NotFoundError'))).toBe('no-mic');
    expect(micProblemFrom(namedError('NotReadableError'))).toBe('busy');
    expect(micProblemFrom('something odd')).toBe('unknown');
  });
});
