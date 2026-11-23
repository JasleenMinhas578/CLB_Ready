import { useEffect, useState } from 'react';

/**
 * Live microphone loudness (0 to 1) for the level meter.
 * Updates about 15 times a second, which is smooth enough and cheap.
 */
export function useMicLevel(stream: MediaStream | null): number {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      return;
    }
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    context.createMediaStreamSource(stream).connect(analyser);
    const buffer = new Float32Array(analyser.fftSize);

    const id = window.setInterval(() => {
      analyser.getFloatTimeDomainData(buffer);
      let sum = 0;
      for (let i = 0; i < buffer.length; i += 1) sum += buffer[i] * buffer[i];
      // Scale so normal speech fills most of the bar.
      setLevel(Math.min(1, Math.sqrt(sum / buffer.length) * 6));
    }, 66);

    return () => {
      window.clearInterval(id);
      void context.close();
    };
  }, [stream]);

  return level;
}
