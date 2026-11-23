/**
 * Content for reading and listening: passages, recordings and
 * multiple-choice questions with an answer key. Original practice material
 * written in CELPIP style, not copied from any test.
 */

export interface ChoiceQuestion {
  id: string;
  /** The question. Empty for a blank inside a passage (the passage gives the context). */
  text: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
  /** Why the answer is right, shown after marking. Quote the passage or recording. */
  why: string;
}

/** A piece of a reading passage. `[[q-id]]` inside a cloze body is a blank answered with a dropdown. */
export type ReadingBlock =
  | { kind: 'text'; title?: string; body: string }
  | { kind: 'table'; title: string; columns: string[]; rows: string[][]; note?: string }
  | { kind: 'cloze'; title: string; body: string };

export interface ReadingPart {
  id: string;
  taskTypeId: string;
  instructions: string;
  blocks: ReadingBlock[];
  questions: ChoiceQuestion[];
  draft?: boolean;
}

/**
 * Kokoro voices used for the recordings (af/am = American, bf/bm = British).
 * scripts/make-audio.mjs turns each clip into audio with these voices.
 */
export const VOICES = {
  af_heart: { gender: 'female' },
  af_bella: { gender: 'female' },
  af_sarah: { gender: 'female' },
  bf_emma: { gender: 'female' },
  am_michael: { gender: 'male' },
  am_adam: { gender: 'male' },
  am_puck: { gender: 'male' },
  bm_george: { gender: 'male' },
} as const;
export type VoiceId = keyof typeof VOICES;

export interface ScriptLine {
  /** Must match a speaker name in the clip. */
  speaker: string;
  text: string;
}

export interface ListeningClip {
  id: string;
  /** Shown before the recording: who is talking and where. */
  intro: string;
  speakers: { name: string; voice: VoiceId }[];
  lines: ScriptLine[];
  /** Answered after the recording ends, as on test day. */
  questions: ChoiceQuestion[];
}

export interface ListeningPart {
  id: string;
  taskTypeId: string;
  instructions: string;
  clips: ListeningClip[];
  draft?: boolean;
}

/** Where a clip's recording lives once scripts/make-audio.mjs has made it. */
export function clipAudioPath(moduleId: string, clipId: string): string {
  return `audio/${moduleId}/${clipId}.mp3`;
}

export function partQuestions(part: ReadingPart | ListeningPart): ChoiceQuestion[] {
  return 'clips' in part ? part.clips.flatMap((clip) => clip.questions) : part.questions;
}

/** The question ids a cloze body refers to, in order. */
export function clozeIds(body: string): string[] {
  return [...body.matchAll(/\[\[([\w-]+)\]\]/g)].map((match) => match[1]);
}
