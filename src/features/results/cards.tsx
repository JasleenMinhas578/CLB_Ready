import { useState, type ReactNode } from 'react';
import type { Criterion } from '@/domain/criteria';
import { MAX_LEVEL } from '@/domain/scoring/estimate';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import type { AnyAttempt, Attempt } from '@/domain/attempt';
import { href } from '@/app/router';
import { LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { friendlyModelError } from '@/services/ai/errorText';
import type { AiPerf, AnswerStream, FeedbackOutcome, FeedbackProgress, StepPerf } from './useFeedback';
import { plural } from '@/domain/scoring/sufficiency';
import { DiffView } from './DiffView';
import { isMostlyRewritten } from '@/domain/diff';

/** Shared building blocks for every skill's results screen. */

export function AiStatus({ outcome, progress }: { outcome: FeedbackOutcome | null; progress: FeedbackProgress | null }) {
  if (outcome?.kind === 'ai' || outcome?.kind === 'sample') return null;
  if (outcome?.kind === 'code') {
    const why =
      outcome.reason === 'light-mode'
        ? 'Light mode is on, so there is no AI coach. This feedback uses your measurements only.'
        : `${friendlyModelError(outcome.message)} The feedback below uses your measurements only.`;
    return (
      <p className="ai-status is-code">
        <Emoji symbol="🍬" /> <span>{why} <a href={href('/settings')}>Settings</a></span>
      </p>
    );
  }
  const text =
    progress?.phase === 'loading-model'
      ? `Getting the AI coach ready${progress.modelProgress != null ? ` (${Math.round(progress.modelProgress * 100)}%)` : ''}. The first time can take a few minutes.`
      : progress?.phase === 'scoring'
        ? `Pip is checking your answer${progress.written ? ` (${progress.written} characters so far)` : ''}…`
        : 'Starting the AI coach…';
  return (
    <p className="ai-status" aria-live="polite">
      <Emoji symbol="🤔" /> {text}
    </p>
  );
}

interface LevelCardProps {
  attempt: Attempt;
  criteria: Criterion[];
  scores: Record<string, number>;
  overall: number;
  final: boolean;
  status: ReactNode;
  /** A note per criterion, shown under that criterion's bar, e.g. when its AI score was ignored. */
  notes?: Partial<Record<string, string>>;
}

export function LevelCard({ attempt, criteria, scores, overall, final, status, notes = {} }: LevelCardProps) {
  const goal = attempt.goal;
  return (
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
      {/* Single scores can sit above or below the level, because the level is their average. */}
      <p className="fine-print">Your level is the average of the {criteria.length} scores below, rounded.</p>
      {!attempt.goalChosen && (
        <p className="fine-print">
          No goal set, so we used CLB {goal}. <a href={href('/goal')}>Choose your goal</a>.
        </p>
      )}
      {status}
      <ul className="criteria-bars">
        {criteria.map((criterion) => {
          const score = scores[criterion.id] ?? 0;
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
      <p className="fine-print">{final ? 'Estimates' : 'First estimates from your measurements'} for practice only, not official CELPIP scores.</p>
    </div>
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
  const canCompare = !fromScratch && !!original?.trim();
  // When most words are new, the marked view is a wall of colour; start on the clean copy instead.
  const rewritten = canCompare && isMostlyRewritten(original ?? '', text);
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
          ? 'Written by the AI coach for this task, as an example to learn from.'
          : view === 'changes'
            ? 'Your answer, edited to your goal level. Green is new; red was cut or replaced.'
            : rewritten
              ? 'Most of your answer was rewritten, so this shows the clean copy first. Choose Changes to see what changed.'
              : 'Your ideas, rewritten at your goal level.'}{' '}
        {spoken ? 'Read it aloud once to hear how it flows.' : 'Notice how each paragraph covers one point.'}
      </p>
      {canCompare && view === 'changes' && original ? (
        <DiffView before={original} after={text} />
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
        <p className="fine-print">Pip couldn’t write this answer this time. Your scores and tips above are complete. Try the task again for a new one.</p>
      </div>
    );
  }
  return (
    <div className="results-card improved-card is-writing" aria-busy="true">
      <h2>{heading}</h2>
      <p className="ai-status" aria-live="polite">
        <Emoji symbol="✍️" /> {answer.text ? 'Pip is writing it now…' : 'Pip is starting to write…'}
        {!fromScratch && ' Changes will be marked when it’s done.'}
      </p>
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
            <li key={item} className={met === true ? 'is-met' : met === false ? 'is-missed' : ''}>
              <span aria-hidden="true">{met === true ? '✅' : met === false ? '⭕' : final ? '➖' : '⏳'}</span>
              <span className="checklist-text">{item}</span>
              {row?.byCode && <span className="checked-by">checked automatically</span>}
              <span className="sr-only">{met === true ? 'covered' : met === false ? 'not covered' : 'not checked'}</span>
            </li>
          );
        })}
      </ul>
      {final && anyUnchecked && <p className="fine-print">Items marked ➖ were not checked. Only the AI coach can check them.</p>}
    </div>
  );
}

export function ResultsActions({ attempt }: { attempt: Pick<AnyAttempt, 'skill' | 'moduleId' | 'taskTypeId'> }) {
  const tasks = getTaskTypesForSkill(attempt.skill);
  const next = tasks[tasks.findIndex((task) => task.id === attempt.taskTypeId) + 1];
  const skillName = attempt.skill;
  const unit = attempt.skill === 'reading' || attempt.skill === 'listening' ? 'part' : 'task';
  return (
    <div className="row-actions center">
      <LinkButton to={`/task/${attempt.moduleId}/${attempt.taskTypeId}`}>Try this {unit} again</LinkButton>
      {next && (
        <LinkButton to={`/task/${attempt.moduleId}/${next.id}`} variant="secondary">
          Next: {skillName} {unit} {next.order}
        </LinkButton>
      )}
      <LinkButton to={`/practice/${attempt.skill}/${attempt.moduleId}`} variant="quiet">All {skillName} {unit}s</LinkButton>
    </div>
  );
}

/** Merges AI tips (first) with code tips, without duplicates. */
export function mergeTips(aiTips: string[] | undefined, codeTips: string[], hasAi: boolean): string[] {
  return [...(aiTips ?? []), ...codeTips].filter((tip, i, all) => all.indexOf(tip) === i).slice(0, hasAi ? 4 : 3);
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
        Your answer has {plural(attempt.metrics.wordCount, unit)}. We need {need} to estimate a level, so there’s no score this
        time. Try the task again and keep going until you reach the target.
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
    ['AI coach', perf.model ?? 'Unknown'],
    ['Model load', perf.loadMs == null ? 'Already loaded' : seconds(perf.loadMs)],
    ...(transcribeMs != null ? ([['Speech to text', seconds(transcribeMs)]] as [string, string][]) : []),
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
      <p className="fine-print">Measured in your browser. Scores come first; the answer is written while you read them. A token is about three quarters of a word.</p>
    </details>
  );
}

/** Explains an ignored AI score in plain words, keyed by the criterion it changed. */
export function outlierNotes(ignored: { id: string; modelScore: number }[]): Record<string, string> {
  return Object.fromEntries(
    ignored.map(({ id, modelScore }) => [
      id,
      `The AI coach gave this a ${modelScore}, which didn’t fit your other results, so this score uses your measurements instead.`,
    ]),
  );
}
