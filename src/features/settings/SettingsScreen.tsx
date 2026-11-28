import { clearProgress, useProgress } from '@/services/progress/progress';
import { useEffect, useState } from 'react';
import { Button, LinkButton } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { backPath } from '@/app/router';
import type { DeviceReport } from '@/services/device/detectDevice';
import {
  getDetectedTier,
  getDeviceReport,
  getModelPlan,
  getTierChoice,
  onPlanChange,
  setTierChoice,
  type TierChoice,
} from '@/services/device/plan';
import { planModels, type DeviceTier, type ModelPlan } from '@/services/device/tier';
import { getSpeechEngine, type SpeechEngineStore } from '@/services/ai/speechEngine';
import { getFeedbackEngine, type FeedbackEngineStore } from '@/services/ai/feedbackEngine';
import { useModelStatus, type ModelStatus } from '@/services/ai/modelStore';
import { unloadAllModels } from '@/services/unloadModels';
import { setTimerSounds, useTimerSounds } from '@/services/audio/timerSounds';

const CHOICES: { value: TierChoice; title: string; text: string }[] = [
  { value: 'auto', title: 'Best for this device', text: 'Chosen from this device’s memory, processor and graphics chip.' },
  { value: 'high', title: 'Largest', text: 'Largest models. Needs a strong graphics chip and 8 GB of memory or more.' },
  { value: 'mid', title: 'Balanced', text: 'Good feedback and speed on most laptops.' },
  { value: 'low', title: 'Lightest', text: 'Smallest models for older laptops and phones.' },
  { value: 'no-webgpu', title: 'Light mode', text: 'Pip is off. Feedback uses your measurements only. Smallest download.' },
];

