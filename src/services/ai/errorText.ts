/**
 * Turns raw model errors into one plain sentence the learner can act on.
 * Covers the error states in the spec: storage full, download failed,
 * GPU lost mid-session, and out of memory.
 */
export function friendlyModelError(error: unknown, fallback = 'Pip could not finish this time. Try again.'): string {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error ?? '');
  const text = message.toLowerCase();

  if (text.includes('quota') || text.includes('storage') || text.includes('no space')) {
    return 'This device does not have enough free space for the download. Free up some space, or choose smaller models in Settings.';
  }
  if (text.includes('device lost') || text.includes('device was lost') || text.includes('gpudevice') || text.includes('context lost')) {
    return 'The graphics chip stopped responding, so the AI stopped. Reload the page and try again.';
  }
  if (text.includes('out of memory') || text.includes('allocation') || text.includes('oom')) {
    return 'This device ran out of memory. Choose smaller models in Settings, then try again.';
  }
  if (text.includes('fetch') || text.includes('network') || text.includes('failed to load') || text.includes('download')) {
    return 'The download did not finish. Check your internet connection and try again.';
  }
  if (text.includes('could not be read')) {
    return 'Pip’s reply could not be read, even after a second try. Try again, or choose other models in Settings.';
  }
  return fallback;
}
