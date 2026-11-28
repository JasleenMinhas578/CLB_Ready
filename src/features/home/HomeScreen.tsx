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
  const nextSkill = getSkill(next.task.skill);

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <h1 id="home-title">Free CELPIP practice that stays on your device</h1>
          <p className="home-lede">
            Speak, write, read and listen under test timers. Then see your estimated CLB level and what to work on next.
          </p>
        </div>

        {/* The one-click start, shown as the task it opens. */}
        <div className={`next-card skill-${next.task.skill}`}>
          <Pip size={84} className="next-pip" />
          <span className="skill-badge"><Icon name={next.task.skill} size="lg" /></span>
          <p className="next-title">{next.task.title}</p>
          <p className="next-where">
            {nextSkill?.name} task {next.task.order}, {getModuleSummary(next.moduleId)?.title}
          </p>
          <LinkButton to={taskPath(next)} className="next-start">
            {isNew ? 'Start practising' : 'Continue practising'} <Icon name="arrow-right" />
          </LinkButton>
          <p className="home-goal">
            {goal ? (
              <>Feedback is aimed at CLB {goal}. <a href={href('/goal')}>Change goal</a></>
            ) : (
              <>No goal yet, so feedback aims at CLB 7. <a href={href('/goal')}>Choose your CLB goal</a></>
            )}
          </p>
        </div>
      </section>

      <aside className="pip-intro" aria-label="Pip, your AI coach">
        <Pip size={128} />
        <h2>Pip, your AI coach</h2>
        <p>
          Pip turns your spoken answers into text, checks your writing and shows a stronger version at your goal level.
          Pip runs inside this browser, so nobody else hears or reads your answers.
        </p>
      </aside>

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
              Your recordings and writing are never uploaded. This browser saves only a list of the tasks you finished. You can
              clear it in Settings.
            </dd>
          </div>
          <div>
            <dt>Best on a laptop</dt>
            <dd>
              Use Chrome or Edge on a laptop or desktop. Your first task downloads the AI models once. After that, they load from
              your browser. Phones use smaller models.
            </dd>
          </div>
        </dl>
      </section>
    </>
  );
}
