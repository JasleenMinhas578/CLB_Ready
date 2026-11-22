import type { DeviceSignals } from './tier';

/** Minimal WebGPU shapes so we don't need extra type packages. */
interface GpuAdapterLike {
  features: { has(name: string): boolean };
  limits: { maxBufferSize: number };
  info?: { vendor?: string; architecture?: string };
}
interface GpuLike {
  requestAdapter(options?: { powerPreference?: string }): Promise<GpuAdapterLike | null>;
}

export interface DeviceReport extends DeviceSignals {
  gpuVendor: string | null;
  gpuArchitecture: string | null;
}

/**
 * Reads device hints with no permission prompt. These values stay in the
 * browser; only the resulting tier name is ever counted (privacy spec).
 */
export async function detectDevice(): Promise<DeviceReport> {
  const nav = navigator as Navigator & { deviceMemory?: number; gpu?: GpuLike };
  const report: DeviceReport = {
    ramGb: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
    cpuCores: typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null,
    webgpu: false,
    shaderF16: false,
    maxBufferBytes: null,
    isMobile: /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent),
    gpuVendor: null,
    gpuArchitecture: null,
  };

  if (!nav.gpu) return report;
  try {
    const adapter = await nav.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return report;
    report.webgpu = true;
    report.shaderF16 = adapter.features.has('shader-f16');
    report.maxBufferBytes = adapter.limits.maxBufferSize;
    report.gpuVendor = adapter.info?.vendor || null;
    report.gpuArchitecture = adapter.info?.architecture || null;
  } catch {
    // A blocklisted or crashed GPU behaves like no WebGPU.
  }
  return report;
}
