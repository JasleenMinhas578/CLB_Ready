import { describe, expect, it } from 'vitest';
import { speakingActionLabel, speakingExitWarning } from '../src/features/task/exam/speakingStatus';
import { startUnlessLeft } from '../src/features/task/useAnswerRecorder';
import type { RecordingSession } from '../src/services/audio/recorder';

describe('speaking exam bar', () => {
  it('says the answer is saving instead of showing a disabled Next', () => {
    expect(speakingActionLabel('transcribing', 'answer')).toBe('Saving…');
    expect(speakingActionLabel('running', 'answer')).toBe('Finish answer');
    expect(speakingActionLabel('running', 'prep')).toBe('Skip');
    expect(speakingActionLabel('ready', 'prep')).toBe('Start');
    expect(speakingActionLabel('mic-check', 'prep')).toBe('Next');
  });

  it('warns before Exit while recording or while the answer is being saved', () => {
    expect(speakingExitWarning('running', true)).toMatch(/recording/);
    expect(speakingExitWarning('transcribing', false)).toMatch(/still being saved/);
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
