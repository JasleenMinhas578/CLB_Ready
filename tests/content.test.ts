import { describe, expect, it } from 'vitest';
import { MODULES, moduleHasSkill, moduleTaskIds } from '../src/content/modules';
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

  it('has speaking and writing in every module', () => {
    for (const practiceModule of MODULES) {
      const covered = practiceModule.prompts.map((prompt) => getTaskType(prompt.taskTypeId)?.skill);
      expect(covered.filter((skill) => skill === 'speaking').length, practiceModule.id).toBe(8);
      expect(covered.filter((skill) => skill === 'writing').length, practiceModule.id).toBe(2);
    }
  });

  it('has a complete module 1 for practice', () => {
    expect(moduleTaskIds(MODULES[0]).sort()).toEqual(TASK_TYPES.map((task) => task.id).sort());
  });

  for (const practiceModule of MODULES) {
    describe(practiceModule.title, () => {
      it('has exactly one prompt per task type for each skill it has started', () => {
        for (const skill of SKILLS.filter((item) => moduleHasSkill(practiceModule, item.id))) {
          const expected = getTaskTypesForSkill(skill.id).map((task) => task.id).sort();
          const covered = moduleTaskIds(practiceModule)
            .filter((id) => getTaskType(id)?.skill === skill.id)
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

      it('gives every picture task a picture or a scene brief', () => {
        for (const prompt of practiceModule.prompts) {
          if (getTaskType(prompt.taskTypeId)?.needsImage) expect(!!(prompt.image || prompt.scene), prompt.id).toBe(true);
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
