import { detectDevice } from './detectDevice';
import { planModels, type ModelPlan } from './tier';

let planPromise: Promise<ModelPlan> | null = null;

/** Detects the device once per session and reuses the model plan. */
export function getModelPlan(): Promise<ModelPlan> {
  planPromise ??= detectDevice().then(planModels);
  return planPromise;
}
