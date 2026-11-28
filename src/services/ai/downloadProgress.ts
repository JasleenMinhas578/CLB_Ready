/** What transformers.js passes to `progress_callback` while it downloads model files. */
export interface ProgressEvent {
  status: string;
  file?: string;
  progress?: number;
}

/**
 * Records one file's progress and returns the average across every file seen so far,
 * or null for events that aren't download progress.
 */
export function averageProgress(files: Map<string, number>, event: ProgressEvent): number | null {
  if (event.status !== 'progress' || !event.file) return null;
  files.set(event.file, (event.progress ?? 0) / 100);
  const values = [...files.values()];
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
