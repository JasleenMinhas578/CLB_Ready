import { useSession } from '@/app/session';
import { getCriteria } from '@/domain/criteria';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { blendScores, codeEstimates, overallLevel, MAX_LEVEL, type Scores, type SpeakingCriterionId } from '@/domain/scoring/estimate';
import { codeTips } from '@/domain/scoring/codeTips';
import { LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { href } from '@/app/router';
import { useFeedback, type FeedbackOutcome, type FeedbackProgress } from './useFeedback';
import { TranscriptView } from './TranscriptView';
import { MeasureTiles } from './MeasureTiles';

function AiStatus({ outcome, progress }: { outcome: FeedbackOutcome | null; progress: FeedbackProgress | null }) {
  if (outcome?.kind === 'ai') return null;
  if (outcome?.kind === 'code') {
    return (
      <p className="ai-status is-code">
        <Emoji symbol="🍬" />{' '}
        {outcome.reason === 'light-mode'
          ? 'Light mode: this device can’t run the AI coach, so feedback comes from your measurements only.'
          : 'The AI coach couldn’t finish this time, so feedback comes from your measurements only.'}
      </p>
    );
  }
  const text =
    progress?.phase === 'loading-model'
      ? `Getting the AI coach ready${progress.modelProgress != null ? ` (${Math.round(progress.modelProgress * 100)}%)` : ''}. The first time can take a minute.`
      : progress?.phase === 'writing'
        ? `Pip is writing your feedback${progress.written ? ` (${progress.written} characters)` : ''}…`
        : 'Starting the AI coach…';
  return (
    <p className="ai-status" aria-live="polite">
      <Emoji symbol="🤔" motion="wiggle" /> {text}
    </p>
  );
}

const CRITERION_FOR_SCORE: Record<string, SpeakingCriterionId> = {
  content: 'content',
  vocabulary: 'vocabulary',
  listenability: 'listenability',
  task: 'task',
};

export function ResultsScreen() {
  const { lastAttempt: attempt } = useSession();
  const { outcome, progress } = useFeedback(attempt);

  if (!attempt) {
    return (
      <section className="empty-state">
        <Emoji symbol="🎤" size="xl" motion="float" />
        <h1>No answer to review yet</h1>
        <p>Answer a speaking task and your feedback will appear here. Results are kept only until you close this tab.</p>
        <LinkButton to="/practice/speaking/module-1">Choose a speaking task</LinkButton>
      </section>
    );
  }

  const ai = outcome?.kind === 'ai' ? outcome.run.reply : null;
  const codeScores = codeEstimates(attempt.metrics);
  const modelScores: Partial<Scores> | null = ai
    ? { content: ai.scores.content, vocabulary: ai.scores.vocabulary, listenability: ai.scores.delivery, task: ai.scores.task }
    : null;
  const scores = blendScores(codeScores, modelScores);
  const overall = overallLevel(scores);
  const goal = attempt.goal;
  const final = outcome !== null;

  const fromCode = codeTips(attempt.metrics, goal);
  const tips = [...(ai?.tips ?? []), ...fromCode].filter((tip, i, all) => all.indexOf(tip) === i).slice(0, ai ? 4 : 3);

  const tasks = getTaskTypesForSkill('speaking');
  const index = tasks.findIndex((task) => task.id === attempt.taskTypeId);
  const next = tasks[index + 1];

  return (
    <section className="narrow results">
      <div className="screen-head">
        <Emoji symbol={overall >= goal ? '🎉' : '🍭'} size="xl" motion="bounce" />
        <h1>Your feedback</h1>
        <p>{attempt.taskTitle}</p>
      </div>

      <div className="results-card level-card">
        <div className="level-pair">
          <div>
            <span>Estimated level</span>
            <strong>{final ? '' : '~'}CLB {overall}</strong>
          </div>
          <div>
            <span>Your goal</span>
            <strong>CLB {goal}</strong>
          </div>
        </div>
        {!attempt.goalChosen && (
          <p className="fine-print">
            No goal set, so we used CLB {goal}. <a href={href('/goal')}>Choose your goal</a>.
          </p>
        )}
        <AiStatus outcome={outcome} progress={progress} />
        <ul className="criteria-bars">
          {getCriteria('speaking').map((criterion) => {
            const id = CRITERION_FOR_SCORE[criterion.id];
            const score = scores[id];
            const reached = score >= goal;
            return (
              <li key={criterion.id}>
                <div className="criterion-head">
                  <span>{criterion.name}</span>
                  <strong>
                    {score}
                    {reached ? ' 🎉' : ` (goal ${goal})`}
                  </strong>
                </div>
                <div className="bar" aria-label={`${criterion.name}: about ${score} of ${MAX_LEVEL}, goal ${goal}`}>
                  <span className={`bar-fill ${reached ? 'is-reached' : ''}`} style={{ width: `${(score / MAX_LEVEL) * 100}%` }} />
                  <span className="bar-goal" style={{ left: `${(goal / MAX_LEVEL) * 100}%` }} aria-hidden="true" />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="fine-print">
          {final ? 'Estimates' : 'First estimates from your measurements'} for practice only, not official CELPIP scores.
        </p>
      </div>

      <div className="results-card">
        <h2>To reach CLB {goal}, try this next</h2>
        {tips.length ? (
          <ol className="tips">{tips.map((tip) => <li key={tip}>{tip}</li>)}</ol>
        ) : (
          <p>Your measurements look strong. Keep practising with new prompts.</p>
        )}
      </div>

      {ai?.improved && (
        <div className="results-card improved-card">
          <h2>Your answer at CLB {goal}</h2>
          <p className="fine-print">Your ideas, rewritten at your goal level. Read it aloud once to hear the difference.</p>
          <blockquote className="transcript">{ai.improved}</blockquote>
        </div>
      )}

      <div className="results-card">
        <h2>Did you cover the task?</h2>
        <ul className="checklist">
          {attempt.checklist.map((item, i) => {
            const met = ai ? ai.checklist[i]?.met : undefined;
            return (
              <li key={item} className={met === true ? 'is-met' : met === false ? 'is-missed' : ''}>
                <span aria-hidden="true">{met === true ? '✅' : met === false ? '⭕' : final ? '➖' : '⏳'}</span>
                <span>{item}</span>
                <span className="sr-only">{met === true ? 'covered' : met === false ? 'not covered' : 'not checked'}</span>
              </li>
            );
          })}
        </ul>
        {final && !ai && <p className="fine-print">Checking these needs the AI coach.</p>}
      </div>

      <div className="results-card">
        <h2>What we measured</h2>
        <MeasureTiles metrics={attempt.metrics} />
      </div>

      <div className="results-card">
        <h2>What we heard</h2>
        <TranscriptView text={attempt.transcript} words={attempt.words} metrics={attempt.metrics} />
        <p className="fine-print">Speech recognition can drop filler words, so counts are a minimum.</p>
      </div>

      <div className="row-actions center">
        <LinkButton to={`/task/${attempt.moduleId}/${attempt.taskTypeId}`}>Try this task again</LinkButton>
        {next && (
          <LinkButton to={`/task/${attempt.moduleId}/${next.id}`} variant="secondary">
            Next: task {next.order}
          </LinkButton>
        )}
        <LinkButton to={`/practice/speaking/${attempt.moduleId}`} variant="quiet">All speaking tasks</LinkButton>
      </div>
    </section>
  );
}
