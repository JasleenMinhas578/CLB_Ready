import type { SpeakingAttempt } from '@/domain/attempt';
import { getCriteria } from '@/domain/criteria';
import { blendScores, codeEstimates, overallLevel, type Scores } from '@/domain/scoring/estimate';
import { codeTips } from '@/domain/scoring/codeTips';
import { Emoji } from '@/components/Emoji';
import { useFeedback } from './useFeedback';
import { AiStatus, ChecklistCard, ImprovedCard, LevelCard, ResultsActions, TipsCard, mergeTips } from './cards';
import { TranscriptView } from './TranscriptView';
import { MeasureTiles } from './MeasureTiles';

export function SpeakingResults({ attempt }: { attempt: SpeakingAttempt }) {
  const { outcome, progress } = useFeedback(attempt);
  const ai = outcome?.kind === 'ai' ? outcome.run.reply : null;
  const modelScores: Partial<Scores> | null = ai
    ? { content: ai.scores.content, vocabulary: ai.scores.vocabulary, listenability: ai.scores.delivery, task: ai.scores.task }
    : null;
  const scores = blendScores(codeEstimates(attempt.metrics), modelScores);
  const overall = overallLevel(scores);
  const final = outcome !== null;

  return (
    <section className="narrow results">
      <div className="screen-head">
        <Emoji symbol={overall >= attempt.goal ? '🎉' : '🍭'} size="xl" motion="bounce" />
        <h1>Your feedback</h1>
        <p>{attempt.taskTitle}</p>
      </div>
      <LevelCard
        attempt={attempt}
        criteria={getCriteria('speaking')}
        scores={scores}
        overall={overall}
        final={final}
        status={<AiStatus outcome={outcome} progress={progress} />}
      />
      <TipsCard goal={attempt.goal} tips={mergeTips(ai?.tips, codeTips(attempt.metrics, attempt.goal), !!ai)} />
      {ai?.improved && <ImprovedCard goal={attempt.goal} text={ai.improved} spoken />}
      <ChecklistCard items={attempt.checklist} results={ai?.checklist ?? null} final={final} />
      <div className="results-card">
        <h2>What we measured</h2>
        <MeasureTiles metrics={attempt.metrics} />
      </div>
      <div className="results-card">
        <h2>What we heard</h2>
        <TranscriptView text={attempt.transcript} words={attempt.words} metrics={attempt.metrics} />
        <p className="fine-print">Speech recognition can drop filler words, so counts are a minimum.</p>
      </div>
      <ResultsActions attempt={attempt} />
    </section>
  );
}
