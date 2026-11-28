/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Content Security Policy for the built page. GitHub Pages can't send headers, so
// it goes in a <meta> tag, added at build time only because the dev server uses
// inline scripts. 'wasm-unsafe-eval' lets WebAssembly compile; nothing needs eval
// or inline code. The page itself only fetches its own files: models are downloaded
// by the workers, which are separate same-origin files whose fetches follow the
// worker's policy, not this one.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "worker-src 'self'",
  "connect-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const CHARSET = '<meta charset="UTF-8" />';

function contentSecurityPolicy(): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml(html) {
      if (!html.includes(CHARSET)) throw new Error('index.html has no charset meta to put the CSP after.');
      return html.replace(CHARSET, `${CHARSET}\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`);
    },
  };
}

// Static site: everything runs in the visitor's browser.
// `base` is './' so the build also works on GitHub Pages sub-paths.
export default defineConfig({
  base: './',
  plugins: [react(), contentSecurityPolicy()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  worker: { format: 'es' },
  build: { target: 'es2022' },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
