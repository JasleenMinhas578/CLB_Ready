import { useEffect, useState } from 'react';
import { href } from '@/app/router';
import { getModelPlan, getTierChoice, onPlanChange } from '@/services/device/plan';
import type { ModelPlan } from '@/services/device/tier';

/** "Running Qwen2.5-1.5B, best for your device" with a link to switch. */
export function ModelPlanBadge({ needsSpeech }: { needsSpeech: boolean }) {
  const [plan, setPlan] = useState<ModelPlan | null>(null);

  useEffect(() => {
    const load = () => void getModelPlan().then(setPlan);
    load();
    return onPlanChange(load);
  }, []);

  if (!plan) return null;
  const coach = plan.feedbackModel ? plan.feedbackModel.replace(/-q4f(16|32)_1-MLC$/, '') : 'light mode';
  const speech = plan.whisperModel.replace(/^.*whisper-/, 'Whisper ');
  const why = getTierChoice() === 'auto' ? 'best for your device' : 'your choice';

  return (
    <p className="plan-badge">
      <span aria-hidden="true">🧠</span> Running {needsSpeech ? `${speech} and ` : ''}
      {coach}, {why}. <a href={href('/settings')}>Change</a>
    </p>
  );
}
