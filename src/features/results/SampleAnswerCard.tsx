import { Emoji } from '@/components/Emoji';
import { SAMPLE_ANSWER_NOTES } from '@/content/sampleNotes';
import { useReadAloud } from './useReadAloud';

/**
 * A hand-written sample answer at CLB 10+ for this speaking prompt, with
 * notes on what makes it strong and a button to hear it read aloud.
 */
export function SampleAnswerCard({ text, taskTypeId, seconds }: { text: string; taskTypeId: string; seconds: number }) {
  const voice = useReadAloud(text);
  const notes = SAMPLE_ANSWER_NOTES[taskTypeId] ?? [];
  const words = text.split(/\s+/).filter(Boolean).length;

  return (
    <div className="results-card sample-card">
      <div className="improved-head">
        <h2>Sample answer at CLB 10+</h2>
        {voice.state === 'idle' ? (
          <button type="button" className="btn btn-secondary btn-small" onClick={() => void voice.play()}>
            <Emoji symbol="🔊" /> Listen
          </button>
        ) : (
          <button type="button" className="btn btn-secondary btn-small" onClick={voice.stop}>
            <Emoji symbol="⏹️" /> Stop
          </button>
        )}
      </div>
      <p className="fine-print">
        Written for this task: {words} words, about right for {seconds} seconds of speaking. Read it aloud and notice
        how it’s organized.
      </p>
      {voice.state === 'loading' && (
        <p className="ai-status" aria-live="polite">
          <Emoji symbol="🎧" motion="pulse" />{' '}
          {voice.loadProgress !== null
            ? `Downloading the AI voice (${Math.round(voice.loadProgress * 100)}%). This happens once.`
            : 'Getting the voice ready…'}
        </p>
      )}
      {voice.failed && <p className="fine-print">The voice couldn’t play on this device. You can still read the answer below.</p>}
      <blockquote className="transcript sample-text">{text}</blockquote>
      {notes.length > 0 && (
        <>
          <h3 className="sample-notes-title">Why it works</h3>
          <ul className="sample-notes">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
