/**
 * Makes the listening recordings with Kokoro, an open text-to-speech model
 * (Apache-2.0). Run once on a computer with internet access:
 *
 *   npm install
 *   npm run audio
 *
 * It reads every listening script in src/content/modules, gives each
 * speaker their voice, and writes public/audio/<module>/<clip>.mp3.
 * Clips whose script hasn't changed are skipped, so it's safe to rerun
 * after editing one script. Needs ffmpeg for MP3 (macOS: brew install ffmpeg).
 *
 * Options: --force (remake every clip), --module module-2 (one module only).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { env } from '@huggingface/transformers';
import { KokoroTTS } from 'kokoro-js';
import { MODULES } from '../src/content/modules';
import { clipAudioPath, type ListeningClip } from '../src/content/objective';
import { KOKORO_MODEL, KOKORO_SHA } from '../src/services/modelPins';

// kokoro-js drops the `revision` option, so pin the commit in the download path instead.
// On Node, kokoro-js reads voices from its own npm package, so they need no pin.
env.remotePathTemplate = `{model}/resolve/${KOKORO_SHA}/`;
const PUBLIC = join(import.meta.dirname, '..', 'public');
const MANIFEST = join(PUBLIC, 'audio', 'manifest.json');
/** Silence between two speakers, and between two lines by the same speaker, in seconds. */
const TURN_GAP = 0.45;
const SAME_SPEAKER_GAP = 0.3;

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyModule = args.includes('--module') ? args[args.indexOf('--module') + 1] : null;

function hasFfmpeg(): boolean {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/** A fingerprint of everything that changes how a clip sounds. */
function fingerprint(clip: ListeningClip): string {
  return createHash('sha256').update(JSON.stringify({ speakers: clip.speakers, lines: clip.lines })).digest('hex').slice(0, 16);
}

function wav(samples: Float32Array, rate: number): Buffer {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((value, index) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value)) * 32767), index * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

async function main() {
  if (!hasFfmpeg()) {
    console.error('ffmpeg is needed to make MP3 files. On a Mac: brew install ffmpeg');
    process.exit(1);
  }
  const manifest: Record<string, string> = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
  const jobs = MODULES.filter((item) => !onlyModule || item.id === onlyModule).flatMap((item) =>
    (item.listening ?? []).flatMap((part) => part.clips.map((clip) => ({ moduleId: item.id, clip }))),
  );
  const todo = jobs.filter(({ moduleId, clip }) => force || manifest[clip.id] !== fingerprint(clip) || !existsSync(join(PUBLIC, clipAudioPath(moduleId, clip.id))));
  console.log(`${jobs.length} recordings in total, ${todo.length} to make.`);
  if (!todo.length) return;

  console.log('Loading Kokoro (downloads about 330 MB the first time)…');
  const tts = await KokoroTTS.from_pretrained(KOKORO_MODEL, { dtype: 'fp32', device: 'cpu' });

  for (const [index, { moduleId, clip }] of todo.entries()) {
    const started = Date.now();
    const pieces: Float32Array[] = [];
    let rate = 24000;
    let previous: string | null = null;
    for (const line of clip.lines) {
      const voice = clip.speakers.find((speaker) => speaker.name === line.speaker)?.voice;
      if (!voice) throw new Error(`${clip.id}: no voice for speaker "${line.speaker}"`);
      const audio = await tts.generate(line.text, { voice });
      rate = audio.sampling_rate;
      if (previous !== null) pieces.push(new Float32Array(Math.round(rate * (previous === line.speaker ? SAME_SPEAKER_GAP : TURN_GAP))));
      pieces.push(audio.audio);
      previous = line.speaker;
    }
    const total = pieces.reduce((sum, piece) => sum + piece.length, 0);
    const samples = new Float32Array(total);
    let offset = 0;
    for (const piece of pieces) {
      samples.set(piece, offset);
      offset += piece.length;
    }

    const out = join(PUBLIC, clipAudioPath(moduleId, clip.id));
    mkdirSync(join(out, '..'), { recursive: true });
    const temp = `${out}.wav`;
    writeFileSync(temp, wav(samples, rate));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', temp, '-ac', '1', '-b:a', '64k', out]);
    rmSync(temp);
    manifest[clip.id] = fingerprint(clip);
    writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`[${index + 1}/${todo.length}] ${moduleId}/${clip.id}: ${(total / rate).toFixed(0)} s of audio in ${((Date.now() - started) / 1000).toFixed(0)} s`);
  }
  console.log('Done. Commit public/audio to ship the recordings.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
