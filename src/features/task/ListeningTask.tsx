import { useEffect, useRef, useState } from 'react';
import type { ListeningTaskType } from '@/domain/tasks/types';
import type { ListeningPart } from '@/content/objective';
import { useSession } from '@/app/session';
import { navigate } from '@/app/router';
import { DEFAULT_GOAL, newAttemptId } from '@/domain/attempt';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { useCountdown } from './useCountdown';
import { ExamBar, TimeRemaining } from './exam/ExamBar';
import { QuestionList, type Answers } from './objective/Questions';
import { useClipPlayer } from './objective/useClipPlayer';

/** Time to answer each question after a recording, close to test day. */
export const SECONDS_PER_QUESTION = 30;

/**
 * Test-style listening part. For each recording: read who is talking,
 * press Play, listen once (no pause, no replay), then answer its questions
 * before the clock runs out. Questions appear only after the recording ends.
 */
export function ListeningTask({ task, part, moduleId }: { task: ListeningTaskType; part: ListeningPart; moduleId: string }) {
  const { goal, setLastAttempt } = useSession();
  const [clipIndex, setClipIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const clip = part.clips[clipIndex];
  const player = useClipPlayer(moduleId, clip);
  const answering = player.state === 'done';
  const total = getTaskTypesForSkill('listening').length;
  const questionStart = part.clips.slice(0, clipIndex).reduce((sum, item) => sum + item.questions.length, 1);
  const lastClip = clipIndex === part.clips.length - 1;

  const finish = () => {
    setLastAttempt({
      id: newAttemptId(),
      skill: 'listening',
      moduleId,
      taskTypeId: task.id,
      taskTitle: `Listening part ${task.order}: ${task.title}`,
      partId: part.id,
      answers: Object.fromEntries(
        part.clips.flatMap((item) => item.questions).map((question) => [question.id, answersRef.current[question.id] ?? null]),
      ),
      goal: goal ?? DEFAULT_GOAL,
      goalChosen: goal !== null,
    });
    navigate('/results');
  };

  const next = () => (lastClip ? finish() : setClipIndex((index) => index + 1));
  const secondsLeft = useCountdown(clip.questions.length * SECONDS_PER_QUESTION, answering, next, clip.id);

  // Move to the top of the screen for each new recording.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [clipIndex]);

  return (
    <div className="exam-screen">
      <ExamBar
        position={`Listening Part ${task.order} of ${total}${part.clips.length > 1 ? `, recording ${clipIndex + 1} of ${part.clips.length}` : ''}`}
        title={task.title}
        exitTo={`/practice/listening/${moduleId}`}
        status={answering ? <TimeRemaining seconds={secondsLeft} totalSeconds={clip.questions.length * SECONDS_PER_QUESTION} warnBelow={20} label="Time to answer" /> : undefined}
        action={
          <button type="button" className="exam-next" onClick={next} disabled={!answering}>
            {lastClip ? 'Finish' : 'Next'}
          </button>
        }
      />
      <div className="exam-body listening-body">
        <div className="exam-panel listening-panel">
          <p className="exam-instructions-inline">{part.instructions}</p>
          <p className="listening-intro">{clip.intro}</p>
          {player.state === 'preparing' && (
            <p className="ai-voice-status" aria-live="polite">
              <span className="spinner" aria-hidden="true" />
              {player.voiceLoading !== null
                ? `Downloading the AI voice${player.voiceLoading ? ` (${Math.round(player.voiceLoading * 100)}%)` : ''}. This happens once, then it’s saved in your browser.`
                : 'Getting the voices ready…'}
            </p>
          )}
          {player.state === 'ready' && (
            <div className="exam-message">
              <p>The recording plays once. You can’t pause or replay it, so take notes if that helps.</p>
              <button type="button" className="exam-play" onClick={player.play}>▶ Play recording</button>
            </div>
          )}
          {player.state === 'playing' && (
            <div className="audio-progress" aria-live="polite">
              <span className="rec-dot listening-dot" aria-hidden="true" /> Playing…
              <div className="phase-bar" role="progressbar" aria-label="Recording progress" aria-valuenow={Math.round(player.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${player.progress * 100}%` }} />
              </div>
            </div>
          )}
          {player.source && player.state !== 'preparing' && (
            <p className="exam-note">
              {player.source === 'ai'
                ? 'These voices are made by AI in your browser. Nothing is sent anywhere.'
                : player.source === 'recorded'
                  ? 'These voices were made by AI.'
                  : 'The AI voice couldn’t run on this device, so your browser’s own voice is reading the recording.'}
            </p>
          )}
        </div>
        {answering && (
          <div className="exam-panel">
            <QuestionList questions={clip.questions} startAt={questionStart} answers={answers} onAnswer={(id, option) => setAnswers((current) => ({ ...current, [id]: option }))} />
          </div>
        )}
      </div>
    </div>
  );
}
