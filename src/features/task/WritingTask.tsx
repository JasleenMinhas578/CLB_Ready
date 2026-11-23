import { useEffect, useState } from 'react';
import type { WritingTaskType } from '@/domain/tasks/types';
import type { PracticePrompt } from '@/content/types';
import { useSession } from '@/app/session';
import { navigate } from '@/app/router';
import { DEFAULT_GOAL, newAttemptId } from '@/domain/attempt';
import { measureWriting } from '@/domain/measure/writingMetrics';
import { Button } from '@/components/Button';
import { formatSeconds } from '@/components/TimerRing';
import { ruleChecker } from '@/services/grammar/ruleChecker';
import type { GrammarChecker } from '@/domain/grammar';
import { getFeedbackEngine } from '@/services/ai/feedbackEngine';
import { countWords } from './phases';
import { useCountdown } from './useCountdown';

interface WritingTaskProps {
  task: WritingTaskType;
  prompt: PracticePrompt;
  moduleId: string;
  /** Injectable so a fuller engine (e.g. Harper) can replace the rule checker. */
  grammar?: GrammarChecker;
}

/**
 * Timed writing box with a live word count, like test day: no spell check
 * or grammar hints while writing. Checks run when the learner finishes.
 * Writing tasks never load the speech model, only the feedback model.
 */
export function WritingTask({ task, prompt, moduleId, grammar = ruleChecker }: WritingTaskProps) {
  const { goal, setLastAttempt } = useSession();
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<'writing' | 'checking'>('writing');
  const [timeUp, setTimeUp] = useState(false);
  const secondsLeft = useCountdown(task.timing.minutes * 60, started && state === 'writing' && !timeUp, () => setTimeUp(true));

  // Warm up the AI coach while the learner writes.
  useEffect(() => {
    void getFeedbackEngine().then((store) => store.preload());
  }, []);

  const words = countWords(text);
  const { min, max } = task.wordRange;
  const status = words === 0 ? 'empty' : words < min ? 'short' : words > max ? 'long' : 'good';
  const statusText = {
    empty: `Aim for ${min}–${max} words`,
    short: `${min - words} more to reach ${min}`,
    good: 'Right in range',
    long: `${words - max} over ${max}`,
  }[status];

  const finish = async () => {
    setState('checking');
    const issues = await grammar.check(text);
    const metrics = measureWriting({
      text,
      wordRange: task.wordRange,
      grammarIssues: issues.length,
      emailTone: task.order === 1 ? (prompt.tone ?? 'formal') : undefined,
      options: prompt.options,
    });
    setLastAttempt({
      skill: 'writing',
      id: newAttemptId(),
      moduleId,
      taskTypeId: task.id,
      taskTitle: `Writing task ${task.order}: ${task.title}`,
      promptText: prompt.options ? `${prompt.text} Options: ${prompt.options.join(' / ')}` : prompt.text,
      checklist: prompt.checklist,
      goal: goal ?? DEFAULT_GOAL,
      goalChosen: goal !== null,
      text,
      issues,
      options: prompt.options,
      metrics,
    });
    navigate('/results');
  };

  return (
    <div className="flow-panel">
      <div className="writing-bar">
        <span className={`word-count is-${status}`} aria-live="polite">
          <strong>{words}</strong> words, {statusText}
        </span>
        <span className="writing-clock" role="timer">
          {timeUp ? 'Time’s up' : started ? `${formatSeconds(secondsLeft)} left` : `${task.timing.minutes}:00 left`}
        </span>
      </div>

      <label className="sr-only" htmlFor="answer">Your answer</label>
      <textarea
        id="answer"
        className="writing-box"
        value={text}
        disabled={timeUp || state === 'checking'}
        placeholder="Start typing your answer here…"
        onChange={(event) => {
          if (!started) setStarted(true);
          setText(event.target.value);
        }}
        spellCheck={false}
      />
      <p className="fine-print">Spell check is off, as on test day. Mistakes are marked after you finish.</p>

      <div className="row-actions">
        <Button onClick={() => void finish()} disabled={words === 0 || state === 'checking'}>
          {state === 'checking' ? 'Checking…' : timeUp ? 'Get feedback' : 'Finish and get feedback'}
        </Button>
      </div>
    </div>
  );
}
