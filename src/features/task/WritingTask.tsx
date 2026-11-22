import { useState } from 'react';
import type { WritingTaskType } from '@/domain/tasks/types';
import { Button, LinkButton } from '@/components/Button';
import { formatSeconds } from '@/components/TimerRing';
import { countWords } from './phases';
import { useCountdown } from './useCountdown';

/** Timed writing box with a live word count against the task's range. */
export function WritingTask({ task }: { task: WritingTaskType }) {
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const secondsLeft = useCountdown(task.timing.minutes * 60, started && !finished, () => setFinished(true));

  const words = countWords(text);
  const { min, max } = task.wordRange;
  const status = words === 0 ? 'empty' : words < min ? 'short' : words > max ? 'long' : 'good';
  const statusText = {
    empty: `Aim for ${min}–${max} words`,
    short: `${min - words} more to reach ${min}`,
    good: 'Right in range',
    long: `${words - max} over ${max}`,
  }[status];

  return (
    <div className="flow-panel">
      <div className="writing-bar">
        <span className={`word-count is-${status}`} aria-live="polite">
          <strong>{words}</strong> words, {statusText}
        </span>
        <span className="writing-clock" role="timer">
          {started ? formatSeconds(secondsLeft) : `${task.timing.minutes}:00`} left
        </span>
      </div>

      <label className="sr-only" htmlFor="answer">Your answer</label>
      <textarea
        id="answer"
        className="writing-box"
        value={text}
        disabled={finished}
        placeholder="Start typing your answer here…"
        onChange={(event) => {
          if (!started) setStarted(true);
          setText(event.target.value);
        }}
        spellCheck={false}
      />
      <p className="fine-print">Spell check is off, as on test day.</p>

      <div className="row-actions">
        {finished ? (
          <LinkButton to="/results/sample">See sample results</LinkButton>
        ) : (
          <Button onClick={() => setFinished(true)} disabled={words === 0}>Finish and get feedback</Button>
        )}
      </div>
    </div>
  );
}