function shortModel(id: string | null): string {
  if (!id) return 'none (light mode)';
  return id.replace(/^Xenova\//, '').replace(/-q4f(16|32)_1-MLC$/, '');
}

function statusText(status: ModelStatus): string {
  switch (status.state) {
    case 'idle': return 'Not loaded';
    case 'loading': return `Loading${status.progress != null ? ` ${Math.round(status.progress * 100)}%` : ''}`;
    case 'ready': return 'Loaded and ready';
    case 'error': return 'Did not load';
    case 'unavailable': return 'Not used on this setting';
  }
}

function formatBytes(bytes: number | null): string {
  if (bytes == null) return 'Unknown';
  return bytes > 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(1)} GB` : `${Math.round(bytes / 1024 ** 2)} MB`;
}

/**
 * Shows which models run and why, lets the learner switch, and deletes
 * downloaded models, and lets the learner clear their saved progress ticks.
 */
export function SettingsScreen() {
  const [report, setReport] = useState<DeviceReport | null>(null);
  const [detected, setDetected] = useState<DeviceTier | null>(null);
  const [plan, setPlan] = useState<ModelPlan | null>(null);
  const [choice, setChoice] = useState<TierChoice>(getTierChoice());
  const [speech, setSpeech] = useState<SpeechEngineStore | null>(null);
  const [coach, setCoach] = useState<FeedbackEngineStore | null>(null);
  const [storage, setStorage] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const speechStatus = useModelStatus(speech);
  const coachStatus = useModelStatus(coach);

  const refresh = async () => {
    setPlan(await getModelPlan());
    try {
      setStorage((await navigator.storage?.estimate())?.usage ?? null);
    } catch {
      setStorage(null);
    }
  };

  useEffect(() => {
    void getDeviceReport().then(setReport);
    void getDetectedTier().then(setDetected);
    void getSpeechEngine().then(setSpeech);
    void getFeedbackEngine().then(setCoach);
    void refresh();
    return onPlanChange(() => void refresh());
  }, []);

  const choose = async (next: TierChoice) => {
    setChoice(next);
    setMessage(null);
    // Free the old models; the new ones load at the next task. The workers stop even if
    // unloading reports an error, so the new choice still applies.
    try {
      await unloadAllModels();
      setMessage('Saved for this visit. New models load when you open your next task.');
    } catch {
      setMessage('Saved for this visit. The old models did not close cleanly. If the next task is slow, reload the page.');
    }
    setTierChoice(next);
  };

  const deleteModels = async () => {
    // The workers stop even if unloading reports an error, so deleting can go ahead.
    await unloadAllModels().catch(() => undefined);
    try {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
      setMessage('Downloaded models deleted. They download again the next time you practise.');
    } catch {
      setMessage('This browser blocked access to its storage, so nothing was deleted.');
    }
    setConfirmDelete(false);
    void refresh();
  };

  return (
    <section className="narrow">
      <div className="screen-head">
        <h1>AI models and privacy</h1>
        <p>Everything runs on this device. Model choices reset when you close the tab.</p>
        <LinkButton to={backPath()} variant="secondary"><Icon name="arrow-left" /> Back to practice</LinkButton>
      </div>

      <div className="results-card">
        <h2>Running now</h2>
        {plan ? (
          <>
            <ul className="model-rows">
              <li><span>Speech-to-text</span><strong>Whisper {shortModel(plan.whisperModel).replace('whisper-', '')}</strong><em>{statusText(speechStatus)}</em></li>
              <li><span>Pip, your AI coach</span><strong>{shortModel(plan.feedbackModel)}</strong><em>{statusText(coachStatus)}</em></li>
            </ul>
            <p className="fine-print">{plan.reason}</p>
          </>
        ) : (
          <p>Checking your device…</p>
        )}
      </div>

      <div className="results-card">
        <h2>Choose your models</h2>
        <div className="tier-options" role="radiogroup" aria-label="Model size">
          {CHOICES.map((option) => {
            const needsGpu = option.value !== 'auto' && option.value !== 'no-webgpu';
            const disabled = needsGpu && report !== null && !report.webgpu;
            const preview = report && option.value !== 'auto' ? planModels(report, { tier: option.value }) : null;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={choice === option.value}
                disabled={disabled}
                className={`tier-option ${choice === option.value ? 'is-selected' : ''}`}
                onClick={() => void choose(option.value)}
              >
                <strong>{choice === option.value && <Icon name="check" size="sm" />} {option.title}{option.value === 'auto' && detected ? ` (${CHOICES.find((item) => item.value === detected)?.title ?? detected})` : ''}</strong>
                <span>{option.text}</span>
                {preview && <small>Pip: {shortModel(preview.feedbackModel)}</small>}
                {disabled && <small>Needs WebGPU. This browser does not have it.</small>}
              </button>
            );
          })}
        </div>
        {message && <p className="nudge" role="status">{message}</p>}
      </div>

      <div className="results-card">
        <h2>Your device</h2>
        {report ? (
          <ul className="model-rows">
            <li><span>Memory</span><strong>{report.ramGb ? `About ${report.ramGb} GB${report.ramGb >= 8 ? ' or more' : ''}` : 'Not reported by this browser'}</strong></li>
            <li><span>Processor cores</span><strong>{report.cpuCores ?? 'Unknown'}</strong></li>
            <li><span>WebGPU</span><strong>{report.webgpu ? `Yes${report.gpuVendor ? `, ${report.gpuVendor}` : ''}` : 'No'}</strong></li>
          </ul>
        ) : (
          <p>Checking your device…</p>
        )}
        <p className="fine-print">These details stay in your browser. They are never sent anywhere.</p>
      </div>

      <TimerSoundsCard />

      <ProgressCard />

      <div className="results-card">
        <h2>Downloaded models</h2>
        <p>
          Models are saved in your browser, so they do not download every time.{' '}
          {storage != null && storage < 1024 ** 2 ? 'Nothing is downloaded yet.' : `They use about ${formatBytes(storage)}.`}
        </p>
        {confirmDelete ? (
          <div className="row-actions">
            <Button onClick={() => void deleteModels()}>Yes, delete models</Button>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Keep them</Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirmDelete(true)}>Delete downloaded models</Button>
        )}
      </div>
    </section>
  );
}

/** Turns the timer start and end beeps on or off. */
function TimerSoundsCard() {
  const on = useTimerSounds();
  return (
    <div className="results-card">
      <h2>Sounds</h2>
      <label className="setting-toggle">
        <input type="checkbox" checked={on} onChange={(event) => setTimerSounds(event.target.checked)} aria-describedby="timer-sounds-hint" />
        Timer sounds
      </label>
      <p id="timer-sounds-hint" className="fine-print">A soft beep when each timer starts and ends. Saved on this device.</p>
    </div>
  );
}

/** How many tasks are ticked, with a button to clear them. */
function ProgressCard() {
  const progress = useProgress();
  const [confirm, setConfirm] = useState(false);
  const done = Object.keys(progress).length;
  return (
    <div className="results-card">
      <h2>Your progress</h2>
      <p>
        {done ? `You’ve finished ${done} ${done === 1 ? 'task' : 'tasks'}.` : 'No finished tasks yet.'} This browser keeps a list
        of the tasks you finished. It never keeps your answers or recordings.
      </p>
      {done > 0 &&
        (confirm ? (
          <div className="row-actions">
            <Button onClick={() => { clearProgress(); setConfirm(false); }}>Yes, clear my progress</Button>
            <Button variant="secondary" onClick={() => setConfirm(false)}>Keep them</Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirm(true)}>Clear my progress</Button>
        ))}
    </div>
  );
}
