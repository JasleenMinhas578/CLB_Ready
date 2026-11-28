import type { ModelStatus } from '@/services/ai/modelStore';
import { friendlyModelError } from '@/services/ai/errorText';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';

/** Small status line so learners know the AI is getting ready. With `onRetry`, a failed download can be tried again. */
export function SpeechModelBadge({ status, onRetry }: { status: ModelStatus; onRetry?: () => void }) {
  if (status.state === 'idle' || status.state === 'unavailable') return null;
  const percent = status.progress == null ? null : Math.round(status.progress * 100);
  const text = {
    loading: `Getting speech-to-text ready${percent != null ? ` (${percent}%)` : ''}`,
    ready: 'Speech-to-text is ready.',
    error: `${friendlyModelError(status.error)} Without it there is no transcript or speaking feedback, but your answer is still timed.`,
  }[status.state];

  return (
    <>
      <p className={`model-badge is-${status.state}`} aria-live="polite">
        {status.state === 'error' && <Icon name="warning" />}
        {text}
      </p>
      {status.state === 'error' && onRetry && (
        <Button variant="secondary" onClick={onRetry}>Try the download again</Button>
      )}
    </>
  );
}
