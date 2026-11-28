/**
 * Exact commits of every model file the site downloads. Pinning means a change
 * upstream (or a hijacked repo) can't silently swap what runs on a learner's
 * device. To update one, take the new `sha` from
 * https://huggingface.co/api/models/<repo> (or, for the WebLLM libraries,
 * `gh api repos/mlc-ai/binary-mlc-llm-libs/commits/main`), check the app still
 * works, and change it here. tests/modelPins.test.ts checks every model in
 * src/services/device/tier.ts has a pin.
 */

/**
 * WebLLM models, keyed by WebLLM model id: the Hugging Face commit of each mlc-ai
 * repo, and the GPU memory WebLLM lists for it in MB. The memory figure is copied
 * from WebLLM's prebuiltAppConfig so the page doesn't bundle the library just to
 * read it; tests/modelPins.test.ts checks it still matches.
 */
export const WEBLLM_MODELS: Record<string, { sha: string; vramMb: number }> = {
  'Qwen2.5-3B-Instruct-q4f16_1-MLC': { sha: '7690aaaa46df36b1be0fe93b9c9abac0497eff6c', vramMb: 2504.76 },
  'Qwen2.5-3B-Instruct-q4f32_1-MLC': { sha: 'dfa91e859b714acfa489a1464297080656c3460d', vramMb: 2893.64 },
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC': { sha: '9bd564b064631febf14deadcac492efb761d60c3', vramMb: 1629.75 },
  'Qwen2.5-1.5B-Instruct-q4f32_1-MLC': { sha: 'a822ee410075710c9673005eafa017b90136b85d', vramMb: 1888.97 },
  'Llama-3.2-1B-Instruct-q4f16_1-MLC': { sha: '2a37b0a5ecb622d51ddc2fac74de0b95872affd7', vramMb: 879.04 },
  'Llama-3.2-1B-Instruct-q4f32_1-MLC': { sha: 'a949835e0f9a65335bd834db02a44cf8fae34020', vramMb: 1128.82 },
};

/** GitHub commit of mlc-ai/binary-mlc-llm-libs, which holds the compiled WebGPU model code. */
export const WEBLLM_LIBS_SHA = '5b7251f3bdce957be2a7bf73a6f6c560d9874df4';

/** Hugging Face commits of the Whisper repos, keyed by repo. */
export const WHISPER_SHAS: Record<string, string> = {
  'Xenova/whisper-tiny.en': '79fb389fc764e7c395bd330e9531d9d32ada7049',
  'Xenova/whisper-base.en': '95bf40a508535962c6483ead40270b2e32267508',
  'Xenova/whisper-small.en': 'fa16a75f5d91e83ecb6a2ccb690f14d91ef00ca4',
};

export const KOKORO_MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
/** Kokoro commit. public/voices/ holds the voice files from this same commit. */
export const KOKORO_SHA = '1939ad2a8e416c0acfeecc08a694d14ef25f2231';
