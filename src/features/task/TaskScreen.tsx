import type { RouteParams } from '@/app/router';
import { href } from '@/app/router';
import { getTaskType } from '@/domain/tasks/catalog';
import { isSpeakingTask, isWritingTask, type TaskType } from '@/domain/tasks/types';
import { getModule, getPrompt } from '@/content/modules';
import type { PracticePrompt } from '@/content/types';
import { getSkill } from '@/domain/skills';
import { Emoji } from '@/components/Emoji';
import { NotFound } from '@/components/NotFound';
import { SpeakingTask } from './SpeakingTask';
import { WritingTask } from './WritingTask';

function PromptImageArea({ task, prompt }: { task: TaskType; prompt: PracticePrompt }) {
  if (!task.needsImage) return null;
  if (prompt.image) {
    return <img className="prompt-image" src={prompt.image.src} alt={prompt.image.alt} />;
  }
  return (
    <div className="image-placeholder" role="img" aria-label="Picture coming soon">
      <Emoji symbol="🖼️" size="lg" />
      <span>The picture for this task is added in a later step.</span>
    </div>
  );
}

/** Picks the right flow for the task's skill. New skills add a branch here. */
function TaskFlow({ task, prompt, moduleId }: { task: TaskType; prompt: PracticePrompt; moduleId: string }) {
  if (isSpeakingTask(task)) return <SpeakingTask key={task.id} task={task} prompt={prompt} moduleId={moduleId} />;
  if (isWritingTask(task)) return <WritingTask key={task.id} task={task} />;
  return null;
}

export function TaskScreen({ params }: { params: RouteParams }) {
  const task = getTaskType(params.taskTypeId);
  const practiceModule = getModule(params.moduleId);
  const prompt = getPrompt(params.moduleId, params.taskTypeId);
  if (!task || !practiceModule || !prompt) return <NotFound />;
  const skill = getSkill(task.skill);

  return (
    <section className="task-screen">
      <a className="back-link" href={href(`/practice/${task.skill}/${practiceModule.id}`)}>
        ◂ {skill?.name} tasks
      </a>

      <div className="task-layout">
        <article className="prompt-card">
          <p className="prompt-kicker">
            {skill?.name} task {task.order}: {task.title}
          </p>
          <p className="prompt-text">{prompt.text}</p>
          {prompt.options && (
            <ul className="prompt-options">
              {prompt.options.map((option, index) => (
                <li key={option}>
                  <span className="option-letter">{index === 0 ? 'A' : 'B'}</span> {option}
                </li>
              ))}
            </ul>
          )}
          <PromptImageArea task={task} prompt={prompt} />
          {prompt.draft && <p className="fine-print">Draft practice prompt.</p>}
        </article>

        <TaskFlow task={task} prompt={prompt} moduleId={practiceModule.id} />
      </div>
    </section>
  );
}
