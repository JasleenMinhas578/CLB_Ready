import type { PracticeModule } from '../../src/content/types';
import { module1 } from '../../src/content/modules/module1';
import { module2 } from '../../src/content/modules/module2';
import { module3 } from '../../src/content/modules/module3';
import { module4 } from '../../src/content/modules/module4';
import { module5 } from '../../src/content/modules/module5';

/** Every module's full content, loaded up front so tests can loop over it. */
export const MODULES: readonly PracticeModule[] = [module1, module2, module3, module4, module5];


/** Task type ids this module has content for. */
export function moduleTaskIds(practiceModule: PracticeModule): string[] {
  return [
    ...practiceModule.prompts.map((prompt) => prompt.taskTypeId),
    ...(practiceModule.reading ?? []).map((part) => part.taskTypeId),
    ...(practiceModule.listening ?? []).map((part) => part.taskTypeId),
  ];
}
