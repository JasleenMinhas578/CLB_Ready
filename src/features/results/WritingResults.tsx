import type { WritingAttempt } from '@/domain/attempt';
import { getCriteria } from '@/domain/criteria';
import { finalScores } from '@/domain/scoring/finalScores';
import { codeEstimatesWriting, writingTips } from '@/domain/scoring/writingEstimate';
import type { WritingMetrics } from '@/domain/measure/writingMetrics';
import { useFeedback } from './useFeedback';
import { outlierNotes, AiStatus, ChecklistCard, AnswerCard, LevelCard, ResultsActions, ResultsHead, TipsCard, TooShortCard, PerfCard, mergeTips } from './cards';
import { EssayView } from './EssayView';
import { mergeChecklist } from '@/domain/scoring/autoChecks';
import { TileList, type Tile } from './MeasureTiles';
import { MIN_SCORABLE_WRITING_WORDS, MIN_SENTENCES_FOR_VARIETY, MIN_WORDS_FOR_VARIETY, isScorable, plural } from '@/domain/scoring/sufficiency';

function writingTiles(m: WritingMetrics, options?: [string, string]): Tile[] {
  const { min, max } = m.wordRange;
  const tiles: Tile[] = [
    {
      label: 'Words', value: `${m.wordCount}`, note: `aim ${min}–${max}`,
      tone: m.wordCount >= min && m.wordCount <= max ? 'good' : m.wordCount >= min * 0.85 && m.wordCount <= max * 1.15 ? 'ok' : 'work',
    },
    { label: 'Paragraphs', value: `${m.paragraphs}`, note: 'aim for 3 or more', tone: m.paragraphs >= 3 ? 'good' : m.paragraphs === 2 ? 'ok' : 'work' },
    {
      label: 'Marked mistakes', value: `${m.grammarIssues}`, note: 'spelling, grammar, punctuation',
      tone: m.wordCount < MIN_WORDS_FOR_VARIETY ? 'neutral' : m.grammarIssues === 0 ? 'good' : m.grammarIssues <= 2 ? 'ok' : 'work',
    },
    {
      label: 'Sentence variety', value: m.sentenceVariety >= 5 ? 'Varied' : m.sentenceVariety >= 3 ? 'Some' : 'Similar',
      note: `${plural(m.sentences, 'sentence')}, about ${plural(Math.round(m.avgSentenceLength), 'word')} each`,
      tone: m.sentences < MIN_SENTENCES_FOR_VARIETY ? 'neutral' : m.sentenceVariety >= 5 ? 'good' : m.sentenceVariety >= 3 ? 'ok' : 'work',
    },
    {
      label: 'Word variety', value: `${Math.round(m.variety * 100)}%`, note: 'different words used',
      tone: m.wordCount < MIN_WORDS_FOR_VARIETY ? 'neutral' : m.variety >= 0.7 ? 'good' : m.variety >= 0.6 ? 'ok' : 'work',
    },
    {
      label: 'Linking words', value: `${m.linkingWords.length}`, note: m.linkingWords.slice(0, 4).join(', ') || 'try "however", "in addition"',
      tone: m.linkingWords.length >= 4 ? 'good' : m.linkingWords.length >= 2 ? 'ok' : 'work',
    },
  ];
  if (m.email) {
    const parts = [m.email.hasGreeting ? 'has a greeting' : 'no greeting', m.email.hasClosing ? 'has a closing' : 'no closing'];
    tiles.push({
      label: 'Email format', value: m.email.hasGreeting && m.email.hasClosing ? 'Complete' : 'Missing parts', note: parts.join(', '),
      tone: m.email.hasGreeting && m.email.hasClosing ? 'good' : 'work',
    });
    tiles.push({
      label: 'Tone', value: m.email.toneMismatch ? 'Too casual' : m.wordCount < MIN_WORDS_FOR_VARIETY ? 'Too short to tell' : 'Fits',
      note: `${m.email.expectedTone} email expected`,
      tone: m.email.toneMismatch ? 'work' : m.wordCount < MIN_WORDS_FOR_VARIETY ? 'neutral' : 'good',
    });
  }
  if (m.survey && options) {
    tiles.push({
      label: 'Your choice', value: m.survey.chosen === null ? 'Unclear' : m.survey.chosen === 0 ? 'Option A' : 'Option B',
      note: m.survey.chosen === null ? 'state it in your first sentence' : options[m.survey.chosen],
      tone: m.survey.chosen === null ? 'work' : 'good',
    });
  }
  return tiles;
}

