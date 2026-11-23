import { detectDevice, type DeviceReport } from './detectDevice';
import { TIER_ORDER, chooseTier, planModels, type DeviceTier, type ModelPlan } from './tier';

/**
 * The session's model plan: detected tier, or the learner's choice from
 * Settings, minus any automatic fallbacks after a failed load.
 * Kept in memory only, like everything else about the learner.
 */
export type TierChoice = 'auto' | DeviceTier;

let reportPromise: Promise<DeviceReport> | null = null;
let choice: TierChoice = 'auto';
let stepsDown = 0;
const listeners = new Set<() => void>();

export function getDeviceReport(): Promise<DeviceReport> {
  reportPromise ??= detectDevice();
  return reportPromise;
}

export async function getModelPlan(): Promise<ModelPlan> {
  const report = await getDeviceReport();
  return planModels(report, { tier: choice === 'auto' ? undefined : choice, stepsDown });
}

export function getTierChoice(): TierChoice {
  return choice;
}

export async function getDetectedTier(): Promise<DeviceTier> {
  return chooseTier(await getDeviceReport());
}

/** Used by Settings. Clears any automatic fallback. */
export function setTierChoice(next: TierChoice): void {
  choice = next;
  stepsDown = 0;
  listeners.forEach((listener) => listener());
}

/**
 * Called when a model fails to load (often out of memory). Steps down one
 * tier so the next try uses smaller models. Returns false at the lightest tier.
 */
export async function fallBackOneTier(): Promise<boolean> {
  const plan = await getModelPlan();
  if (plan.tier === TIER_ORDER[TIER_ORDER.length - 1]) return false;
  stepsDown += 1;
  listeners.forEach((listener) => listener());
  return true;
}

export function onPlanChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
