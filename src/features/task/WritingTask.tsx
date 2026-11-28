import { useEffect, useRef, useState } from 'react';
import type { WritingTaskType } from '@/domain/tasks/types';
import type { PracticePrompt } from '@/content/types';
import { promptForModel } from '@/content/promptText';
import { useSession } from '@/app/session';
import { navigate } from '@/app/router';
import { DEFAULT_GOAL, newAttemptId } from '@/domain/attempt';
import { measureWriting } from '@/domain/measure/writingMetrics';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { ruleChecker } from '@/services/grammar/ruleChecker';
import type { GrammarChecker } from '@/domain/grammar';
import { getFeedbackEngine } from '@/services/ai/feedbackEngine';
import { useCountdown } from './useCountdown';
import { ExamBar, TimeRemaining } from './exam/ExamBar';
import { PromptPanel } from './exam/PromptPanel';
import { WritingEditor } from './exam/WritingEditor';
import { ModelPlanBadge } from './ModelPlanBadge';
import { clearDraft, hasUnsavedWork, loadDraft, saveDraft, warnBeforeLeaving } from './exam/unsavedWork';

/**
 * Resolves after the browser has painted. The grammar check blocks the page,
 * so without this "Checking…" would never show before the results open.
 */
function afterPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
}

interface WritingTaskProps {
  task: WritingTaskType;
  prompt: PracticePrompt;
  moduleId: string;
  /** Injectable so a fuller engine (e.g. Harper) can replace the rule checker. */
  grammar?: GrammarChecker;
}

/**
 * Test-style writing task: the timer starts when the screen opens, like
 * test day, and the answer is submitted automatically when time runs out.
 * No spell check or grammar hints while writing; checks run after.
 * Writing tasks never load the speech model, only the feedback model.
 */
export function WritingTask({ task, prompt, moduleId, grammar = ruleChecker }: WritingTaskProps) {
  const { goal, setLastAttempt } = useSession();
  // Brings back a draft if the learner left this task earlier in this tab.
  const [text, setText] = useState(() => loadDraft(moduleId, task.id));
  const [selected, setSelected] = useState<0 | 1 | null>(null);
  const [state, setState] = useState<'writing' | 'checking'>('writing');
  const [timeUp, setTimeUp] = useState(false);
  const textRef = useRef(text);
  textRef.current = text;
  const unsaved = hasUnsavedWork(state === 'writing', text);

  const secondsLeft = useCountdown(task.timing.minutes * 60, state === 'writing' && !timeUp, () => setTimeUp(true));
  const total = getTaskTypesForSkill('writing').length;

  // Warm up the AI coach while the learner writes.
  useEffect(() => {
    void getFeedbackEngine().then((store) => store.preload());
  }, []);

  useEffect(() => {
    if (state === 'writing') saveDraft(moduleId, task.id, text);
  }, [state, text, moduleId, task.id]);

  useEffect(() => {
    if (!unsaved) return;
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [unsaved]);

  const finish = async () => {
    if (state === 'checking') return;
    setState('checking');
    const answer = textRef.current;
    await afterPaint();
    const issues = await grammar.check(answer);
    const metrics = measureWriting({
      text: answer,
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
      promptText: promptForModel(prompt, selected),
      checklist: prompt.checklist,
      goal: goal ?? DEFAULT_GOAL,
      goalChosen: goal !== null,
      text: answer,
      issues,
      options: prompt.options,
      metrics,
    });
    clearDraft(moduleId, task.id);
    navigate('/results');
  };

  // Time's up: submit what's written, as the real test does.
  useEffect(() => {
    if (timeUp && textRef.current.trim()) void finish();
    // finish only needs to run once when time runs out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  return (
    <div className="exam-screen">
      <ExamBar
        position={`Writing Task ${task.order} of ${total}`}
        title={task.title}
        exitTo={`/practice/writing/${moduleId}`}
        exitWarning={unsaved ? 'Your writing is kept in this tab and comes back if you open this task again, but the timer starts over.' : undefined}
        status={<TimeRemaining seconds={secondsLeft} totalSeconds={task.timing.minutes * 60} warnBelow={300} />}
        action={
          <button type="button" className="exam-next" onClick={() => void finish()} disabled={!text.trim() || state === 'checking'} aria-busy={state === 'checking'}>
            {state === 'checking' ? 'Checking…' : 'Next'}
          </button>
        }
      />

      <div className="exam-body exam-columns">
        <PromptPanel task={task} prompt={prompt} selected={selected} onSelect={setSelected} />
        <WritingEditor value={text} onChange={setText} disabled={timeUp || state === 'checking'} wordRange={task.wordRange} />
      </div>

      {timeUp && !text.trim() && (
        <p className="exam-alert" role="alert">Time is up and nothing was written. Exit to try again.</p>
      )}
      <div className="exam-meta">
        <span>Press Next when you finish. Then we check your writing.</span>
        <ModelPlanBadge />
      </div>
    </div>
  );
}
