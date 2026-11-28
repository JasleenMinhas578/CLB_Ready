import type { RouteParams } from '@/app/router';
import { href } from '@/app/router';
import { useSession } from '@/app/session';
import { getSkill } from '@/domain/skills';
import { formatSeconds } from '@/domain/timer';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { isListeningTask, isReadingTask, isSpeakingTask, type TaskType } from '@/domain/tasks/types';
import { MODULE_CATALOG, getModuleSummary, moduleHasSkill, skillTaskIds } from '@/content/modules/catalog';
import { LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { NotFound } from '@/components/NotFound';
import { countDone, taskKey, useProgress } from '@/services/progress/progress';

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

  if (skill.status !== 'available') {
    return (
      <section className="empty-state">
        <Emoji symbol={skill.emoji} size="xl" motion="float" />
        <h1>{skill.name} practice is coming soon</h1>
        <p>This skill isn’t ready yet. Please check again soon.</p>
        <LinkButton to="/">Back to skills</LinkButton>
      </section>
    );
  }

  const available = new Set(skillTaskIds(practiceModule, skill.id));
  const tasks = getTaskTypesForSkill(skill.id).filter((task) => available.has(task.id));

  return (
    <section>
      <div className="screen-head align-left">
        <h1><Emoji symbol={skill.emoji} size="lg" /> {skill.name} practice</h1>
        <p>{skill.blurb}</p>
      </div>

      {!goal && (
        <p className="nudge">
          <Emoji symbol="🎯" /> <a href={href('/goal')}>Set your CLB goal</a> so feedback aims at the right level.
        </p>
      )}

      <nav className="module-tabs" aria-label="Practice modules">
        {MODULE_CATALOG.map((item) =>
          moduleHasSkill(item, skill.id) ? (
            <a
              key={item.id}
              href={href(`/practice/${skill.id}/${item.id}`)}
              className={`module-tab ${item.id === practiceModule.id ? 'is-current' : ''}`}
              aria-current={item.id === practiceModule.id ? 'page' : undefined}
            >
              {item.title}
              <ModuleCount done={countDone(progress, item.id, skillTaskIds(item, skill.id))} total={skillTaskIds(item, skill.id).length} />
            </a>
          ) : (
            <span key={item.id} className="module-tab is-soon" aria-disabled="true">
              {item.title} <small>soon</small>
            </span>
          ),
        )}
      </nav>

      <ol className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <a className={`task-row ${progress[taskKey(practiceModule.id, task.id)] ? 'is-done' : ''}`} href={href(`/task/${practiceModule.id}/${task.id}`)}>
              <span className="task-number" aria-hidden="true">{task.order}</span>
              <span className="task-text">
                <strong>{task.title}</strong>
                <span>{task.summary}</span>
                <span className="task-timing">
                  {timingText(task)}
                  {task.needsImage && <span className="tag">Picture</span>}
                </span>
              </span>
              {progress[taskKey(practiceModule.id, task.id)] ? (
                <span className="task-done" title={`Finished ${new Date(progress[taskKey(practiceModule.id, task.id)]).toLocaleDateString()}`}>
                  <span aria-hidden="true">✓</span> Done
                </span>
              ) : (
                <span className="task-go" aria-hidden="true">▸</span>
              )}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** "3/8" beside a module name, or a tick when every task is done. */
function ModuleCount({ done, total }: { done: number; total: number }) {
  if (!done || !total) return null;
  return (
    <small className={`module-count ${done === total ? 'is-complete' : ''}`} aria-label={`${done} of ${total} done`}>
      {done === total ? '✓' : `${done}/${total}`}
    </small>
  );
}
