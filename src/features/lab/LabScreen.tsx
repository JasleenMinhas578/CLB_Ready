import { useEffect, useRef, useState } from 'react';
import { detectDevice, type DeviceReport } from '@/services/device/detectDevice';
import { planModels, type ModelPlan } from '@/services/device/tier';
import { WhisperSpeechToText } from '@/services/ai/whisperClient';
import { WebLlmFeedbackModel, estimatedGpuMb } from '@/services/ai/webllmClient';
import { buildFeedbackPrompt, parseFeedback } from '@/services/ai/feedbackPrompt';
import type { GenerationStats, LoadProgress } from '@/services/ai/types';
import { startRecording, toWhisperAudio } from '@/services/audio/recorder';
import { getCriteria } from '@/domain/criteria';
import { getPrompt } from '@/content/modules';
import { Button } from '@/components/Button';
import { Emoji } from '@/components/Emoji';

/**
 * Model lab: loads both models and measures them on this device.
 * Use the numbers here when someone asks "how fast is it, how much memory?"
 */

const SAMPLE_ANSWER =
  'I think you should join a club, like a sports club or a book club. It is good because you meet people. Also you can try volunteering, it is nice and people are friendly. Um, and maybe talk to your neighbours.';

const LAB_RECORD_SECONDS = 30;

function ms(value: number | null | undefined): string {
  if (value == null) return '–';
  return value >= 1000 ? `${(value / 1000).toFixed(1)} s` : `${Math.round(value)} ms`;
}

