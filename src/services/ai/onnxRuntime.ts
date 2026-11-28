import { env } from '@huggingface/transformers';

/**
 * transformers.js points ONNX Runtime at cdn.jsdelivr.net by default. Serve its
 * WebAssembly file from our own site instead, so no third-party code runs.
 * Vite copies this exact file (the one transformers would fetch) into the build
 * and rewrites the URL, so it works under any base path and stays in step when
 * transformers is upgraded. The matching .mjs loader is already bundled in.
 * Call it in every worker: each worker has its own copy of transformers.
 */
export function serveOnnxRuntimeLocally() {
  const wasm = new URL('../../../node_modules/@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.wasm', import.meta.url);
  // transformers sets up the wasm settings on import, so this object always exists here.
  env.backends.onnx.wasm!.wasmPaths = { wasm: wasm.href };
}
