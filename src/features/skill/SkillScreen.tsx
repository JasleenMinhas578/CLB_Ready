import type { RouteParams } from '@/app/router';
import { href } from '@/app/router';
import { useSession } from '@/app/session';
import { getSkill } from '@/domain/skills';
import { DEFAULT_GOAL } from '@/domain/attempt';
import { formatSeconds } from '@/domain/timer';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { isListeningTask, isReadingTask, isSpeakingTask, type TaskType } from '@/domain/tasks/types';
import { MODULE_CATALOG, getModuleSummary } from '@/content/modules/catalog';
import { LinkButton } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { NotFound } from '@/components/NotFound';
import { countDone, nextTask, taskKey, useProgress } from '@/services/progress/progress';

function timingText(task: TaskType): string {
  if (isSpeakingTask(task)) {
    const { selectSeconds, prepSeconds, answerSeconds } = task.timing;
    const prep = selectSeconds ? `${selectSeconds}s to choose, ${prepSeconds}s to prepare` : `${prepSeconds}s to prepare`;
    return `${prep}, ${formatSeconds(answerSeconds)} to speak`;
  }
  if (isReadingTask(task)) return `${task.questionCount} questions, about ${task.timing.minutes} minutes`;
  if (isListeningTask(task)) {
    const clips = task.clipCount > 1 ? `${task.clipCount} recordings` : '1 recording';
    return `${clips}, about ${task.audioMinutes} min of audio, ${task.questionCount} questions`;
  }
  return `${task.timing.minutes} minutes, ${task.wordRange.min}–${task.wordRange.max} words`;
}

export function SkillScreen({ params }: { params: RouteParams }) {
  const { goal } = useSession();
  const progress = useProgress();
  const skill = getSkill(params.skillId);
  const practiceModule = getModuleSummary(params.moduleId);
  if (!skill || !practiceModule) return <NotFound />;

  // Every module has every task, so the counts beside module names use the same ids.
  const tasks = getTaskTypesForSkill(skill.id);
  const taskIds = tasks.map((task) => task.id);
  const doneAt = (taskId: string) => progress[taskKey(practiceModule.id, taskId)];
  const next = tasks.find((task) => !doneAt(task.id));
  const laterModule = next ? null : nextTask(progress, skill.id);

  return (
    <section>
      <div className={`screen-head skill-head skill-${skill.id}`}>
        <span className="skill-badge"><Icon name={skill.id} size="lg" /></span>
        <div>
          <h1>{skill.name} practice</h1>
          <p>{skill.blurb}</p>
        </div>
      </div>

      {!goal && (
        <p className="nudge">
          <Icon name="goal" /> <span>No goal yet, so feedback aims at CLB {DEFAULT_GOAL}. <a href={href('/goal')}>Choose your CLB goal</a></span>
        </p>
      )}

      <nav className="module-tabs" aria-label="Practice modules">
        {MODULE_CATALOG.map((item) => (
          <a
            key={item.id}
            href={href(`/practice/${skill.id}/${item.id}`)}
            className={`module-tab ${item.id === practiceModule.id ? 'is-current' : ''}`}
            aria-current={item.id === practiceModule.id ? 'page' : undefined}
          >
            {item.title}
            <ModuleCount done={countDone(progress, item.id, taskIds)} total={taskIds.length} />
          </a>
        ))}
      </nav>

      {laterModule && (
        <div className="module-done">
          <Icon name="check" />
          <p>You finished every {skill.name.toLowerCase()} task in {practiceModule.title}.</p>
          {laterModule.moduleId !== practiceModule.id && (
            <LinkButton to={`/practice/${skill.id}/${laterModule.moduleId}`}>
              Go to {getModuleSummary(laterModule.moduleId)?.title} <Icon name="arrow-right" />
            </LinkButton>
          )}
        </div>
      )}

      <ol className="task-list">
        {tasks.map((task) => {
          const finished = doneAt(task.id);
          const isNext = task === next;
          return (
            <li key={task.id}>
              <a className={`task-row ${finished ? 'is-done' : ''} ${isNext ? 'is-next' : ''}`} href={href(`/task/${practiceModule.id}/${task.id}`)}>
                <span className="task-number" aria-hidden="true">{task.order}</span>
                <span className="task-text">
                  <strong>{task.title}</strong>
                  <span>{task.summary}</span>
                  <span className="task-timing">
                    {timingText(task)}
                    {task.needsImage && <span className="tag">Picture</span>}
                  </span>
                </span>
                {finished ? (
                  <span className="task-done" title={`Finished ${new Date(finished).toLocaleDateString()}`}>
                    <Icon name="tick" size="sm" /> Done
                  </span>
                ) : isNext ? (
                  <span className="task-start">Start next <Icon name="arrow-right" size="sm" /></span>
                ) : (
                  <span className="task-go"><Icon name="arrow-right" /></span>
                )}
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** "3/8" beside a module name, or a tick when every task is done. */
function ModuleCount({ done, total }: { done: number; total: number }) {
  if (!done || !total) return null;
  return (
    <small className={`module-count ${done === total ? 'is-complete' : ''}`} aria-label={`${done} of ${total} done`}>
      {done === total ? <Icon name="tick" size="sm" /> : `${done}/${total}`}
    </small>
  );
}