function mb(bytes: number | null | undefined): string {
  if (bytes == null) return '–';
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

function ProgressBar({ progress }: { progress: LoadProgress | null }) {
  if (!progress) return null;
  const percent = progress.fraction == null ? null : Math.round(progress.fraction * 100);
  return (
    <div className="lab-progress">
      <div className="bar"><span className="bar-fill" style={{ width: `${percent ?? 5}%` }} /></div>
      <span>{percent != null ? `${percent}% ` : ''}{progress.text}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="lab-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function useMemorySnapshot() {
  const [heap, setHeap] = useState<number | null>(null);
  const [storage, setStorage] = useState<number | null>(null);
  const refresh = async () => {
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    setHeap(memory?.usedJSHeapSize ?? null);
    try {
      const estimate = await navigator.storage?.estimate();
      setStorage(estimate?.usage ?? null);
    } catch {
      setStorage(null);
    }
  };
  useEffect(() => {
    void refresh();
  }, []);
  return { heap, storage, refresh };
}

export default function LabScreen() {
  const [device, setDevice] = useState<DeviceReport | null>(null);
  const [plan, setPlan] = useState<ModelPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const memory = useMemorySnapshot();

  // Speech model
  const whisper = useRef<WhisperSpeechToText | null>(null);
  const [whisperState, setWhisperState] = useState<'idle' | 'loading' | 'ready' | 'recording' | 'working'>('idle');
  const [whisperProgress, setWhisperProgress] = useState<LoadProgress | null>(null);
  const [whisperLoadMs, setWhisperLoadMs] = useState<number | null>(null);
  const [transcript, setTranscript] = useState<{ text: string; ms: number; seconds: number; words: number } | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  // Feedback model
  const llm = useRef<WebLlmFeedbackModel | null>(null);
  const [llmState, setLlmState] = useState<'idle' | 'loading' | 'ready' | 'working'>('idle');
  const [llmProgress, setLlmProgress] = useState<LoadProgress | null>(null);
  const [llmLoadMs, setLlmLoadMs] = useState<number | null>(null);
  const [reply, setReply] = useState('');
  const [genStats, setGenStats] = useState<GenerationStats | null>(null);
  const [validJson, setValidJson] = useState<boolean | null>(null);

  useEffect(() => {
    void detectDevice().then((report) => {
      setDevice(report);
      setPlan(planModels(report));
    });
    return () => {
      void whisper.current?.unload();
      void llm.current?.unload();
    };
  }, []);

  const fail = (err: unknown) => setError(err instanceof Error ? err.message : String(err));

  const loadWhisper = async () => {
    if (!plan) return;
    setError(null);
    setWhisperState('loading');
    try {
      whisper.current = new WhisperSpeechToText(plan.whisperModel, plan.whisperDevice);
      const { elapsedMs } = await whisper.current.load(setWhisperProgress);
      setWhisperLoadMs(elapsedMs);
      setWhisperState('ready');
      void memory.refresh();
    } catch (err) {
      fail(err);
      setWhisperState('idle');
    }
  };

  const recordAndTranscribe = async () => {
    if (!whisper.current) return;
    setError(null);
    try {
      setWhisperState('recording');
      const session = await startRecording(LAB_RECORD_SECONDS);
      stopRef.current = session.stop;
      const recording = await session.finished;
      stopRef.current = null;
      setWhisperState('working');
      const audio = await toWhisperAudio(recording.blob);
      const result = await whisper.current.transcribe(audio);
      setTranscript({ text: result.text, ms: result.elapsedMs, seconds: recording.durationSeconds, words: result.words.length });
      setWhisperState('ready');
    } catch (err) {
      fail(err);
      setWhisperState('ready');
    }
  };

  const loadLlm = async () => {
    if (!plan?.feedbackModel) return;
    setError(null);
    setLlmState('loading');
    try {
      llm.current = new WebLlmFeedbackModel(plan.feedbackModel);
      const { elapsedMs } = await llm.current.load(setLlmProgress);
      setLlmLoadMs(elapsedMs);
      setLlmState('ready');
      void memory.refresh();
    } catch (err) {
      fail(err);
      setLlmState('idle');
    }
  };

  const runFeedback = async () => {
    const prompt = getPrompt('module-1', 'speaking-1');
    if (!llm.current || !prompt) return;
    setError(null);
    setLlmState('working');
    setReply('');
    setValidJson(null);
    try {
      const { system, user } = buildFeedbackPrompt({
        taskTitle: 'Giving advice',
        promptText: prompt.text,
        checklist: prompt.checklist,
        criteria: getCriteria('speaking'),
        goal: 9,
        answer: transcript?.text || SAMPLE_ANSWER,
      });
      const result = await llm.current.generateJson(system, user, setReply);
      setGenStats(result.stats);
      setValidJson(parseFeedback(result.text) !== null);
      await llm.current.reset();
    } catch (err) {
      fail(err);
    } finally {
      setLlmState('ready');
      void memory.refresh();
    }
  };

  const clearModels = async () => {
    await whisper.current?.unload();
    await llm.current?.unload();
    whisper.current = null;
    llm.current = null;
    setWhisperState('idle');
    setLlmState('idle');
    try {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    } catch {
      // Cache Storage can be unavailable in private windows.
    }
    void memory.refresh();
  };

  const gpuMb = plan?.feedbackModel ? estimatedGpuMb(plan.feedbackModel) : null;

  return (
    <section className="lab">
      <div className="screen-head align-left">
        <h1><Emoji symbol="🧪" size="lg" /> Model lab</h1>
        <p>Load the AI models on this device and measure how fast they run. Everything stays in your browser.</p>
      </div>

      {error && <p className="error-box" role="alert">{error}</p>}

      <div className="lab-card">
        <h2>Your device</h2>
        {!device || !plan ? (
          <p>Checking your device…</p>
        ) : (
          <>
            <div className="lab-stats">
              <Stat label="Memory (approx.)" value={device.ramGb ? `${device.ramGb} GB${device.ramGb >= 8 ? '+' : ''}` : 'Not reported'} />
              <Stat label="CPU cores" value={device.cpuCores ? String(device.cpuCores) : '–'} />
              <Stat label="WebGPU" value={device.webgpu ? 'Available' : 'Not available'} />
              <Stat label="16-bit GPU maths" value={device.shaderF16 ? 'Yes' : 'No'} />
              <Stat label="GPU" value={device.gpuVendor ?? '–'} />
              <Stat label="Tier" value={plan.tier} />
            </div>
            <p className="lab-plan">
              <Emoji symbol="🧠" /> {plan.reason} Speech: <code>{plan.whisperModel}</code> on {plan.whisperDevice}.
              Feedback: <code>{plan.feedbackModel ?? 'light mode'}</code>.
            </p>
          </>
        )}
      </div>

      <div className="lab-card">
        <h2>1. Speech to text</h2>
        <div className="row-actions">
          <Button onClick={loadWhisper} disabled={!plan || whisperState !== 'idle'}>
            {whisperState === 'loading' ? 'Loading…' : whisperState === 'idle' ? 'Load speech model' : 'Speech model ready'}
          </Button>
          {whisperState === 'recording' ? (
            <Button variant="secondary" onClick={() => stopRef.current?.()}>Stop recording</Button>
          ) : (
            <Button variant="secondary" onClick={recordAndTranscribe} disabled={whisperState !== 'ready'}>
              {whisperState === 'working' ? 'Transcribing…' : `Record up to ${LAB_RECORD_SECONDS}s`}
            </Button>
          )}
        </div>
        <ProgressBar progress={whisperState === 'loading' ? whisperProgress : null} />
        <div className="lab-stats">
          <Stat label="Load time" value={ms(whisperLoadMs)} />
          <Stat label="Audio length" value={transcript ? `${transcript.seconds.toFixed(1)} s` : '–'} />
          <Stat label="Transcribe time" value={ms(transcript?.ms)} />
          <Stat label="Words with timings" value={transcript ? String(transcript.words) : '–'} />
        </div>
        {transcript && <p className="lab-output">{transcript.text || '(No speech detected)'}</p>}
      </div>

      <div className="lab-card">
        <h2>2. Feedback model</h2>
        {plan && !plan.feedbackModel ? (
          <p>This device has no WebGPU, so the app will use light mode (code-only feedback).</p>
        ) : (
          <>
            <div className="row-actions">
              <Button onClick={loadLlm} disabled={!plan || llmState !== 'idle'}>
                {llmState === 'loading' ? 'Loading…' : llmState === 'idle' ? 'Load feedback model' : 'Feedback model ready'}
              </Button>
              <Button variant="secondary" onClick={runFeedback} disabled={llmState !== 'ready'}>
                {llmState === 'working' ? 'Writing feedback…' : transcript ? 'Get feedback on my recording' : 'Get feedback on a sample answer'}
              </Button>
            </div>
            <ProgressBar progress={llmState === 'loading' ? llmProgress : null} />
            <div className="lab-stats">
              <Stat label="Load time" value={ms(llmLoadMs)} />
              <Stat label="First words after" value={ms(genStats?.firstTokenMs)} />
              <Stat label="Speed" value={genStats ? `${genStats.tokensPerSecond.toFixed(1)} tokens/s` : '–'} />
              <Stat label="Total time" value={ms(genStats?.totalMs)} />
              <Stat label="Tokens in / out" value={genStats ? `${genStats.promptTokens} / ${genStats.completionTokens}` : '–'} />
              <Stat label="Valid JSON" value={validJson == null ? '–' : validJson ? 'Yes' : 'No'} />
            </div>
            {reply && <pre className="lab-output">{reply}</pre>}
          </>
        )}
      </div>

      <div className="lab-card">
        <h2>3. Memory and storage</h2>
        <div className="lab-stats">
          <Stat label="Page memory (JS heap)" value={memory.heap == null ? 'Chrome only' : mb(memory.heap)} />
          <Stat label="GPU memory needed (est.)" value={gpuMb ? `${Math.round(gpuMb)} MB` : '–'} />
          <Stat label="Downloaded models" value={mb(memory.storage)} />
        </div>
        <p className="fine-print">
          Browsers don't report GPU memory directly. For real numbers, open Chrome's task manager (Shift + Esc)
          and watch the GPU process while a model loads.
        </p>
        <div className="row-actions">
          <Button variant="quiet" onClick={() => void memory.refresh()}>Refresh</Button>
          <Button variant="quiet" onClick={() => void clearModels()}>Delete downloaded models</Button>
        </div>
      </div>
    </section>
  );
}
