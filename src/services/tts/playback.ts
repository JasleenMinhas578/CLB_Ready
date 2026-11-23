import type { SpokenLine } from './types';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** Plays one generated line through Web Audio and resolves when it ends. */
export function playBuffer(context: AudioContext, line: SpokenLine): Promise<void> {
  return new Promise((resolve) => {
    const buffer = context.createBuffer(1, line.audio.length, line.sampleRate);
    buffer.getChannelData(0).set(line.audio);
    const node = context.createBufferSource();
    node.buffer = buffer;
    node.connect(context.destination);
    node.onended = () => resolve();
    node.start();
  });
}

/** Splits text into sentences, so speech can start before the whole text is made. */
export function sentences(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+["”’]?|[^.!?]+$/g) ?? []).map((part) => part.trim()).filter(Boolean);
}
