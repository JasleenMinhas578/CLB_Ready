import { useCallback, useEffect, useRef, useState } from 'react';
import { getVoiceEngine } from '@/services/tts/voiceEngine';
import { playBuffer, sentences, sleep } from '@/services/tts/playback';
import type { SpokenLine } from '@/services/tts/types';

export type ReadAloudState = 'idle' | 'loading' | 'playing';

/**
 * Reads a text aloud with Kokoro in the browser. Sentences are made one at
 * a time, staying ahead of playback, so speech starts after the first one.
 */
export function useReadAloud(text: string, voice = 'af_heart') {
  const [state, setState] = useState<ReadAloudState>('idle');
  const [loadProgress, setLoadProgress] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const run = useRef(0);
  const contextRef = useRef<AudioContext | null>(null);

  const stop = useCallback(() => {
    run.current += 1;
    void contextRef.current?.close();
    contextRef.current = null;
    setState('idle');
    setLoadProgress(null);
  }, []);

  // Stop when the text changes or the card goes away.
  useEffect(() => stop, [text, stop]);

  const play = useCallback(async () => {
    const myRun = ++run.current;
    const alive = () => run.current === myRun;
    setFailed(false);
    setState('loading');
    try {
      const engine = await getVoiceEngine();
      const unsubscribe = engine.subscribe(() => {
        const status = engine.getStatus();
        if (alive() && status.state === 'loading') setLoadProgress(status.progress);
      });
      try {
        await engine.ensureLoaded();
      } finally {
        unsubscribe();
      }
      if (!alive()) return;
      const parts = sentences(text);
      // Queue every sentence now; the engine makes them in order while earlier ones play.
      const made: Promise<SpokenLine>[] = parts.map((part) => engine.speak(part, voice));
      made.forEach((promise) => promise.catch(() => undefined));
      const context = new AudioContext();
      contextRef.current = context;
      for (const [index, promise] of made.entries()) {
        const line = await promise;
        if (!alive()) return;
        if (index === 0) {
          setLoadProgress(null);
          setState('playing');
        }
        await playBuffer(context, line);
        await sleep(180);
      }
      if (alive()) stop();
    } catch {
      if (!alive()) return;
      setFailed(true);
      stop();
    }
  }, [text, voice, stop]);

  return { state, loadProgress, failed, play, stop };
}
