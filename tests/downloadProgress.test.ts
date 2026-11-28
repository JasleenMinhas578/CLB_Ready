import { describe, expect, it } from 'vitest';
import { averageProgress, type FileProgress } from '../src/services/ai/downloadProgress';

describe('download progress', () => {
  it('weights files by size, so a small file finishing does not swing the bar', () => {
    const files = new Map<string, FileProgress>();
    expect(averageProgress(files, { status: 'progress', file: 'model.onnx', progress: 50, loaded: 50, total: 100 })).toBe(0.5);
    expect(averageProgress(files, { status: 'progress', file: 'config.json', progress: 100, loaded: 1, total: 1 })).toBeCloseTo(51 / 101);
  });

  it('averages file shares when a file has no size', () => {
    const files = new Map<string, FileProgress>();
    averageProgress(files, { status: 'progress', file: 'a', progress: 50, loaded: 50, total: 100 });
    expect(averageProgress(files, { status: 'progress', file: 'b', progress: 100 })).toBe(0.75);
  });

  it('ignores events that are not download progress', () => {
    expect(averageProgress(new Map(), { status: 'done', file: 'a' })).toBeNull();
  });
});
