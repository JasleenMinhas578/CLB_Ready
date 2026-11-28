import { use } from 'react';
import type { RouteParams } from '@/app/router';
import { getTaskType } from '@/domain/tasks/catalog';
import { isListeningTask, isReadingTask, isSpeakingTask, isWritingTask } from '@/domain/tasks/types';
import { getObjectivePart, getPrompt, loadModule } from '@/content/modules';
import { NotFound } from '@/components/NotFound';
import { SpeakingTask } from './SpeakingTask';
import { WritingTask } from './WritingTask';
import { ReadingTask } from './ReadingTask';
import { ListeningTask } from './ListeningTask';

/**
 * Opens one task in the test-style frame, using the flow for the task's skill.
 * Suspends (showing the app's loading line) while the module's content downloads.
 */
export function TaskScreen({ params }: { params: RouteParams }) {
  const task = getTaskType(params.taskTypeId);
  if (!task) return <NotFound />;
  const practiceModule = use(loadModule(params.moduleId));
  if (!practiceModule) return <NotFound />;

  if (isReadingTask(task) || isListeningTask(task)) {
    const part = getObjectivePart(practiceModule, task.id);
    if (!part) return <NotFound />;
    if (isReadingTask(task) && 'blocks' in part) return <ReadingTask key={part.id} task={task} part={part} moduleId={practiceModule.id} />;
    if (isListeningTask(task) && 'clips' in part) return <ListeningTask key={part.id} task={task} part={part} moduleId={practiceModule.id} />;
    return <NotFound />;
  }

  const prompt = getPrompt(practiceModule, params.taskTypeId);
  if (!prompt) return <NotFound />;

  if (isSpeakingTask(task)) return <SpeakingTask key={prompt.id} task={task} prompt={prompt} moduleId={practiceModule.id} />;
  if (isWritingTask(task)) return <WritingTask key={prompt.id} task={task} prompt={prompt} moduleId={practiceModule.id} />;
  return <NotFound />;
}
