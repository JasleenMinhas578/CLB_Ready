import { useCallback, useEffect, useRef, useState } from 'react';
import { VOICES, clipAudioPath, type ListeningClip } from '@/content/objective';
import { getVoiceEngine } from '@/services/tts/voiceEngine';
import type { SpokenLine } from '@/services/tts/types';
import type { ModelStatus } from '@/services/ai/modelStore';
import { playBuffer, sleep } from '@/services/tts/playback';

/** `preparing` = getting voices ready; Play is enabled once the first line exists. */
export type PlayerState = 'preparing' | 'ready' | 'playing' | 'done';
/** recorded = MP3 from `npm run audio`; ai = Kokoro in this browser; browser = the browser's own voice. */
export type AudioSource = 'recorded' | 'ai' | 'browser';

/** Silence between two speakers, and between two lines by one speaker, in seconds. */
const TURN_GAP = 0.45;
const SAME_SPEAKER_GAP = 0.3;

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  promise.catch(() => undefined);
  return { promise, resolve, reject };
}

/**
 * True once Kokoro has failed to load in this visit. Every try is a long wait
 * (often running out of memory again), so later clips go straight to the browser voice.
 * A tier change in Settings resets the status, which allows one more try.
 */
export function aiVoiceFailed(status: ModelStatus): boolean {
  return status.state === 'error';
}

/**
 * Plays one listening clip once, like test day: no pause and no replay.
 *
 * 1. A recorded MP3 (from `npm run audio`) is used when it exists.
 * 2. Otherwise Kokoro makes the voices in this browser, one line at a time.
 *    It starts while the learner reads the intro and stays ahead of playback,
 *    so lines follow each other without waiting.
 * 3. If Kokoro can't run, the browser's own voice reads the script.
 */
