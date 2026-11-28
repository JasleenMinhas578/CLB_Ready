/** What transformers.js passes to `progress_callback` while it downloads model files. */
export interface ProgressEvent {
  status: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

export type FileProgress = { fraction: number; loaded: number; total: number };

/**
 * Records one file's progress and returns the share of every file seen so far,
 * or null for events that aren't download progress. Weighted by bytes when every
 * file reports its size, so a tiny config file finishing doesn't swing the bar.
 */
export function averageProgress(files: Map<string, FileProgress>, event: ProgressEvent): number | null {
  if (event.status !== 'progress' || !event.file) return null;
  files.set(event.file, { fraction: (event.progress ?? 0) / 100, loaded: event.loaded ?? 0, total: event.total ?? 0 });
  const values = [...files.values()];
  const total = values.reduce((sum, file) => sum + file.total, 0);
  if (values.every((file) => file.total > 0)) return values.reduce((sum, file) => sum + file.loaded, 0) / total;
  return values.reduce((sum, file) => sum + file.fraction, 0) / values.length;
}
