import { useMemo, useState, type ReactNode } from 'react';
import type { Criterion } from '@/domain/criteria';
import { MAX_LEVEL } from '@/domain/scoring/estimate';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { getSkill } from '@/domain/skills';
import { getModuleSummary } from '@/content/modules/catalog';
import { nextTask, taskKey, taskPath, useProgress } from '@/services/progress/progress';
import type { AnyAttempt, Attempt } from '@/domain/attempt';
import { href } from '@/app/router';
import { LinkButton } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Pip } from '@/components/Pip';
import { friendlyModelError } from '@/services/ai/errorText';
import type { FeedbackReply } from '@/services/ai/feedbackPrompt';
import type { AiPerf, AnswerStream, FeedbackOutcome, FeedbackProgress, StepPerf } from './useFeedback';
import { plural } from '@/domain/scoring/sufficiency';
import { DiffView } from './DiffView';
import { diffWords, isMostlyRewritten, summarizeDiff } from '@/domain/diff';

/** Shared building blocks for every skill's results screen. */

export function AiStatus({ outcome, progress }: { outcome: FeedbackOutcome | null; progress: FeedbackProgress | null }) {
  if (outcome?.kind === 'ai' || outcome?.kind === 'sample') return null;
  if (outcome?.kind === 'code') {
    const why =
      outcome.reason === 'light-mode'
        ? 'A level needs Pip, your AI coach. Without Pip we can only measure vocabulary and how clear your answer is.'
        : `${friendlyModelError(outcome.message)} Without Pip we can only measure vocabulary and how clear your answer is.`;
    return (
      <p className="ai-status is-code">
        <Icon name="info" /> <span>{why} <a href={href('/settings')}>Change this in Settings</a></span>
      </p>
    );
  }
  const scoring = progress?.phase === 'scoring';
  const percent = progress?.phase === 'loading-model' && progress.modelProgress != null ? Math.round(progress.modelProgress * 100) : null;
  return (
    <div className="ai-status is-checking">
      <Pip mood="thinking" size={48} />
      <div className="ai-status-body">
        {/* Only the step is announced; the changing percentage stays out of the live region so it isn't read out on every tick. */}
        <p className="ai-status-title" aria-live="polite">
          {scoring ? 'Pip, your AI coach, is checking your answer…' : 'Pip, your AI coach, is getting ready…'}
        </p>
        <p className="ai-status-step">
          {scoring
            ? 'Step 2 of 2.'
            : 'Step 1 of 2. Pip downloads the first time only. This can take a few minutes.'}
        </p>
        {percent !== null && (
          <div className="bar" role="progressbar" aria-label="Pip download" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <span className="bar-fill" style={{ width: `${percent}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

interface LevelCardProps {
  attempt: Attempt;
  criteria: Criterion[];
  /** A criterion without a score is one only Pip can judge, and Pip hasn't (yet). */
  scores: Partial<Record<string, number>>;
  /** Null until Pip has judged the answer: code alone can't give an honest level. */
  overall: number | null;
  final: boolean;
  status: ReactNode;
  /** A note per criterion, shown under that criterion's bar, e.g. when its AI score was ignored. */
  notes?: Partial<Record<string, string>>;
}

export function LevelCard({ attempt, criteria, scores, overall, final, status, notes = {} }: LevelCardProps) {
  const goal = attempt.goal;
  return (
    <div className="results-card level-card" aria-busy={!final}>
      <div className="level-pair">
        <div className="is-level">
          <span>{overall === null ? 'Your level' : 'Estimated level'}</span>
          {overall !== null ? (
            <strong>CLB {overall}</strong>
          ) : (
            <p className="level-pending">{final ? 'Needs Pip' : 'Pip is checking your answer. Your level appears when Pip is done.'}</p>
          )}
        </div>
        <div>
          <span>{attempt.goalChosen ? 'Your goal' : 'Practice goal'}</span>
          <strong>CLB {goal}</strong>
        </div>
      </div>
      {overall !== null && <EstimateNote>Estimates for practice only, not official CELPIP scores.</EstimateNote>}
      {!attempt.goalChosen && (
        <p className="fine-print">
          No goal set, so we used CLB {goal}. <a href={href('/goal')}>Choose your goal</a>.
        </p>
      )}
      {status}
      <ul className="criteria-bars">
        {criteria.map((criterion) => {
          const score = scores[criterion.id];
          if (score === undefined) {
            return (
              <li key={criterion.id}>
                <div className="criterion-head">
                  <span>{criterion.name}</span>
                  <strong>{final ? 'Not checked without Pip' : 'Pip checks this'}</strong>
                </div>
              </li>
            );
          }
          const reached = score >= goal;
          return (
            <li key={criterion.id}>
              <div className="criterion-head">
                <span>{criterion.name}</span>
                <strong>{score} {reached ? '(goal met)' : `(goal ${goal})`}</strong>
              </div>
              <div className="bar" aria-label={`${criterion.name}: about ${score} of ${MAX_LEVEL}, goal ${goal}`}>
                <span className={`bar-fill ${reached ? 'is-reached' : ''}`} style={{ width: `${(score / MAX_LEVEL) * 100}%` }} />
                <span className="bar-goal" style={{ left: `${(goal / MAX_LEVEL) * 100}%` }} aria-hidden="true" />
              </div>
              {notes[criterion.id] && <p className="fine-print score-note">{notes[criterion.id]}</p>}
            </li>
          );
        })}
      </ul>
      {/* Single scores can sit above or below the level, because the level is their average. */}
      {overall !== null && <p className="fine-print">Your level is the average of the {criteria.length} scores above, rounded.</p>}
    </div>
  );
}

/** The quiet "this is an estimate" line that sits right under a level. */
export function EstimateNote({ children }: { children: ReactNode }) {
  return (
    <p className="estimate-note">
      <Icon name="info" size="sm" /> <span>{children}</span>
    </p>
  );
}

export function TipsCard({ goal, tips }: { goal: number; tips: string[] }) {
  return (
    <div className="results-card">
      <h2>To reach CLB {goal}, try this next</h2>
      {tips.length ? <ol className="tips">{tips.map((tip) => <li key={tip}>{tip}</li>)}</ol> : <p>Your measurements look strong. Keep practising with new tasks.</p>}
    </div>
  );
}

interface ImprovedCardProps {
  goal: number;
  text: string;
  spoken: boolean;
  /** True for a model answer written from scratch (nothing to compare). */
  fromScratch?: boolean;
  /** The learner's own answer, to show what changed. */
  original?: string;
}

export function ImprovedCard({ goal, text, spoken, fromScratch = false, original }: ImprovedCardProps) {
  const compareWith = fromScratch || !original?.trim() ? null : original;
  const canCompare = compareWith !== null;
  // Computed once here for both the opening view and the marked changes.
  const diff = useMemo(() => {
    if (compareWith === null) return null;
    const parts = diffWords(compareWith, text);
    return { parts, summary: summarizeDiff(parts) };
  }, [compareWith, text]);
  // When most words are new, the marked view is a wall of colour; start on the clean copy instead.
  const rewritten = !!diff && isMostlyRewritten(diff.summary);
  const [view, setView] = useState<'changes' | 'clean'>(canCompare && !rewritten ? 'changes' : 'clean');

  return (
    <div className="results-card improved-card">
      <div className="improved-head">
        <h2>{fromScratch ? `An example answer at CLB ${goal}` : `Your answer at CLB ${goal}`}</h2>
        {canCompare && (
          <div className="view-switch" role="group" aria-label="How to show the improved answer">
            <button type="button" aria-pressed={view === 'changes'} onClick={() => setView('changes')}>Changes</button>
            <button type="button" aria-pressed={view === 'clean'} onClick={() => setView('clean')}>Clean copy</button>
          </div>
        )}
      </div>
      <p className="fine-print">
        {fromScratch
          ? 'Written by Pip, your AI coach, for this task, as an example to learn from.'
          : view === 'changes'
            ? 'Your answer, edited to your goal level. Added words are in green. Words cut or replaced are crossed out in red.'
            : rewritten
              ? 'Most of your answer was rewritten, so this shows the clean copy first. Choose Changes to see what changed.'
              : 'Your ideas, rewritten at your goal level.'}{' '}
        {spoken ? 'Read it aloud once to hear how it flows.' : 'Notice how each paragraph covers one point.'}
      </p>
      {diff && view === 'changes' ? (
        <DiffView parts={diff.parts} summary={diff.summary} />
      ) : (
        <blockquote className="transcript">{text}</blockquote>
      )}
    </div>
  );
}

/**
 * The improved (or model) answer, which arrives after the scores. Shows it
 * word by word while it's written, then the full card with changes marked.
 */
export function AnswerCard({ answer, goal, spoken, original, fromScratch = false }: {
  answer: AnswerStream | undefined;
  goal: number;
  spoken: boolean;
  original?: string;
  fromScratch?: boolean;
}) {
  if (!answer || answer.state === 'off') return null;
  if (answer.state === 'done') return <ImprovedCard goal={goal} text={answer.text} spoken={spoken} original={original} fromScratch={fromScratch} />;
  const heading = fromScratch ? `An example answer at CLB ${goal}` : `Your answer at CLB ${goal}`;
  if (answer.state === 'failed') {
    return (
      <div className="results-card improved-card">
        <h2>{heading}</h2>
        <p className="fine-print">Pip, your AI coach, could not write this answer this time. Your scores and tips above are complete. Try the task again to get a new answer.</p>
      </div>
    );
  }
  return (
    <div className="results-card improved-card is-writing" aria-busy="true">
      <h2>{heading}</h2>
      <div className="ai-status is-checking">
        <Pip mood="thinking" size={40} />
        <p className="ai-status-title" aria-live="polite">
          {answer.text ? 'Pip, your AI coach, is writing it now…' : 'Pip, your AI coach, is starting to write…'}
          {!fromScratch && ' Changes will be marked when it’s done.'}
        </p>
      </div>
      {answer.text && <blockquote className="transcript streaming-text">{answer.text}</blockquote>}
    </div>
  );
}

export interface ChecklistRow {
  met: boolean | null;
  /** Decided by code rather than the AI coach. */
  byCode?: boolean;
}

export function ChecklistCard({ items, results, final }: { items: string[]; results: ChecklistRow[] | null; final: boolean }) {
  const anyUnchecked = !results || results.some((row) => row.met === null);
  return (
    <div className="results-card">
      <h2>Did you cover the task?</h2>
      <ul className="checklist">
        {items.map((item, i) => {
          const row = results?.[i];
          const met = row?.met ?? null;
          return (
            <li key={item} className={met === true ? 'is-met' : met === false ? 'is-missed' : 'is-unchecked'}>
              <Icon name={met === true ? 'check' : met === false ? 'missed' : final ? 'dash' : 'pending'} />
              <span className="checklist-text">{item}</span>
              {row?.byCode && <span className="checked-by">checked automatically</span>}
              <span className="sr-only">{met === true ? 'covered' : met === false ? 'not covered' : 'not checked'}</span>
            </li>
          );
        })}
      </ul>
      {final && anyUnchecked && <p className="fine-print">Items marked <Icon name="dash" size="sm" label="with a dash" /> were not checked. Only Pip can check them.</p>}
    </div>
  );
}

type ActionAttempt = Pick<AnyAttempt, 'skill' | 'moduleId' | 'taskTypeId'>;

/**
 * What to do after this result. The next unfinished task in the same skill is
 * the main step; "Try again" leads instead when the answer was too short to score.
 */
export function ResultsActions({ attempt, compact = false, retryFirst = false }: {
  attempt: ActionAttempt;
  /** Leave out the "All tasks" link, for the copy at the top of the screen. */
  compact?: boolean;
  retryFirst?: boolean;
}) {
  const progress = useProgress();
  const isDone = (moduleId: string, taskTypeId: string) => !!progress[taskKey(moduleId, taskTypeId)];
  const tasks = getTaskTypesForSkill(attempt.skill);
  const later = tasks.slice(tasks.findIndex((task) => task.id === attempt.taskTypeId) + 1).find((task) => !isDone(attempt.moduleId, task.id));
  const next = later ? { moduleId: attempt.moduleId, task: later } : nextTask(progress, attempt.skill);
  // When every task in this skill is finished, nextTask loops back to one already done; there's no "next" then.
  const hasNext = !isDone(next.moduleId, next.task.id);
  const skillName = getSkill(attempt.skill)?.name ?? attempt.skill;
  const unit = attempt.skill === 'reading' || attempt.skill === 'listening' ? 'part' : 'task';
  const where = next.moduleId === attempt.moduleId ? '' : `${getModuleSummary(next.moduleId)?.title ?? next.moduleId}, `;
  const nextFirst = hasNext && !retryFirst;
  const nextLink = hasNext && (
    <LinkButton to={taskPath(next)} variant={nextFirst ? 'primary' : 'secondary'}>
      Next: {where}{skillName} {unit} {next.task.order} <Icon name="arrow-right" />
    </LinkButton>
  );

  return (
    <div className={`results-actions${compact ? ' is-compact' : ''}`}>
      {nextFirst && nextLink}
      <LinkButton to={`/task/${attempt.moduleId}/${attempt.taskTypeId}`} variant={nextFirst ? 'secondary' : 'primary'}>
        Try this {unit} again
      </LinkButton>
      {!nextFirst && nextLink}
      {!compact && (
        <LinkButton to={`/practice/${attempt.skill}/${attempt.moduleId}`} variant="quiet">
          All {skillName} {unit}s
        </LinkButton>
      )}
    </div>
  );
}

/** The results heading: what was practised, with the next step beside it so it's seen before scrolling. */
export function ResultsHead({ attempt, title, retryFirst = false }: {
  attempt: ActionAttempt & { taskTitle: string };
  title: string;
  retryFirst?: boolean;
}) {
  return (
    <header className="results-head">
      <div>
        <h1>{title}</h1>
        <p>{attempt.taskTitle}</p>
      </div>
      <ResultsActions attempt={attempt} compact retryFirst={retryFirst} />
    </header>
  );
}

/** Merges AI tips (first) with code tips, without duplicates. */
export function mergeTips(reply: FeedbackReply | null, codeTips: string[]): string[] {
  // An answer that isn't about the task needs that fixed before anything else.
  const aiTips = reply ? [...(reply.onTask ? [] : [reply.onTaskReason]), ...reply.tips] : [];
  return [...aiTips, ...codeTips].filter((tip, i, all) => all.indexOf(tip) === i).slice(0, reply ? 4 : 3);
}

/**
 * Shown instead of scores when an answer is too short to estimate a level.
 * Explains what's needed and offers a model answer to learn from.
 */
export function TooShortCard({ attempt, need, unit, outcome, progress }: {
  attempt: Attempt;
  need: string;
  unit: string;
  outcome: FeedbackOutcome | null;
  progress: FeedbackProgress | null;
}) {
  return (
    <div className="results-card too-short-card">
      <h2>Too short to score</h2>
      <p>
        Your answer has {plural(attempt.metrics.wordCount, unit)}. We need {need} to estimate a level, so there is no score this
        time. Try the task again and give a longer answer.
      </p>
      {!attempt.goalChosen && (
        <p className="fine-print">
          No goal set, so the example answer below is written at CLB {attempt.goal}. <a href={href('/goal')}>Choose your goal</a>.
        </p>
      )}
      {outcome === null ? (
        <AiStatus outcome={outcome} progress={progress} />
      ) : outcome.kind === 'code' ? (
        <AiStatus outcome={outcome} progress={progress} />
      ) : null}
    </div>
  );
}

function seconds(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`;
}

function stepRows(label: string, step: StepPerf): [string, string][] {
  return [
    [`${label}: first word after`, seconds(step.firstTokenMs)],
    [`${label}: writing time`, seconds(step.generateMs)],
    [`${label}: tokens in / out`, `${step.inputTokens} / ${step.outputTokens}${step.attempts > 1 ? ` (${step.attempts} tries)` : ''}`],
  ];
}

/**
 * How fast the AI ran on this device: useful for testing and for
 * explaining the app's performance. Collapsed by default.
 */
export function PerfCard({ perf, transcribeMs }: { perf: AiPerf; transcribeMs?: number }) {
  const speed = perf.answer?.tokensPerSecond ?? perf.scoring?.tokensPerSecond;
  const rows: [string, string][] = [
    ['Pip’s model', perf.model ?? 'Unknown'],
    ['Model load', perf.loadMs == null ? 'Already loaded' : seconds(perf.loadMs)],
    ...(transcribeMs != null ? ([['Speech-to-text', seconds(transcribeMs)]] as [string, string][]) : []),
    ...(perf.scoresWaitMs != null ? ([['Scores on screen after', seconds(perf.scoresWaitMs)]] as [string, string][]) : []),
    ['Full answer on screen after', perf.answerWaitMs != null ? seconds(perf.answerWaitMs) : 'Still writing…'],
    ...(speed != null ? ([['Writing speed', `${speed.toFixed(1)} tokens/s`]] as [string, string][]) : []),
    ...(perf.scoring ? stepRows('Scores', perf.scoring) : []),
    ...(perf.answer ? stepRows('Answer', perf.answer) : []),
  ];
  return (
    <details className="results-card perf-card">
      <summary>AI speed on this device</summary>
      <dl className="perf-grid">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="fine-print">Measured in your browser. Scores come first. The answer is written while you read them. A token is about three quarters of a word.</p>
    </details>
  );
}

/** Explains an ignored AI score in plain words, keyed by the criterion it changed. */
export function outlierNotes(ignored: { id: string; modelScore: number }[]): Record<string, string> {
  return Object.fromEntries(
    ignored.map(({ id, modelScore }) => [
      id,
      `Pip gave this a ${modelScore}. That did not fit your other results, so this score uses your measurements instead.`,
    ]),
  );
}
