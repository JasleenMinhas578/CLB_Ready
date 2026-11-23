/** Whisper expects 16 kHz mono audio. */
export const WHISPER_SAMPLE_RATE = 16_000;

export interface Recording {
  blob: Blob;
  durationSeconds: number;
}

export interface RecordingSession {
  /** Live stream, for the level meter. */
  stream: MediaStream;
  stop: () => void;
  finished: Promise<Recording>;
}

export function openMicrophone(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
  });
}

/**
 * Records from the microphone until `stop()` is called or `maxSeconds`
 * passes. Audio stays in memory; nothing is uploaded or saved.
 */
export async function startRecording(maxSeconds: number): Promise<RecordingSession> {
  const stream = await openMicrophone();
  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  const startedAt = performance.now();

  recorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  const finished = new Promise<Recording>((resolve) => {
    recorder.addEventListener('stop', () => {
      stream.getTracks().forEach((track) => track.stop());
      resolve({
        blob: new Blob(chunks, { type: recorder.mimeType }),
        durationSeconds: (performance.now() - startedAt) / 1000,
      });
    });
  });

  recorder.start();
  const timeout = window.setTimeout(() => recorder.state !== 'inactive' && recorder.stop(), maxSeconds * 1000);

  return {
    stream,
    stop: () => {
      window.clearTimeout(timeout);
      if (recorder.state !== 'inactive') recorder.stop();
    },
    finished,
  };
}

/** Decodes a recording and resamples it to 16 kHz mono for Whisper. */
export async function toWhisperAudio(blob: Blob): Promise<Float32Array> {
  const context = new AudioContext({ sampleRate: WHISPER_SAMPLE_RATE });
  try {
    const decoded = await context.decodeAudioData(await blob.arrayBuffer());
    return decoded.getChannelData(0);
  } finally {
    void context.close();
  }
}
