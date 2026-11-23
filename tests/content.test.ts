import { describe, expect, it } from 'vitest';
import { MODULES, moduleHasSkill } from '../src/content/modules';
import { TASK_TYPES, getTaskType, getTaskTypesForSkill } from '../src/domain/tasks/catalog';
import { SKILLS } from '../src/domain/skills';

// Guards for content added later: every module must be valid, and any
// skill a module has started must be complete for that skill.
describe('content integrity', () => {
  it('has unique task type ids', () => {
    const ids = TASK_TYPES.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only defines task types for known skills', () => {
    const skillIds = new Set(SKILLS.map((skill) => skill.id));
    for (const task of TASK_TYPES) expect(skillIds.has(task.skill)).toBe(true);
  });

  it('has unique prompt ids across all modules', () => {
    const ids = MODULES.flatMap((item) => item.prompts.map((prompt) => prompt.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a complete module 1 for practice', () => {
    expect(MODULES[0].prompts.map((prompt) => prompt.taskTypeId).sort()).toEqual(TASK_TYPES.map((task) => task.id).sort());
  });

  for (const practiceModule of MODULES) {
    describe(practiceModule.title, () => {
      it('has exactly one prompt per task type for each skill it has started', () => {
        for (const skill of SKILLS.filter((item) => moduleHasSkill(practiceModule, item.id))) {
          const expected = getTaskTypesForSkill(skill.id).map((task) => task.id).sort();
          const covered = practiceModule.prompts
            .filter((prompt) => getTaskType(prompt.taskTypeId)?.skill === skill.id)
            .map((prompt) => prompt.taskTypeId)
            .sort();
          expect(covered, `${practiceModule.id} ${skill.id}`).toEqual(expected);
        }
      });

      it('references real task types and has a checklist', () => {
        for (const prompt of practiceModule.prompts) {
          expect(getTaskType(prompt.taskTypeId), prompt.id).toBeDefined();
          expect(prompt.checklist.length, prompt.id).toBeGreaterThan(0);
        }
      });

      it('sets a tone for the email task', () => {
        const email = practiceModule.prompts.find((item) => item.taskTypeId === 'writing-1');
        if (email) expect(email.tone, email.id).toBeDefined();
      });

      it('gives two options to the choice tasks', () => {
        for (const prompt of practiceModule.prompts.filter((item) => ['speaking-5', 'writing-2'].includes(item.taskTypeId))) {
          expect(prompt.options?.length, prompt.id).toBe(2);
        }
      });
    });
  }
});
