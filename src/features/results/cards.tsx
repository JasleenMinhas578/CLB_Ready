import type { ReactNode } from 'react';
import type { Criterion } from '@/domain/criteria';
import { MAX_LEVEL } from '@/domain/scoring/estimate';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import type { Attempt } from '@/domain/attempt';
import { href } from '@/app/router';
import { LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { friendlyModelError } from '@/services/ai/errorText';
import type { AiPerf, FeedbackOutcome, FeedbackProgress } from './useFeedback';
import { plural } from '@/domain/scoring/sufficiency';

/** Shared building blocks for every skill's results screen. */

export function AiStatus({ outcome, progress }: { outcome: FeedbackOutcome | null; progress: FeedbackProgress | null }) {
  if (outcome?.kind === 'ai' || outcome?.kind === 'sample') return null;
  if (outcome?.kind === 'code') {
    const why =
      outcome.reason === 'light-mode'
        ? 'Light mode: this device can’t run the AI coach, so feedback comes from your measurements only.'
        : `${friendlyModelError(outcome.message)} Feedback below comes from your measurements only. Try again in a moment.`;
    return (
      <p className="ai-status is-code">
        <Emoji symbol="🍬" /> {why} <a href={href('/settings')}>Settings</a>
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

interface LevelCardProps {
  attempt: Attempt;
  criteria: Criterion[];
  scores: Record<string, number>;
  overall: number;
  final: boolean;
  status: ReactNode;
}

export function LevelCard({ attempt, criteria, scores, overall, final, status }: LevelCardProps) {
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
                <strong>{score}{reached ? ' 🎉' : ` (goal ${goal})`}</strong>
              </div>
              <div className="bar" aria-label={`${criterion.name}: about ${score} of ${MAX_LEVEL}, goal ${goal}`}>
                <span className={`bar-fill ${reached ? 'is-reached' : ''}`} style={{ width: `${(score / MAX_LEVEL) * 100}%` }} />
                <span className="bar-goal" style={{ left: `${(goal / MAX_LEVEL) * 100}%` }} aria-hidden="true" />
              </div>
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
      {tips.length ? <ol className="tips">{tips.map((tip) => <li key={tip}>{tip}</li>)}</ol> : <p>Your measurements look strong. Keep practising with new prompts.</p>}
    </div>
  );
}

export function ImprovedCard({ goal, text, spoken, fromScratch = false }: { goal: number; text: string; spoken: boolean; fromScratch?: boolean }) {
  return (
    <div className="results-card improved-card">
      <h2>{fromScratch ? `A model answer at CLB ${goal}` : `Your answer at CLB ${goal}`}</h2>
      <p className="fine-print">
        {fromScratch ? 'Written by the AI coach for this task, as an example to learn from.' : 'Your ideas, rewritten at your goal level.'}{' '}
        {spoken ? 'Read it aloud once to hear how it flows.' : 'Notice how each paragraph covers one point.'}
      </p>
      <blockquote className="transcript">{text}</blockquote>
    </div>
  );
}

export function ChecklistCard({ items, results, final }: { items: string[]; results: { met: boolean }[] | null; final: boolean }) {
  return (
    <div className="results-card">
      <h2>Did you cover the task?</h2>
      <ul className="checklist">
        {items.map((item, i) => {
          const met = results ? results[i]?.met : undefined;
          return (
            <li key={item} className={met === true ? 'is-met' : met === false ? 'is-missed' : ''}>
              <span aria-hidden="true">{met === true ? '✅' : met === false ? '⭕' : final ? '➖' : '⏳'}</span>
              <span>{item}</span>
              <span className="sr-only">{met === true ? 'covered' : met === false ? 'not covered' : 'not checked'}</span>
            </li>
          );
        })}
      </ul>
      {final && !results && <p className="fine-print">Checking these needs the AI coach.</p>}
    </div>
  );
}

export function ResultsActions({ attempt }: { attempt: Attempt }) {
  const tasks = getTaskTypesForSkill(attempt.skill);
  const next = tasks[tasks.findIndex((task) => task.id === attempt.taskTypeId) + 1];
  const skillName = attempt.skill === 'speaking' ? 'speaking' : 'writing';
  return (
    <div className="row-actions center">
      <LinkButton to={`/task/${attempt.moduleId}/${attempt.taskTypeId}`}>Try this task again</LinkButton>
      {next && (
        <LinkButton to={`/task/${attempt.moduleId}/${next.id}`} variant="secondary">
          Next: {skillName} task {next.order}
        </LinkButton>
      )}
      <LinkButton to={`/practice/${attempt.skill}/${attempt.moduleId}`} variant="quiet">All {skillName} tasks</LinkButton>
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
          No goal set, so the model answer below is written at CLB {attempt.goal}. <a href={href('/goal')}>Choose your goal</a>.
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

/**
 * How fast the AI ran on this device: useful for testing and for
 * explaining the app's performance. Collapsed by default.
 */
export function PerfCard({ perf, transcribeMs }: { perf: AiPerf; transcribeMs?: number }) {
  const rows: [string, string][] = [
    ['AI coach', perf.model ?? 'Unknown'],
    ['Model load', perf.loadMs == null ? 'Already loaded' : seconds(perf.loadMs)],
    ...(transcribeMs != null ? ([['Speech to text', seconds(transcribeMs)]] as [string, string][]) : []),
    ['First word after', seconds(perf.firstTokenMs)],
    ['Writing speed', `${perf.tokensPerSecond.toFixed(1)} tokens/s`],
    ['Writing time', seconds(perf.generateMs)],
    ['Tokens in / out', `${perf.inputTokens} / ${perf.outputTokens}`],
    ['Tries needed', String(perf.attempts)],
    ['Total wait', seconds(perf.totalWaitMs)],
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
      <p className="fine-print">Measured in your browser. A token is about three quarters of a word.</p>
    </details>
  );
}
