import type { PracticeModule } from '../../src/content/types';
import type { SkillId } from '../../src/domain/skills';
import { getTaskType } from '../../src/domain/tasks/catalog';
import { module1 } from '../../src/content/modules/module1';
import { module2 } from '../../src/content/modules/module2';
import { module3 } from '../../src/content/modules/module3';
import { module4 } from '../../src/content/modules/module4';
import { module5 } from '../../src/content/modules/module5';

/** Every module's full content, loaded up front so tests can loop over it. */
export const MODULES: readonly PracticeModule[] = [module1, module2, module3, module4, module5];

/** True when the module's content has prompts for this skill. */
export function moduleHasSkill(practiceModule: PracticeModule, skill: SkillId): boolean {
  if (skill === 'reading') return !!practiceModule.reading?.length;
  if (skill === 'listening') return !!practiceModule.listening?.length;
  return practiceModule.prompts.some((prompt) => getTaskType(prompt.taskTypeId)?.skill === skill);
}
