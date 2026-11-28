import { SKILLS, getSkill } from '@/domain/skills';
import { getModuleSummary } from '@/content/modules/catalog';
import { useSession } from '@/app/session';
import { href } from '@/app/router';
import { LinkButton } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Pip } from '@/components/Pip';
import { nextTask, taskPath, useProgress } from '@/services/progress/progress';
import { SkillCard } from './SkillCard';

export function HomeScreen() {
  const { goal } = useSession();
  const progress = useProgress();
  const next = nextTask(progress);
  const isNew = Object.keys(progress).length === 0;
  const where = `${getModuleSummary(next.moduleId)?.title} · ${getSkill(next.task.skill)?.name} task ${next.task.order} · ${next.task.title}`;

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <h1 id="home-title">Free CELPIP practice that stays on your device</h1>
          <p className="home-lede">
            Speak, write, read and listen under test timers. Then see your estimated CLB level and what to work on next.
          </p>
          <div className="home-start">
            <LinkButton to={taskPath(next)}>
              {isNew ? 'Start practising' : 'Continue practising'} <Icon name="arrow-right" />
            </LinkButton>
            <p className="home-next">
              Next: {where}
            </p>
          </div>
          <p className="home-goal">
            {goal ? (
              <>Feedback is aimed at CLB {goal}. <a href={href('/goal')}>Change goal</a></>
            ) : (
              <>No goal yet, so feedback aims at CLB 7. <a href={href('/goal')}>Choose your CLB goal</a></>
            )}
          </p>
        </div>

        <aside className="pip-intro" aria-label="Pip, your AI coach">
          <Pip size={112} />
          <div>
            <h2>Pip, your AI coach</h2>
            <p>
              Pip turns your spoken answers into text, checks your writing and shows a stronger version at your goal level.
              Pip runs inside this browser, so nobody else hears or reads your answers.
            </p>
          </div>
        </aside>
      </section>

      <section className="home-section" aria-labelledby="skills-title">
        <h2 id="skills-title">Or pick a skill</h2>
        <ul className="skill-list">
          {SKILLS.map((skill) => (
            <li key={skill.id}>
              <SkillCard skill={skill} next={nextTask(progress, skill.id)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section home-facts" aria-labelledby="facts-title">
        <h2 id="facts-title">Good to know</h2>
        <dl>
          <div>
            <dt>Free, with no account</dt>
            <dd>There is nothing to sign up for or pay. Teachers and settlement programs can share the link with a class.</dd>
          </div>
          <div>
            <dt>Your answers stay here</dt>
            <dd>
              Recordings and writing are never uploaded. Only the list of tasks you finished is saved, in this browser. You can
              clear it in Settings.
            </dd>
          </div>
          <div>
            <dt>Best on a laptop</dt>
            <dd>
              Use Chrome or Edge on a laptop or desktop. The first task downloads the AI models once; after that they load from
              your browser. Phones work with smaller models.
            </dd>
          </div>
        </dl>
      </section>
    </>
  );
}
