import { describe, expect, it } from 'vitest';
import { loadModule } from '../src/content/modules';
import { CONTENT_COUNTS, MODULE_CATALOG } from '../src/content/modules/catalog';
import { partQuestions } from '../src/content/objective';
import { MODULES, moduleTaskIds } from './fixtures/modules';
import { TASK_TYPES, getTaskType } from '../src/domain/tasks/catalog';
import { SKILLS } from '../src/domain/skills';
import { checkGrammar } from '../src/services/grammar/ruleChecker';
import { targetSpokenWords } from '../src/domain/scoring/sufficiency';

// Guards for content added later: every module must be valid and have every task,
// since the skill screens list every task for every module.
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

  it('lists every module in the catalogue as its content describes it', async () => {
    expect(MODULE_CATALOG.map((item) => item.id)).toEqual(MODULES.map((item) => item.id));
    for (const practiceModule of MODULES) {
      const { id, number, title } = practiceModule;
      expect(MODULE_CATALOG.find((item) => item.id === id)).toEqual({ id, number, title });
      expect(await loadModule(id)).toBe(practiceModule);
    }
    expect(await loadModule('module-99')).toBeUndefined();
  });

  it('has home page totals that match the content', () => {
    const prompts = MODULES.flatMap((item) => item.prompts);
    const speaking = prompts.filter((prompt) => getTaskType(prompt.taskTypeId)?.skill === 'speaking');
    expect(CONTENT_COUNTS).toEqual({
      modules: MODULES.filter((item) => item.reading?.length && item.listening?.length).length,
      speaking: speaking.length,
      samples: speaking.filter((prompt) => prompt.modelAnswer).length,
      writing: prompts.filter((prompt) => getTaskType(prompt.taskTypeId)?.skill === 'writing').length,
      reading: MODULES.flatMap((item) => item.reading ?? []).flatMap(partQuestions).length,
      listening: MODULES.flatMap((item) => item.listening ?? []).flatMap(partQuestions).length,
    });
  });

  for (const practiceModule of MODULES) {
    describe(practiceModule.title, () => {
      it('has exactly one prompt or part per task type', () => {
        expect(moduleTaskIds(practiceModule).sort()).toEqual(TASK_TYPES.map((task) => task.id).sort());
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

      it('has a sample answer for every speaking prompt, sized to the speaking time', () => {
        for (const prompt of practiceModule.prompts) {
          const task = getTaskType(prompt.taskTypeId);
          if (!task || task.skill !== 'speaking') continue;
          expect(!!prompt.modelAnswer, prompt.id).toBe(true);
          const words = (prompt.modelAnswer ?? '').split(/\s+/).filter(Boolean).length;
          const target = targetSpokenWords(task.timing.answerSeconds);
          expect(words >= target * 0.75 && words <= target * 1.25, `${prompt.id}: ${words} words`).toBe(true);
          expect(checkGrammar(prompt.modelAnswer ?? ''), `${prompt.id} grammar`).toEqual([]);
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
