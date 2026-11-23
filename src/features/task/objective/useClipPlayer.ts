import { useCallback, useEffect, useRef, useState } from 'react';
import { VOICES, clipAudioPath, type ListeningClip } from '@/content/objective';

export type PlayerState = 'ready' | 'playing' | 'done';
export type AudioSource = 'recorded' | 'browser';

/**
 * Plays one listening clip once, like test day: no pause and no replay.
 * Uses the recorded file (made by scripts/make-audio.mjs) when it exists,
 * and the browser's own voices when it doesn't, so listening works before
 * the recordings are made.
 */
export function useClipPlayer(moduleId: string, clip: ListeningClip) {
  const [state, setState] = useState<PlayerState>('ready');
  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState<AudioSource | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** Changes whenever the clip changes or the screen closes, so old playback stops reporting. */
  const run = useRef(0);

  // Stop any sound when the clip changes or the screen closes.
  useEffect(() => {
    setState('ready');
    setProgress(0);
    setSource(null);
    return () => {
      run.current += 1;
      audioRef.current?.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [clip.id]);

  const finish = useCallback((myRun: number) => {
    if (run.current !== myRun) return;
    setProgress(1);
    setState('done');
  }, []);

  const speakWithBrowser = useCallback(async (myRun: number) => {
    setSource('browser');
    if (!('speechSynthesis' in window)) return finish(myRun);
    const voices = await browserVoices();
    const voiceFor = pickVoices(clip, voices);
    for (let index = 0; index < clip.lines.length; index += 1) {
      if (run.current !== myRun) return;
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
    finish(myRun);
  }, [clip, finish]);

  const play = useCallback(() => {
    if (state !== 'ready') return;
    setState('playing');
    const myRun = run.current;
    const audio = new Audio(clipAudioPath(moduleId, clip.id));
    audioRef.current = audio;
    audio.ontimeupdate = () => audio.duration && setProgress(audio.currentTime / audio.duration);
    audio.onended = () => finish(myRun);
    let fellBack = false;
    const fallBack = () => {
      if (fellBack || run.current !== myRun) return;
      fellBack = true;
      audio.pause();
      void speakWithBrowser(myRun);
    };
    audio.onerror = fallBack;
    audio.play().then(() => setSource('recorded'), fallBack);
  }, [state, moduleId, clip.id, finish, speakWithBrowser]);

  return { state, progress, source, play };
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
