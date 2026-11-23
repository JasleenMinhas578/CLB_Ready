import type { RouteParams } from '@/app/router';
import { href } from '@/app/router';
import { useSession } from '@/app/session';
import { getSkill } from '@/domain/skills';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { isSpeakingTask, type TaskType } from '@/domain/tasks/types';
import { MODULES, getModule, moduleHasSkill } from '@/content/modules';
import { LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { NotFound } from '@/components/NotFound';
import { formatSeconds } from '@/components/TimerRing';

function timingText(task: TaskType): string {
  if (isSpeakingTask(task)) {
    const { selectSeconds, prepSeconds, answerSeconds } = task.timing;
    const prep = selectSeconds ? `${selectSeconds}s to choose, ${prepSeconds}s to prepare` : `${prepSeconds}s to prepare`;
    return `${prep}, ${formatSeconds(answerSeconds)} to speak`;
  }
  return `${task.timing.minutes} minutes, ${task.wordRange.min}–${task.wordRange.max} words`;
}

export function SkillScreen({ params }: { params: RouteParams }) {
  const { goal } = useSession();
  const skill = getSkill(params.skillId);
  const practiceModule = getModule(params.moduleId);
  if (!skill || !practiceModule) return <NotFound />;

  if (skill.status !== 'available') {
    return (
      <section className="empty-state">
        <Emoji symbol={skill.emoji} size="xl" motion="float" />
        <h1>{skill.name} practice is coming soon</h1>
        <p>We're starting with speaking and writing. Check back for {skill.name.toLowerCase()} tasks.</p>
        <LinkButton to="/">Back to skills</LinkButton>
      </section>
    );
  }

  const tasks = getTaskTypesForSkill(skill.id).filter((task) =>
    practiceModule.prompts.some((prompt) => prompt.taskTypeId === task.id),
  );

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
        {MODULES.map((item) =>
          moduleHasSkill(item, skill.id) ? (
            <a
              key={item.id}
              href={href(`/practice/${skill.id}/${item.id}`)}
              className={`module-tab ${item.id === practiceModule.id ? 'is-current' : ''}`}
              aria-current={item.id === practiceModule.id ? 'page' : undefined}
            >
              {item.title}
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
            <a className="task-row" href={href(`/task/${practiceModule.id}/${task.id}`)}>
              <span className="task-number" aria-hidden="true">{task.order}</span>
              <span className="task-text">
                <strong>{task.title}</strong>
                <span>{task.summary}</span>
                <span className="task-timing">
                  {timingText(task)}
                  {task.needsImage && <span className="tag">Picture</span>}
                </span>
              </span>
              <span className="task-go" aria-hidden="true">▸</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
