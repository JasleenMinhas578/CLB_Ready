import { describe, expect, it } from 'vitest';
import { createHistory, record, redo, replaceRange, undo } from '../src/features/task/exam/editorHistory';
import { promptForModel } from '../src/content/promptText';
import { targetText } from '../src/features/task/exam/wordTarget';
import { module1 } from '../src/content/modules/module1';

describe('editor history', () => {
  it('groups fast typing into one undo step', () => {
    let h = createHistory('');
    h = record(h, 'H', 0);
    h = record(h, 'He', 100);
    h = record(h, 'Hey', 200);
    h = undo(h);
    expect(h.present).toBe('');
  });

  it('starts a new step after a pause', () => {
    let h = createHistory('');
    h = record(h, 'Hi', 0);
    h = record(h, 'Hi there', 5000);
    expect(undo(h).present).toBe('Hi');
  });

  it('makes cuts and pastes their own step, and redo restores them', () => {
    let h = createHistory('');
    h = record(h, 'Dear team', 0);
    h = record(h, 'Dear team, thanks', 100, true);
    h = undo(h);
    expect(h.present).toBe('Dear team');
    expect(redo(h).present).toBe('Dear team, thanks');
  });

  it('ignores undo and redo with nothing to do', () => {
    const h = createHistory('x');
    expect(undo(h)).toEqual(h);
    expect(redo(h)).toEqual(h);
  });

  it('replaces a selection and places the caret after the insert', () => {
    expect(replaceRange('I like cats', 7, 11, 'dogs')).toEqual({ text: 'I like dogs', caret: 11 });
  });
});

describe('promptForModel', () => {
  it('includes the points and the chosen option for the AI coach', () => {
    const survey = module1.prompts.find((prompt) => prompt.taskTypeId === 'writing-2');
    if (!survey) throw new Error('missing survey prompt');
    const text = promptForModel(survey, 1);
    expect(text.includes('- Choose Option A or Option B')).toBe(true);
    expect(text.includes('The learner selected option B.')).toBe(true);
  });

  it('describes the picture, so the AI coach can tell whether an answer is about it', () => {
    const scene = module1.prompts.find((prompt) => prompt.taskTypeId === 'speaking-3');
    if (!scene?.scene) throw new Error('missing scene prompt');
    expect(promptForModel(scene)).toContain(`The picture shows: ${scene.scene.description}`);
  });
});

describe('targetText', () => {
  const range = { min: 150, max: 200 };
  it('always shows the full 150–200 range', () => {
    expect(targetText(0, range)).toBe('Target: 150–200 words');
    expect(targetText(116, range)).toBe('Target: 150–200 words, 34 more needed');
    expect(targetText(150, range)).toBe('Target: 150–200 words, on target');
    expect(targetText(200, range)).toBe('Target: 150–200 words, on target');
    expect(targetText(212, range)).toBe('Target: 150–200 words, 12 over');
  });
});
