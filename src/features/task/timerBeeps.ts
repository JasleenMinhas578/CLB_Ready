import type { BeepKind } from '@/services/audio/beep';

/**
 * The beeps for one run of a timer: one when it starts and at most one when it
 * ends, whether time ran out or the learner moved on. An end without a start
 * stays silent, so beeps always come in pairs.
 */
export function timerRunBeeps(play: (kind: BeepKind) => void) {
  let state: 'waiting' | 'running' | 'ended' = 'waiting';
  return {
    start() {
      if (state !== 'waiting') return;
      state = 'running';
      play('start');
    },
    end() {
      if (state !== 'running') return;
      state = 'ended';
      play('end');
    },
  };
}
