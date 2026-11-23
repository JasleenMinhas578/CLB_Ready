/**
 * The parts of kokoro-js that CLB Ready uses. Declared here so the project
 * type-checks before `npm install` has fetched the package.
 */
declare module 'kokoro-js' {
  export interface RawAudio {
    audio: Float32Array;
    sampling_rate: number;
  }

  export class KokoroTTS {
    static from_pretrained(
      modelId: string,
      options?: { dtype?: 'fp32' | 'fp16' | 'q8' | 'q4' | 'q4f16'; device?: 'webgpu' | 'wasm' | 'cpu' | null; progress_callback?: (event: never) => void },
    ): Promise<KokoroTTS>;
    generate(text: string, options?: { voice?: string; speed?: number }): Promise<RawAudio>;
  }
}
