import type { SpeechStatus } from '@/services/ai/speechEngine';

/** Small status line so learners know the AI is getting ready. */
export function SpeechModelBadge({ status }: { status: SpeechStatus }) {
  if (status.state === 'idle') return null;
  const percent = status.progress == null ? null : Math.round(status.progress * 100);
  const text = {
    loading: `Getting the speech model ready${percent != null ? ` (${percent}%)` : ''}`,
    ready: `Speech model ready: Whisper ${status.model ?? ''}`,
    error: 'The speech model didn’t load. Your answer will still be timed.',
  }[status.state];

  return (
    <p className={`model-badge is-${status.state}`} aria-live="polite">
      <span aria-hidden="true">🧠</span> {text}
    </p>
  );
}
