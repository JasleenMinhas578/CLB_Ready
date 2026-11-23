import type { SpeakingMetrics } from '@/domain/measure/speakingMetrics';

export type Tone = 'good' | 'ok' | 'work';

export interface Tile {
  label: string;
  value: string;
  note: string;
  tone: Tone;
}

function tiles(m: SpeakingMetrics): Tile[] {
  const pace = m.wordsPerMinute;
  return [
    {
      label: 'Pace',
      value: `${pace}`,
      note: 'words a minute (aim 120–150)',
      tone: pace >= 115 && pace <= 170 ? 'good' : pace >= 95 && pace <= 190 ? 'ok' : 'work',
    },
    {
      label: 'Long pauses',
      value: `${m.longPauses.length}`,
      note: 'over 2 seconds',
      tone: m.longPauses.length === 0 ? 'good' : m.longPauses.length <= 2 ? 'ok' : 'work',
    },
    {
      label: 'Fillers',
      value: `${m.fillerCount}`,
      note: m.fillers.length ? m.fillers.map((f) => `"${f.word}" ×${f.count}`).join(', ') : 'none heard',
      tone: m.fillerCount <= 1 ? 'good' : m.fillerCount <= 4 ? 'ok' : 'work',
    },
    {
      label: 'Time used',
      value: `${Math.round(m.timeUsed * 100)}%`,
      note: `of ${m.answerSeconds} seconds`,
      tone: m.timeUsed >= 0.85 ? 'good' : m.timeUsed >= 0.65 ? 'ok' : 'work',
    },
    {
      label: 'Word variety',
      value: `${Math.round(m.variety * 100)}%`,
      note: 'different words used',
      tone: m.variety >= 0.7 ? 'good' : m.variety >= 0.6 ? 'ok' : 'work',
    },
    {
      label: 'Linking words',
      value: `${m.linkingWords.length}`,
      note: m.linkingWords.length ? m.linkingWords.slice(0, 4).join(', ') : 'try "first", "for example"',
      tone: m.linkingWords.length >= 4 ? 'good' : m.linkingWords.length >= 2 ? 'ok' : 'work',
    },
  ];
}

const TONE_LABEL: Record<Tone, string> = { good: 'On track', ok: 'Close', work: 'Work on this' };

/** A grid of measurement tiles, coloured by how close each is to target. */
export function TileList({ tiles: items }: { tiles: Tile[] }) {
  return (
    <ul className="measure-tiles">
      {items.map((tile) => (
        <li key={tile.label} className={`tone-${tile.tone}`}>
          <span className="tile-label">{tile.label}</span>
          <strong>{tile.value}</strong>
          <span className="tile-note">{tile.note}</span>
          <span className="tile-tone">{TONE_LABEL[tile.tone]}</span>
        </li>
      ))}
    </ul>
  );
}

/** What code measured in a spoken answer, shown instantly while the AI is still writing. */
export function MeasureTiles({ metrics }: { metrics: SpeakingMetrics }) {
  return <TileList tiles={tiles(metrics)} />;
}
