import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import type { ReadingTaskType } from '@/domain/tasks/types';
import type { ReadingPart } from '@/content/objective';
import { useSession } from '@/app/session';
import { navigate } from '@/app/router';
import { DEFAULT_GOAL, newAttemptId } from '@/domain/attempt';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { playBeep } from '@/services/audio/beep';
import { useCountdown } from './useCountdown';
import { ExamBar, TimeRemaining } from './exam/ExamBar';
import { PassageView, QuestionList, type Answers } from './objective/Questions';
import { numberQuestions } from './objective/numbering';

// Matches the breakpoint where exam columns stack (both 860px media queries in exam.css).
const NARROW = '(max-width: 860px)';
const watchNarrow = (onChange: () => void) => {
  const query = window.matchMedia(NARROW);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const isNarrow = () => window.matchMedia(NARROW).matches;

type Tab = 'passage' | 'questions';
const TABS: { id: Tab; label: string }[] = [
  { id: 'passage', label: 'Passage' },
  { id: 'questions', label: 'Questions' },
];

/**
 * Test-style reading part: the passage on the left, questions on the right
 * (blanks sit inside the passage). The clock starts when the screen opens
 * and answers are submitted when time runs out.
 */
export function ReadingTask({ task, part, moduleId }: { task: ReadingTaskType; part: ReadingPart; moduleId: string }) {
  const { goal, setLastAttempt } = useSession();
  const [answers, setAnswers] = useState<Answers>({});
  const [timeUp, setTimeUp] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const secondsLeft = useCountdown(task.timing.minutes * 60, !timeUp, () => setTimeUp(true));
  const { numbers, listed } = numberQuestions(part.blocks, part.questions);
  const answered = part.questions.filter((question) => answers[question.id] != null).length;
  const total = getTaskTypesForSkill('reading').length;
  // On narrow screens the questions would sit a long scroll below the passage, so show one at a time.
  const narrow = useSyncExternalStore(watchNarrow, isNarrow);
  const tabbed = narrow && listed.length > 0;
  const [tab, setTab] = useState<Tab>('passage');
  const tabList = useRef<HTMLDivElement>(null);

  const showTab = (id: Tab) => {
    setTab(id);
    tabList.current?.scrollIntoView({ block: 'nearest' });
  };
  // Arrow keys move between the two tabs, as in the ARIA tabs pattern.
  const onTabKey = (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    // Home and End go to the first and last tab; the arrows switch between the two.
    const next: Tab = event.key === 'Home' ? 'passage' : event.key === 'End' ? 'questions' : tab === 'passage' ? 'questions' : 'passage';
    showTab(next);
    document.getElementById(`reading-tab-${next}`)?.focus();
  };
  // Side by side, each panel carries a small label; as tabs, the tab names it instead.
  const panelProps = (id: Tab) =>
    tabbed
      ? { id: `reading-panel-${id}`, role: 'tabpanel', 'aria-labelledby': `reading-tab-${id}`, hidden: tab !== id }
      : { role: 'region', 'aria-labelledby': `reading-label-${id}` };
  const panelLabel = (id: Tab) =>
    !tabbed && <h2 id={`reading-label-${id}`} className="exam-panel-label">{TABS.find((item) => item.id === id)?.label}</h2>;

  const answer = (id: string, option: number) => setAnswers((current) => ({ ...current, [id]: option }));

  const finish = () => {
    setLastAttempt({
      id: newAttemptId(),
      skill: 'reading',
      moduleId,
      taskTypeId: task.id,
      taskTitle: `Reading part ${task.order}: ${task.title}`,
      partId: part.id,
      answers: Object.fromEntries(part.questions.map((question) => [question.id, answersRef.current[question.id] ?? null])),
      goal: goal ?? DEFAULT_GOAL,
      goalChosen: goal !== null,
    });
    navigate('/results');
  };

  // Results open straight away, so the timer can't beep its own end.
  const finishEarly = () => {
    void playBeep('end');
    finish();
  };

  useEffect(() => {
    if (timeUp) finish();
    // finish only needs to run once when time runs out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  return (
    <div className="exam-screen">
      <ExamBar
        position={`Reading part ${task.order} of ${total}`}
        title={task.title}
        exitTo={`/practice/reading/${moduleId}`}
        status={<TimeRemaining seconds={secondsLeft} totalSeconds={task.timing.minutes * 60} warnBelow={120} />}
        action={<button type="button" className="exam-next" onClick={finishEarly}>Next</button>}
      />
      <p className="exam-instructions">{part.instructions}</p>
      {tabbed && (
        <div className="exam-tabs" role="tablist" aria-label="Passage or questions" ref={tabList}>
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              id={`reading-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-controls={`reading-panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => showTab(id)}
              onKeyDown={onTabKey}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="exam-body exam-columns objective-columns">
        <div className="exam-panel passage-panel" {...panelProps('passage')}>
          {panelLabel('passage')}
          <PassageView blocks={part.blocks} questions={part.questions} numbers={numbers} answers={answers} onAnswer={answer} />
        </div>
        {listed.length > 0 && (
          <div className="exam-panel" {...panelProps('questions')}>
            {panelLabel('questions')}
            <QuestionList questions={listed} numbers={numbers} answers={answers} onAnswer={answer} />
          </div>
        )}
      </div>
      <div className="exam-meta">
        <p>{answered} of {part.questions.length} answered. Unanswered questions count as wrong, so make a guess.</p>
        <p>Time for this part: {task.timing.minutes} minutes.</p>
      </div>
    </div>
  );
}
