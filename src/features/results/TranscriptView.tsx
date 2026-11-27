import { Fragment } from 'react';
import { normalizeWord, type SpeakingMetrics, type MetricWord } from '@/domain/measure/speakingMetrics';

interface TranscriptViewProps {
  text: string;
  words: MetricWord[];
  metrics: SpeakingMetrics;
}

const FILLERS = new Set(['um', 'uh', 'er', 'erm', 'ah', 'hmm', 'mm', 'uhm']);

/** The transcript with fillers, vague words and long pauses marked inline. */
export function TranscriptView({ text, words, metrics }: TranscriptViewProps) {
  if (words.length === 0) return <blockquote className="transcript">{text || '(We didn’t hear any words)'}</blockquote>;

  const vague = new Set(metrics.vagueWords);
  const pauseAfter = new Map(metrics.longPauses.map((pause) => [pause.afterWord, pause.seconds]));
  const pauseChip = (seconds: number) => (
    <span className="pause-chip" title="Long pause">
      <span aria-hidden="true">⏸</span> {seconds.toFixed(1)}s
    </span>
  );

  return (
    <>
      <blockquote className="transcript">
        {pauseAfter.has(-1) && <>{pauseChip(pauseAfter.get(-1) ?? 0)} </>}
        {words.map((word, index) => {
          const key = normalizeWord(word.text);
          const kind = FILLERS.has(key) ? 'filler' : vague.has(key) ? 'vague' : null;
          const pause = pauseAfter.get(index);
          return (
            <Fragment key={`${index}-${word.start}`}>
              {kind ? <mark className={`mark-${kind}`}>{word.text}</mark> : word.text}
              {pause != null && <> {pauseChip(pause)}</>}{' '}
            </Fragment>
          );
        })}
      </blockquote>
      <p className="transcript-key">
        <mark className="mark-filler">filler</mark>
        <mark className="mark-vague">general word</mark>
        {pauseChip(2)} pause over 2 seconds
      </p>
    </>
  );
}
