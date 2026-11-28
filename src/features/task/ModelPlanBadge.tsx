import { useEffect, useState } from 'react';
import { href } from '@/app/router';
import { getModelPlan, getTierChoice, onPlanChange } from '@/services/device/plan';
import type { ModelPlan } from '@/services/device/tier';

/** "AI setup: best for this device" with a link to switch. Model names live in Settings. */
export function ModelPlanBadge() {
  const [plan, setPlan] = useState<ModelPlan | null>(null);

  useEffect(() => {
    const load = () => void getModelPlan().then(setPlan);
    load();
    return onPlanChange(load);
  }, []);

  if (!plan) return null;
  const text = !plan.feedbackModel
    ? 'Light mode: feedback uses your measurements only.'
    : getTierChoice() === 'auto'
      ? 'AI setup: best for this device.'
      : 'AI setup: your choice in Settings.';

  return (
    <p className="plan-badge">
      {text} <a href={href('/settings')}>Change models</a>
    </p>
  );
}