export function WritingResults({ attempt }: { attempt: WritingAttempt }) {
  const scorable = isScorable('writing', attempt.metrics.wordCount);
  const { outcome, progress } = useFeedback(attempt);
  const ai = outcome?.kind === 'ai' ? outcome.run.reply : null;
  if (!scorable) {
    return (
      <section className="results results-writing">
        <ResultsHead attempt={attempt} title="Your feedback" retryFirst />
        <div className="results-grid">
          <div className="results-side">
            <TooShortCard
              attempt={attempt}
              need={`at least ${MIN_SCORABLE_WRITING_WORDS} words (the task asks for ${attempt.metrics.wordRange.min}–${attempt.metrics.wordRange.max})`}
              unit="word"
              outcome={outcome}
              progress={progress}
            />
            <TipsCard goal={attempt.goal} tips={writingTips(attempt.metrics, attempt.goal, attempt.options).slice(0, 3)} />
          </div>
          <div className="results-main">
            <AnswerCard answer={progress?.answer} goal={attempt.goal} spoken={false} fromScratch />
            <div className="results-card">
              <h2>What you wrote</h2>
              <blockquote className="transcript essay">{attempt.text.trim() || '(Nothing written)'}</blockquote>
            </div>
          </div>
        </div>
        {progress?.perf && <PerfCard perf={progress.perf} progress={progress} outcome={outcome} />}
        <ResultsActions attempt={attempt} retryFirst />
      </section>
    );
  }

  const { scores, level, ignored } = finalScores(
    'writing', codeEstimatesWriting(attempt.metrics), ai?.scores ?? null, attempt.metrics.wordCount, attempt.metrics.wordRange.min, ai?.onTask,
  );
  const checklist = mergeChecklist(attempt.checklist, ai?.checklist ?? null, attempt.text, attempt.metrics);
  const final = outcome !== null;

  return (
    <section className="results results-writing">
      <ResultsHead attempt={attempt} title="Your feedback" />
      <div className="results-grid">
        <div className="results-side">
          <LevelCard
            attempt={attempt}
            criteria={getCriteria('writing')}
            scores={scores}
            overall={level}
            final={final}
            status={<AiStatus outcome={outcome} progress={progress} />}
            notes={outlierNotes(ignored)}
          />
          <TipsCard goal={attempt.goal} tips={mergeTips(ai, writingTips(attempt.metrics, attempt.goal, attempt.options))} />
          <ChecklistCard items={attempt.checklist} results={checklist} final={final} />
        </div>
        <div className="results-main">
          <AnswerCard answer={progress?.answer} goal={attempt.goal} spoken={false} original={attempt.text} offTask={ai?.onTask === false} />
          <div className="results-card">
            <h2>Your writing, checked</h2>
            <EssayView text={attempt.text} issues={attempt.issues} />
            <p className="fine-print">The checker finds common mistakes only, so it may miss some.</p>
          </div>
        </div>
      </div>
      {/* Details below both columns, full width, so neither column is left half empty. */}
      <div className="results-card">
        <h2>What we measured</h2>
        <TileList tiles={writingTiles(attempt.metrics, attempt.options)} />
      </div>
      {progress?.perf && <PerfCard perf={progress.perf} progress={progress} outcome={outcome} />}
      <ResultsActions attempt={attempt} />
    </section>
  );
}
