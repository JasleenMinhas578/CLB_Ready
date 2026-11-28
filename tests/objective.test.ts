import { describe, expect, it } from 'vitest';
import { getObjectivePart } from '../src/content/modules';
import { MODULES } from './fixtures/modules';
import { clozeIds, partQuestions, VOICES } from '../src/content/objective';
import { getTaskTypesForSkill } from '../src/domain/tasks/catalog';
import { isListeningTask, isReadingTask } from '../src/domain/tasks/types';
import { correctForGoal, estimateObjective } from '../src/domain/scoring/objective';

describe('reading and listening scores', () => {
  it('follows CELPIP’s approximate chart for a full section', () => {
    expect(estimateObjective('listening', 35, 38).level).toBe(10);
    expect(estimateObjective('listening', 30, 38).level).toBe(8);
    expect(estimateObjective('reading', 28, 38).level).toBe(8);
    expect(estimateObjective('reading', 24, 38).level).toBe(7);
    expect(estimateObjective('reading', 5, 38).level).toBeNull();
    expect(estimateObjective('reading', 38, 38).partial).toBe(false);
  });

  it('scales a single part to the full section', () => {
    const estimate = estimateObjective('reading', 8, 11);
    expect(estimate.scaledRaw).toBe(28);
    expect(estimate.level).toBe(8);
    expect(estimate.partial).toBe(true);
  });

  it('says how many correct answers a part needs for the goal', () => {
    expect(correctForGoal('reading', 9, 38)).toBe(31);
    expect(correctForGoal('listening', 12, 38)).toBe(35);
    expect(correctForGoal('reading', 8, 11)).toBe(9);
  });
});

describe('reading and listening content', () => {
  it('matches CELPIP’s published shape: 38 questions in each skill', () => {
    const count = (skill: 'reading' | 'listening') =>
      getTaskTypesForSkill(skill).reduce((sum, task) => sum + (isReadingTask(task) || isListeningTask(task) ? task.questionCount : 0), 0);
    expect(count('reading')).toBe(38);
    expect(count('listening')).toBe(38);
  });

  for (const practiceModule of MODULES) {
    for (const skill of ['reading', 'listening'] as const) {
      describe(`${practiceModule.id} ${skill}`, () => {
        it('has every part with the right number of questions', () => {
          for (const task of getTaskTypesForSkill(skill)) {
            const part = getObjectivePart(practiceModule, task.id);
            expect(!!part, task.id).toBe(true);
            if (part && (isReadingTask(task) || isListeningTask(task))) expect(partQuestions(part).length, task.id).toBe(task.questionCount);
            if (part && 'clips' in part && isListeningTask(task)) expect(part.clips.length, task.id).toBe(task.clipCount);
          }
        });

        it('has valid answers and an explanation for every question', () => {
          const parts = skill === 'reading' ? practiceModule.reading ?? [] : practiceModule.listening ?? [];
          const ids = parts.flatMap(partQuestions).map((question) => question.id);
          expect(new Set(ids).size, 'unique ids').toBe(ids.length);
          for (const question of parts.flatMap(partQuestions)) {
            expect(question.answer >= 0 && question.answer < question.options.length, question.id).toBe(true);
            expect(new Set(question.options).size, `${question.id} distinct options`).toBe(question.options.length);
            expect(question.why.length > 10, question.id).toBe(true);
          }
        });

        it('does not give the answer away by making it much longer than the others', () => {
          const parts = skill === 'reading' ? practiceModule.reading ?? [] : practiceModule.listening ?? [];
          const tells = parts.flatMap(partQuestions).filter((question) => {
            const correct = question.options[question.answer].length;
            const longestWrong = Math.max(...question.options.filter((_, index) => index !== question.answer).map((option) => option.length));
            return question.options.length === 4 && correct > longestWrong * 1.3;
          });
          expect(tells.map((question) => question.id), 'answers much longer than every wrong option').toEqual([]);
        });

        it('does not put most answers in the same position', () => {
          const parts = skill === 'reading' ? practiceModule.reading ?? [] : practiceModule.listening ?? [];
          const fourWay = parts.flatMap(partQuestions).filter((question) => question.options.length === 4);
          const counts = [0, 1, 2, 3].map((position) => fourWay.filter((question) => question.answer === position).length);
          expect(Math.max(...counts) <= fourWay.length * 0.4, `answer positions ${counts.join('/')}`).toBe(true);
        });
      });
    }

    for (const part of practiceModule.reading ?? []) {
      it(`${part.id}: every blank in a passage is a question, and blanks have no question text`, () => {
        const ids = new Set(part.questions.map((question) => question.id));
        for (const block of part.blocks) {
          if (block.kind !== 'cloze') continue;
          for (const id of clozeIds(block.body)) {
            expect(ids.has(id), id).toBe(true);
            expect(part.questions.find((question) => question.id === id)?.text, id).toBe('');
          }
        }
      });
    }

    for (const part of practiceModule.listening ?? []) {
      it(`${part.id}: every line has a known speaker and voice`, () => {
        for (const clip of part.clips) {
          const names = new Set(clip.speakers.map((speaker) => speaker.name));
          for (const line of clip.lines) expect(names.has(line.speaker), `${clip.id} ${line.speaker}`).toBe(true);
          for (const speaker of clip.speakers) expect(speaker.voice in VOICES, speaker.voice).toBe(true);
        }
      });
    }
  }
});
