import { use } from 'react';
import type { SpeakingAttempt } from '@/domain/attempt';
import { getCriteria } from '@/domain/criteria';
import { codeEstimates } from '@/domain/scoring/estimate';
import { finalScores } from '@/domain/scoring/finalScores';
import { codeTips } from '@/domain/scoring/codeTips';
import { matchAiChecklist } from '@/domain/scoring/autoChecks';
import { useFeedback } from './useFeedback';
import { outlierNotes, AiStatus, ChecklistCard, AnswerCard, LevelCard, ResultsActions, ResultsHead, TipsCard, TooShortCard, PerfCard, mergeTips } from './cards';
import { MIN_SCORABLE_SPEAKING_WORDS, expectedSpokenWords, isScorable } from '@/domain/scoring/sufficiency';
import { TranscriptView } from './TranscriptView';
import { MeasureTiles } from './MeasureTiles';
import { SampleAnswerCard } from './SampleAnswerCard';
import { getPrompt, loadModule } from '@/content/modules';
import { getTaskType } from '@/domain/tasks/catalog';
import { isSpeakingTask } from '@/domain/tasks/types';

export function SpeakingResults({ attempt }: { attempt: SpeakingAttempt }) {
  const scorable = isScorable('speaking', attempt.metrics.wordCount);
  const { outcome, progress } = useFeedback(attempt);
  const ai = outcome?.kind === 'ai' ? outcome.run.reply : null;
  const modelAnswer = getPrompt(use(loadModule(attempt.moduleId)), attempt.taskTypeId)?.modelAnswer;
  const task = getTaskType(attempt.taskTypeId);
  const sample = modelAnswer && task && isSpeakingTask(task) ? (
    <SampleAnswerCard text={modelAnswer} taskTypeId={task.id} seconds={task.timing.answerSeconds} />
  ) : null;

  if (!scorable) {
    return (
      <section className="results results-speaking">
        <ResultsHead attempt={attempt} title="Your feedback" retryFirst />
        <div className="results-grid">
          <div className="results-side">
            <TooShortCard
              attempt={attempt}
              need={`at least ${MIN_SCORABLE_SPEAKING_WORDS} spoken words`}
              unit="word"
              outcome={outcome}
              progress={progress}
            />
            <TipsCard goal={attempt.goal} tips={codeTips(attempt.metrics, attempt.goal).slice(0, 3)} />
          </div>
          <div className="results-main">
            <AnswerCard answer={progress?.answer} goal={attempt.goal} spoken fromScratch />
            {sample}
            <div className="results-card">
              <h2>What we heard</h2>
              <blockquote className="transcript">{attempt.transcript.trim() || '(We did not hear any words)'}</blockquote>
              <p className="fine-print">If you said more than this, check your microphone and try again.</p>
            </div>
          </div>
        </div>
        {progress?.perf && <PerfCard perf={progress.perf} progress={progress} outcome={outcome} transcribeMs={attempt.transcribeMs} />}
        <ResultsActions attempt={attempt} retryFirst />
      </section>
    );
  }

  const { scores, level, ignored } = finalScores(
    'speaking', codeEstimates(attempt.metrics), ai?.scores ?? null, attempt.metrics.wordCount, expectedSpokenWords(attempt.metrics.answerSeconds), ai?.onTask,
  );
  const final = outcome !== null;

  return (
    <section className="results results-speaking">
      <ResultsHead attempt={attempt} title="Your feedback" />
      <div className="results-grid">
        <div className="results-side">
          <LevelCard
            attempt={attempt}
            criteria={getCriteria('speaking')}
            scores={scores}
            overall={level}
            final={final}
            status={<AiStatus outcome={outcome} progress={progress} />}
            notes={outlierNotes(ignored)}
          />
          <TipsCard goal={attempt.goal} tips={mergeTips(ai, codeTips(attempt.metrics, attempt.goal))} />
          <ChecklistCard items={attempt.checklist} results={matchAiChecklist(attempt.checklist, ai?.checklist ?? null)?.map((row) => ({ met: row.met })) ?? null} final={final} />
        </div>
        <div className="results-main">
          <AnswerCard answer={progress?.answer} goal={attempt.goal} spoken original={attempt.transcript} offTask={ai?.onTask === false} />
          {sample}
          <div className="results-card">
            <h2>What we heard</h2>
            <TranscriptView text={attempt.transcript} words={attempt.words} metrics={attempt.metrics} />
            <p className="fine-print">Speech-to-text can miss filler words like “um”, so the real count may be higher.</p>
          </div>
        </div>
      </div>
      {/* Details below both columns, full width, so neither column is left half empty. */}
      <div className="results-card">
        <h2>What we measured</h2>
        <MeasureTiles metrics={attempt.metrics} />
      </div>
      {progress?.perf && <PerfCard perf={progress.perf} progress={progress} outcome={outcome} transcribeMs={attempt.transcribeMs} />}
      <ResultsActions attempt={attempt} />
    </section>
  );
}
