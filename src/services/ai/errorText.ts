/**
 * Turns raw model errors into one plain sentence the learner can act on.
 * Covers the error states in the spec: storage full, download failed,
 * GPU lost mid-session, and out of memory.
 */
export function friendlyModelError(error: unknown): string {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error ?? '');
  const text = message.toLowerCase();

  if (text.includes('quota') || text.includes('storage') || text.includes('no space')) {
    return 'There isn’t enough free space to download the AI model. Free up some storage or switch to a lighter model in Settings.';
  }
  if (text.includes('device lost') || text.includes('device was lost') || text.includes('gpudevice') || text.includes('context lost')) {
    return 'The graphics chip stopped responding. Reload the page to try again.';
  }
  if (text.includes('out of memory') || text.includes('allocation') || text.includes('oom')) {
    return 'This device ran out of memory for the AI model. Try a lighter model in Settings.';
  }
  if (text.includes('fetch') || text.includes('network') || text.includes('failed to load') || text.includes('download')) {
    return 'The AI model couldn’t download. Check your internet connection and try again.';
  }
  if (text.includes('could not be read')) {
    return 'The AI coach’s reply came back garbled twice.';
  }
  return 'The AI coach couldn’t finish this time.';
}
