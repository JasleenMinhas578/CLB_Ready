import { describe, expect, it } from 'vitest';
import { MODULES } from '../src/content/modules';
import { TASK_TYPES, getTaskType } from '../src/domain/tasks/catalog';
import { SKILLS } from '../src/domain/skills';

// Guards for content added later: a new module must be complete and valid.
describe('content integrity', () => {
  it('has unique task type ids', () => {
    const ids = TASK_TYPES.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only defines task types for known skills', () => {
    const skillIds = new Set(SKILLS.map((skill) => skill.id));
    for (const task of TASK_TYPES) expect(skillIds.has(task.skill)).toBe(true);
  });

  for (const practiceModule of MODULES.filter((item) => item.status === 'available')) {
    describe(practiceModule.title, () => {
      it('has exactly one prompt per task type', () => {
        const covered = practiceModule.prompts.map((prompt) => prompt.taskTypeId).sort();
        expect(covered).toEqual(TASK_TYPES.map((task) => task.id).sort());
      });

      it('references real task types and has a checklist', () => {
        for (const prompt of practiceModule.prompts) {
          expect(getTaskType(prompt.taskTypeId), prompt.id).toBeDefined();
          expect(prompt.checklist.length, prompt.id).toBeGreaterThan(0);
        }
      });

      it('sets a tone for the email task', () => {
        const email = practiceModule.prompts.find((item) => item.taskTypeId === 'writing-1');
        expect(email?.tone).toBeDefined();
      });

      it('gives two options to the choice tasks', () => {
        for (const id of ['speaking-5', 'writing-2']) {
          const prompt = practiceModule.prompts.find((item) => item.taskTypeId === id);
          expect(prompt?.options?.length, id).toBe(2);
        }
      });
    });
  }
});
