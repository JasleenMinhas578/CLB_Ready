import type { RouteParams } from '@/app/router';
import { getTaskType } from '@/domain/tasks/catalog';
import { isSpeakingTask, isWritingTask } from '@/domain/tasks/types';
import { getModule, getPrompt } from '@/content/modules';
import { NotFound } from '@/components/NotFound';
import { SpeakingTask } from './SpeakingTask';
import { WritingTask } from './WritingTask';

/**
 * Opens one task in the test-style frame. Picks the flow for the task's
 * skill; reading and listening add a branch here when they're built.
 */
export function TaskScreen({ params }: { params: RouteParams }) {
  const task = getTaskType(params.taskTypeId);
  const practiceModule = getModule(params.moduleId);
  const prompt = getPrompt(params.moduleId, params.taskTypeId);
  if (!task || !practiceModule || !prompt) return <NotFound />;

  if (isSpeakingTask(task)) return <SpeakingTask key={prompt.id} task={task} prompt={prompt} moduleId={practiceModule.id} />;
  if (isWritingTask(task)) return <WritingTask key={prompt.id} task={task} prompt={prompt} moduleId={practiceModule.id} />;
  return <NotFound />;
}
