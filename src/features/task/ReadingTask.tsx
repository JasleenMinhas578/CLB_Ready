import { useEffect, useRef, useState } from 'react';
import type { ReadingTaskType } from '@/domain/tasks/types';
import type { ReadingPart } from '@/content/objective';
import { useSession } from '@/app/session';
import { navigate } from '@/app/router';
import { DEFAULT_GOAL, newAttemptId } from '@/domain/attempt';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { useCountdown } from './useCountdown';
import { ExamBar, TimeRemaining } from './exam/ExamBar';
import { PassageView, QuestionList, type Answers } from './objective/Questions';
import { numberQuestions } from './objective/numbering';

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

  useEffect(() => {
    if (timeUp) finish();
    // finish only needs to run once when time runs out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  return (
    <div className="exam-screen">
      <ExamBar
        position={`Reading Part ${task.order} of ${total}`}
        title={task.title}
        exitTo={`/practice/reading/${moduleId}`}
        status={<TimeRemaining seconds={secondsLeft} warnBelow={120} />}
        action={<button type="button" className="exam-next" onClick={finish}>Next</button>}
      />
      <p className="exam-instructions">{part.instructions}</p>
      <div className="exam-body exam-columns objective-columns">
        <div className="exam-panel passage-panel">
          <PassageView blocks={part.blocks} questions={part.questions} numbers={numbers} answers={answers} onAnswer={answer} />
        </div>
        {listed.length > 0 && (
          <div className="exam-panel">
            <QuestionList questions={listed} numbers={numbers} answers={answers} onAnswer={answer} />
          </div>
        )}
      </div>
      <div className="exam-meta">
        <span>{answered} of {part.questions.length} answered. Unanswered questions count as wrong, so make a guess.</span>
        <span>Suggested time for this part: {task.timing.minutes} minutes.</span>
      </div>
    </div>
  );
}
