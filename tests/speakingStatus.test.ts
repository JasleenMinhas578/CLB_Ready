import { describe, expect, it } from 'vitest';
import { afterMicOpened, speakingActionDisabled, speakingActionLabel, speakingExitWarning } from '../src/features/task/exam/speakingStatus';
import { startUnlessLeft } from '../src/features/task/useAnswerRecorder';
import type { RecordingSession } from '../src/services/audio/recorder';

describe('speaking exam bar', () => {
  it('says the answer is being checked instead of showing a disabled Next', () => {
    expect(speakingActionLabel('transcribing', 'answer')).toBe('Checking…');
    expect(speakingActionLabel('running', 'answer')).toBe('Finish answer');
    expect(speakingActionLabel('running', 'prep')).toBe('Skip');
  });

  it('leaves the bar without a button before the timers, so the panel holds the one Start', () => {
    expect(speakingActionLabel('ready', 'prep')).toBeNull();
    expect(speakingActionLabel('mic-check', 'prep')).toBeNull();
    expect(speakingActionLabel('problem', 'answer')).toBeNull();
  });

  it('keeps Finish off until the mic is recording', () => {
    expect(speakingActionDisabled('running', 'answer', false)).toBe(true);
    expect(speakingActionDisabled('running', 'answer', true)).toBe(false);
    expect(speakingActionDisabled('running', 'prep', false)).toBe(false);
    expect(speakingActionDisabled('ready', 'prep', false)).toBe(true);
    expect(speakingActionDisabled('transcribing', 'answer', false)).toBe(true);
  });

  it('turns the mic off when the answer ended while it was opening', () => {
    expect(afterMicOpened(true, 'running')).toBe('record');
    expect(afterMicOpened(true, 'transcribing')).toBe('stop');
    expect(afterMicOpened(true, 'ready')).toBe('stop');
    expect(afterMicOpened(false, 'running')).toBe('problem');
  });

  it('warns before Exit while recording or while the answer is being checked', () => {
    expect(speakingExitWarning('running', true)).toMatch(/recording/);
    expect(speakingExitWarning('transcribing', false)).toMatch(/still being checked/);
    expect(speakingExitWarning('running', false)).toBeUndefined();
    expect(speakingExitWarning('ready', false)).toBeUndefined();
  });
});

describe('starting the mic', () => {
  function fakeSession() {
    const session = { stopped: false, stream: {} as MediaStream, finished: new Promise<never>(() => {}), stop: () => (session.stopped = true) };
    return session;
  }

  it('keeps the recording when the screen is still open', async () => {
    const session = fakeSession();
    await expect(startUnlessLeft(async () => session as RecordingSession, () => false)).resolves.toBe(session);
    expect(session.stopped).toBe(false);
  });

  it('turns the mic off when the screen closed while it was starting', async () => {
    const session = fakeSession();
    let left = false;
    const starting = startUnlessLeft(async () => {
      left = true; // The learner leaves while the browser is still asking for the mic.
      return session as RecordingSession;
    }, () => left);
    await expect(starting).resolves.toBeNull();
    expect(session.stopped).toBe(true);
  });
});