export function useClipPlayer(moduleId: string, clip: ListeningClip) {
  const [state, setState] = useState<PlayerState>('preparing');
  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState<AudioSource | null>(null);
  /** Voice model download, 0 to 1, while it loads for the first time. */
  const [voiceLoading, setVoiceLoading] = useState<number | null>(null);
  /** Changes whenever the clip changes or the screen closes, so old work stops. */
  const run = useRef(0);
  const lines = useRef<Deferred<SpokenLine>[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  // Choose a source and start preparing as soon as the clip is shown.
  useEffect(() => {
    const myRun = run.current;
    const alive = () => run.current === myRun;
    setState('preparing');
    setProgress(0);
    setSource(null);
    setVoiceLoading(null);
    lines.current = clip.lines.map(() => deferred<SpokenLine>());

    void (async () => {
      if (await recordingExists(clipAudioPath(moduleId, clip.id))) {
        if (!alive()) return;
        setSource('recorded');
        setState('ready');
        return;
      }
      try {
        const engine = await getVoiceEngine();
        if (aiVoiceFailed(engine.getStatus())) throw new Error('The voice model failed earlier.');
        const unsubscribe = engine.subscribe(() => {
          const status = engine.getStatus();
          if (alive() && status.state === 'loading') setVoiceLoading(status.progress);
        });
        try {
          await engine.ensureLoaded();
        } finally {
          unsubscribe();
        }
        if (!alive()) return;
        setVoiceLoading(null);
        setSource('ai');
        // Make every line in order; playback waits for a line only if it isn't ready yet.
        for (const [index, line] of clip.lines.entries()) {
          if (!alive()) return;
          const voice = clip.speakers.find((speaker) => speaker.name === line.speaker)?.voice ?? 'af_heart';
          try {
            lines.current[index].resolve(await engine.speak(line.text, voice));
          } catch (error) {
            lines.current[index].reject(error);
          }
          if (index === 0 && alive()) setState((current) => (current === 'preparing' ? 'ready' : current));
        }
      } catch {
        // Kokoro couldn't load on this device: use the browser's voice.
        if (!alive()) return;
        setVoiceLoading(null);
        setSource('browser');
        setState('ready');
      }
    })();

    return () => {
      run.current += 1;
      audioRef.current?.pause();
      void contextRef.current?.close();
      contextRef.current = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [moduleId, clip]);

  const finish = useCallback((myRun: number) => {
    if (run.current !== myRun) return;
    setProgress(1);
    setState('done');
  }, []);

  const readWithBrowser = useCallback(
    (fromLine: number, myRun: number) => {
      if (run.current !== myRun) return;
      setSource('browser');
      void speakWithBrowser(clip, fromLine, () => run.current === myRun, setProgress).then(() => finish(myRun));
    },
    [clip, finish],
  );

  const playRecorded = useCallback(
    (myRun: number) => {
      const audio = new Audio(clipAudioPath(moduleId, clip.id));
      audioRef.current = audio;
      audio.ontimeupdate = () => audio.duration && setProgress(audio.currentTime / audio.duration);
      audio.onended = () => finish(myRun);
      let fellBack = false;
      const fallBack = () => {
        if (fellBack) return;
        fellBack = true;
        audio.pause();
        readWithBrowser(0, myRun);
      };
      audio.onerror = fallBack;
      audio.play().catch(fallBack);
    },
    [moduleId, clip.id, finish, readWithBrowser],
  );

  const playAi = useCallback(
    async (myRun: number) => {
      const context = new AudioContext();
      contextRef.current = context;
      for (let index = 0; index < clip.lines.length; index += 1) {
        if (run.current !== myRun) return;
        setProgress(index / clip.lines.length);
        let line: SpokenLine;
        try {
          line = await lines.current[index].promise;
        } catch {
          // A line failed: read the rest with the browser's voice so the clip still finishes.
          readWithBrowser(index, myRun);
          return;
        }
        if (run.current !== myRun) return;
        await playBuffer(context, line);
        const next = clip.lines[index + 1];
        if (next) await sleep((next.speaker === clip.lines[index].speaker ? SAME_SPEAKER_GAP : TURN_GAP) * 1000);
      }
      finish(myRun);
    },
    [clip, finish, readWithBrowser],
  );

  const play = useCallback(() => {
    if (state !== 'ready') return;
    setState('playing');
    const myRun = run.current;
    if (source === 'recorded') playRecorded(myRun);
    else if (source === 'ai') void playAi(myRun);
    else readWithBrowser(0, myRun);
  }, [state, source, playRecorded, playAi, readWithBrowser]);

  return { state, progress, source, voiceLoading, play };
}

/** True when a recorded MP3 exists. Dev servers answer missing files with the app page, so check the type. */
async function recordingExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok && (response.headers.get('content-type') ?? '').startsWith('audio');
  } catch {
    return false;
  }
}

/** Reads lines from `fromLine` onwards with the browser's own voices. */
async function speakWithBrowser(clip: ListeningClip, fromLine: number, alive: () => boolean, setProgress: (value: number) => void): Promise<void> {
  if (!('speechSynthesis' in window)) return;
  const voiceFor = pickVoices(clip, await browserVoices());
  for (let index = fromLine; index < clip.lines.length; index += 1) {
    if (!alive()) return;
    setProgress(index / clip.lines.length);
    const line = clip.lines[index];
    const speaker = clip.speakers.find((item) => item.name === line.speaker);
    const female = speaker ? VOICES[speaker.voice].gender === 'female' : true;
    await new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(line.text);
      const voice = voiceFor.get(line.speaker);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang ?? 'en-US';
      // Pitch keeps speakers apart when the device has only one voice.
      utterance.pitch = voice ? 1 : female ? 1.2 : 0.8;
      utterance.rate = 0.95;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
}

function browserVoices(): Promise<SpeechSynthesisVoice[]> {
  const now = window.speechSynthesis.getVoices();
  if (now.length) return Promise.resolve(now);
  // Some browsers load voices a moment after the page.
  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    window.setTimeout(done, 1500);
  });
}

const FEMALE_HINT = /(female|samantha|victoria|karen|moira|tessa|fiona|zira|susan|serena|allison|ava|joanna|kendra|salli|libby|sonia|jenny|aria)/i;
const MALE_HINT = /(\bmale\b|daniel|alex|fred|david|mark|george|guy|ryan|tom|oliver|arthur|rishi|aaron)/i;

/** Gives each speaker a different English voice, matching gender where the voice name hints at it. */
function pickVoices(clip: ListeningClip, voices: SpeechSynthesisVoice[]): Map<string, SpeechSynthesisVoice> {
  const english = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));
  const preferred = english.sort((a, b) => Number(/en-(us|ca)/i.test(b.lang)) - Number(/en-(us|ca)/i.test(a.lang)));
  const used = new Set<SpeechSynthesisVoice>();
  const map = new Map<string, SpeechSynthesisVoice>();
  for (const speaker of clip.speakers) {
    const hint = VOICES[speaker.voice].gender === 'female' ? FEMALE_HINT : MALE_HINT;
    const voice =
      preferred.find((item) => !used.has(item) && hint.test(item.name)) ?? preferred.find((item) => !used.has(item)) ?? preferred[0];
    if (voice) {
      used.add(voice);
      map.set(speaker.name, voice);
    }
  }
  return map;
}
