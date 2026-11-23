import type { WritingAttempt } from '@/domain/attempt';
import { getCriteria } from '@/domain/criteria';
import { blendScores, overallLevel, DEFAULT_WRITING_WEIGHTS, type Scores, type WritingCriterionId } from '@/domain/scoring/estimate';
import { codeEstimatesWriting, writingTips } from '@/domain/scoring/writingEstimate';
import type { WritingMetrics } from '@/domain/measure/writingMetrics';
import { Emoji } from '@/components/Emoji';
import { useFeedback } from './useFeedback';
import { AiStatus, ChecklistCard, ImprovedCard, LevelCard, ResultsActions, TipsCard, TooShortCard, mergeTips } from './cards';
import { EssayView } from './EssayView';
import { TileList, type Tile } from './MeasureTiles';
import { MIN_SCORABLE_WRITING_WORDS, MIN_SENTENCES_FOR_VARIETY, MIN_WORDS_FOR_VARIETY, isScorable, lengthCeiling, plural } from '@/domain/scoring/sufficiency';

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
    const parts = [m.email.hasGreeting ? 'greeting ✓' : 'no greeting', m.email.hasClosing ? 'closing ✓' : 'no closing'];
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
  const sample = outcome?.kind === 'sample' ? outcome.answer : null;
  const header = (
    <div className="screen-head">
      <h1>Your feedback</h1>
      <p>{attempt.taskTitle}</p>
    </div>
  );

  if (!scorable) {
    return (
      <section className="narrow results">
        {header}
        <TooShortCard
          attempt={attempt}
          need={`at least ${MIN_SCORABLE_WRITING_WORDS} words (the task asks for ${attempt.metrics.wordRange.min}–${attempt.metrics.wordRange.max})`}
          unit="word"
          outcome={outcome}
          progress={progress}
        />
        {sample && <ImprovedCard goal={attempt.goal} text={sample} spoken={false} fromScratch />}
        <TipsCard goal={attempt.goal} tips={writingTips(attempt.metrics, attempt.goal, attempt.options).slice(0, 3)} />
        <div className="results-card">
          <h2>What you wrote</h2>
          <blockquote className="transcript essay">{attempt.text.trim() || '(Nothing written)'}</blockquote>
        </div>
        <ResultsActions attempt={attempt} />
      </section>
    );
  }

  const modelScores: Partial<Scores<WritingCriterionId>> | null = ai
    ? { content: ai.scores.content, vocabulary: ai.scores.vocabulary, readability: ai.scores.delivery, task: ai.scores.task }
    : null;
  const ceiling = lengthCeiling(attempt.metrics.wordCount, attempt.metrics.wordRange.min);
  const scores = blendScores(codeEstimatesWriting(attempt.metrics), modelScores, DEFAULT_WRITING_WEIGHTS, ceiling);
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
        criteria={getCriteria('writing')}
        scores={scores}
        overall={overall}
        final={final}
        status={<AiStatus outcome={outcome} progress={progress} />}
      />
      <TipsCard goal={attempt.goal} tips={mergeTips(ai?.tips, writingTips(attempt.metrics, attempt.goal, attempt.options), !!ai)} />
      {ai?.improved && <ImprovedCard goal={attempt.goal} text={ai.improved} spoken={false} />}
      <ChecklistCard items={attempt.checklist} results={ai?.checklist ?? null} final={final} />
      <div className="results-card">
        <h2>What we measured</h2>
        <TileList tiles={writingTiles(attempt.metrics, attempt.options)} />
      </div>
      <div className="results-card">
        <h2>Your writing, checked</h2>
        <EssayView text={attempt.text} issues={attempt.issues} />
        <p className="fine-print">The checker catches common mistakes only, so a clean result doesn’t mean zero errors.</p>
      </div>
      <ResultsActions attempt={attempt} />
    </section>
  );
}
