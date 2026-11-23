/**
 * Small models sometimes give one score that makes no sense next to the
 * others (e.g. Content 5 beside three 11s for the same strong email).
 * A model score is ignored when it is far from the model's own other
 * scores AND far from what code measured. Code then stands alone for it.
 */

/** How far from the model's other scores counts as "far". */
export const OUTLIER_FROM_PEERS = 4;
/** How far from the code estimate counts as "disagrees". */
export const OUTLIER_FROM_CODE = 3;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export interface CheckedModelScores<K extends string> {
  scores: Partial<Record<K, number>>;
  /** Criteria whose model score was ignored. */
  ignored: { id: K; modelScore: number }[];
}

export function dropOutlierScores<K extends string>(
  model: Partial<Record<K, number>>,
  code: Record<K, number>,
): CheckedModelScores<K> {
  const ids = (Object.keys(model) as K[]).filter((id) => typeof model[id] === 'number');
  const kept: Partial<Record<K, number>> = { ...model };
  const ignored: { id: K; modelScore: number }[] = [];

  for (const id of ids) {
    const score = model[id] as number;
    const peers = ids.filter((other) => other !== id).map((other) => model[other] as number);
    if (peers.length < 2) continue;
    const farFromPeers = Math.abs(score - median(peers)) >= OUTLIER_FROM_PEERS;
    const farFromCode = Math.abs(score - code[id]) >= OUTLIER_FROM_CODE;
    if (farFromPeers && farFromCode) {
      delete kept[id];
      ignored.push({ id, modelScore: score });
    }
  }
  return { scores: kept, ignored };
}
