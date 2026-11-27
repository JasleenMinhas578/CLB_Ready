import type { SpeechStatus } from '@/services/ai/speechEngine';
import { friendlyModelError } from '@/services/ai/errorText';

/** Small status line so learners know the AI is getting ready. */
export function SpeechModelBadge({ status }: { status: SpeechStatus }) {
  if (status.state === 'idle' || status.state === 'unavailable') return null;
  const percent = status.progress == null ? null : Math.round(status.progress * 100);
  const text = {
    loading: `Getting speech-to-text ready${percent != null ? ` (${percent}%)` : ''}`,
    ready: 'Speech-to-text is ready.',
    error: `${friendlyModelError(status.error)} Your answer will still be timed.`,
  }[status.state];

  return (
    <p className={`model-badge is-${status.state}`} aria-live="polite">
      <span aria-hidden="true">🧠</span> {text}
    </p>
  );
}
