import type { SpeakingAttempt } from '@/domain/attempt';
import { getCriteria } from '@/domain/criteria';
import { blendScores, codeEstimates, overallLevel, type Scores } from '@/domain/scoring/estimate';
import { codeTips } from '@/domain/scoring/codeTips';
import { Emoji } from '@/components/Emoji';
import { useFeedback } from './useFeedback';
import { AiStatus, ChecklistCard, ImprovedCard, LevelCard, ResultsActions, TipsCard, TooShortCard, mergeTips } from './cards';
import { MIN_SCORABLE_SPEAKING_WORDS, isScorable, lengthCeiling } from '@/domain/scoring/sufficiency';
import { TranscriptView } from './TranscriptView';
import { MeasureTiles } from './MeasureTiles';

export function SpeakingResults({ attempt }: { attempt: SpeakingAttempt }) {
  const scorable = isScorable('speaking', attempt.metrics.wordCount);
  const { outcome, progress } = useFeedback(attempt);
  const ai = outcome?.kind === 'ai' ? outcome.run.reply : null;
  const sample = outcome?.kind === 'sample' ? outcome.answer : null;

  if (!scorable) {
    return (
      <section className="narrow results">
        <div className="screen-head">
          <h1>Your feedback</h1>
          <p>{attempt.taskTitle}</p>
        </div>
        <TooShortCard
          attempt={attempt}
          need={`at least ${MIN_SCORABLE_SPEAKING_WORDS} spoken words`}
          unit="word"
          outcome={outcome}
          progress={progress}
        />
        {sample && <ImprovedCard goal={attempt.goal} text={sample} spoken fromScratch />}
        <TipsCard goal={attempt.goal} tips={codeTips(attempt.metrics, attempt.goal).slice(0, 3)} />
        <div className="results-card">
          <h2>What we heard</h2>
          <blockquote className="transcript">{attempt.transcript.trim() || '(No words detected)'}</blockquote>
          <p className="fine-print">If you spoke more than this, check your microphone in the mic check and try again.</p>
        </div>
        <ResultsActions attempt={attempt} />
      </section>
    );
  }

  const modelScores: Partial<Scores> | null = ai
    ? { content: ai.scores.content, vocabulary: ai.scores.vocabulary, listenability: ai.scores.delivery, task: ai.scores.task }
    : null;
  const ceiling = lengthCeiling(attempt.metrics.wordCount, attempt.metrics.answerSeconds * 2);
  const scores = blendScores(codeEstimates(attempt.metrics), modelScores, undefined, ceiling);
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
