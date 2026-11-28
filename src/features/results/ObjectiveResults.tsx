import type { ObjectiveAttempt } from '@/domain/attempt';
import { use } from 'react';
import { getObjectivePart, loadModule } from '@/content/modules';
import { partQuestions, type ChoiceQuestion, type ListeningClip } from '@/content/objective';
import { correctForGoal, estimateObjective } from '@/domain/scoring/objective';
import { href } from '@/app/router';
import { NotFound } from '@/components/NotFound';
import { Icon } from '@/components/Icon';
import { numberQuestions } from '@/features/task/objective/numbering';
import { EstimateNote, ResultsActions, ResultsHead } from './cards';

/** Results for a reading or listening part: the score, an estimated level and every answer explained. */
export function ObjectiveResults({ attempt }: { attempt: ObjectiveAttempt }) {
  const part = getObjectivePart(use(loadModule(attempt.moduleId)), attempt.taskTypeId);
  if (!part) return <NotFound />;
  const questions = partQuestions(part);
  const numbers = 'blocks' in part ? numberQuestions(part.blocks, part.questions).numbers : new Map(questions.map((question, index) => [question.id, index + 1]));
  const ordered = [...questions].sort((a, b) => (numbers.get(a.id) ?? 0) - (numbers.get(b.id) ?? 0));
  const correct = questions.filter((question) => attempt.answers[question.id] === question.answer).length;
  const estimate = estimateObjective(attempt.skill, correct, questions.length);
  const target = correctForGoal(attempt.skill, attempt.goal, questions.length);
  const reached = correct >= target;
  const blanks = questions.filter((question) => attempt.answers[question.id] == null).length;

  return (
    <section className={`results results-${attempt.skill}`}>
      <ResultsHead attempt={attempt} title="Your results" />
      <div className="results-grid">
        <div className="results-side">
          <div className="results-card level-card">
            <div className="level-pair">
              <div>
                <span>Correct answers</span>
                <strong>{correct} of {questions.length}</strong>
              </div>
              <div className="is-level">
                <span>Estimated level</span>
                <strong>{estimate.level === null ? 'Below CLB 3' : estimate.level >= 10 ? 'CLB 10+' : `CLB ${estimate.level}`}</strong>
              </div>
            </div>
            <EstimateNote>Estimate for practice only, not an official CELPIP score.</EstimateNote>
            <p className={`goal-line ${reached ? 'is-reached' : ''}`}>
              {reached && <Icon name="check" />}{' '}
              {reached
                ? `On track for your goal of CLB ${attempt.goal}.`
                : `For CLB ${attempt.goal}, aim for about ${target} of ${questions.length} in this part.`}
            </p>
            {!attempt.goalChosen && (
              <p className="fine-print">No goal set, so we used CLB {attempt.goal}. <a href={href('/goal')}>Choose your goal</a>.</p>
            )}
            {blanks > 0 && <p className="fine-print">{blanks} left blank. On test day, a wrong guess does not lose marks, so always answer.</p>}
            <p className="fine-print">
              This level uses a CELPIP score chart for the full {attempt.skill} test, scaled to this part. One part has only{' '}
              {questions.length} questions, so treat the level as a rough guide.
            </p>
          </div>
        </div>
        <div className="results-main">
          <div className="results-card">
            <h2>Your answers</h2>
            <ol className="answer-review">
              {ordered.map((question) => (
                <AnswerRow key={question.id} question={question} number={numbers.get(question.id) ?? 0} chosen={attempt.answers[question.id] ?? null} />
              ))}
            </ol>
          </div>
          {'clips' in part && (
            <div className="results-card">
              <h2>What you heard</h2>
              <p className="fine-print">Read what was said while you check your answers. Look for the words that give each answer.</p>
              {part.clips.map((clip, index) => <Transcript key={clip.id} clip={clip} index={index} count={part.clips.length} />)}
            </div>
          )}
        </div>
      </div>
      <ResultsActions attempt={attempt} />
    </section>
  );
}

function AnswerRow({ question, number, chosen }: { question: ChoiceQuestion; number: number; chosen: number | null }) {
  const right = chosen === question.answer;
  return (
    <li className={`answer-row ${right ? 'is-right' : 'is-wrong'}`} value={number}>
      <p className="answer-question">
        <Icon name={right ? 'check' : 'missed'} /> {question.text || `Blank ${number}`}
        <span className="sr-only">{right ? 'Correct' : 'Incorrect'}</span>
      </p>
      {!right && (
        <p className="answer-yours">
          Your answer: <span className={chosen === null ? 'is-blank' : undefined}>{chosen === null ? 'No answer' : question.options[chosen]}</span>
        </p>
      )}
      <p className="answer-correct">
        {right ? 'Answer' : 'Correct answer'}: <strong>{question.options[question.answer]}</strong>
      </p>
      <p className="answer-why">{question.why}</p>
    </li>
  );
}

function Transcript({ clip, index, count }: { clip: ListeningClip; index: number; count: number }) {
  return (
    <details className="clip-transcript" open={count === 1}>
      <summary>{count > 1 ? `Recording ${index + 1}` : 'Recording'}: {clip.intro}</summary>
      <dl>
        {clip.lines.map((line, lineIndex) => (
          <div key={lineIndex}>
            <dt>{line.speaker}</dt>
            <dd>{line.text}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
