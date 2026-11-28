import { SKILLS, getSkill } from '@/domain/skills';
import { getModuleSummary } from '@/content/modules/catalog';
import { useSession } from '@/app/session';
import { href } from '@/app/router';
import { LinkButton } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Pip } from '@/components/Pip';
import { DEFAULT_GOAL } from '@/domain/attempt';
import { nextTask, skillProgress, taskPath, useProgress } from '@/services/progress/progress';
import { SkillCard } from './SkillCard';

export function HomeScreen() {
  const { goal } = useSession();
  const progress = useProgress();
  const next = nextTask(progress);
  const overall = skillProgress(progress);
  const isNew = overall.done === 0;
  const nextSkill = getSkill(next.task.skill);

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <h1 id="home-title">Free CELPIP practice that stays on your device</h1>
          <p className="home-lede">Practise under real test timers. Then Pip, your AI coach, shows your level and what to fix.</p>
          {isNew ? (
            <ol className="home-how" aria-label="How it works">
              <li>Do a timed task <Icon name="arrow-right" size="sm" /></li>
              <li>Pip checks it <Icon name="arrow-right" size="sm" /></li>
              <li>See your level and next step</li>
            </ol>
          ) : (
            <p className="home-done">
              <Icon name="tick" /> You have finished {overall.done} of {overall.total} practice tasks.
            </p>
          )}
        </div>

        {/* The one-click start, shown as the task it opens, with Pip peeking over it. */}
        <div className={`next-card skill-${next.task.skill}`}>
          <Pip size={88} className="next-pip" />
          <div className="next-head">
            <span className="skill-badge"><Icon name={next.task.skill} size="lg" /></span>
            <div>
              <p className="next-title">{next.task.title}</p>
              <p className="next-where">
                {nextSkill?.name} task {next.task.order}, {getModuleSummary(next.moduleId)?.title}
              </p>
            </div>
          </div>
          <div className="next-actions">
            <LinkButton to={taskPath(next)} className="next-start">
              {isNew ? 'Start practising' : 'Continue practising'} <Icon name="arrow-right" />
            </LinkButton>
            {isNew && !goal && <LinkButton to="/goal" variant="secondary">Set your goal</LinkButton>}
          </div>
          <p className="home-goal">
            {goal ? (
              <>Feedback is aimed at CLB {goal}. <a href={href('/goal')}>Change goal</a></>
            ) : isNew ? (
              <>Until you set a goal, feedback aims at CLB {DEFAULT_GOAL}.</>
            ) : (
              <>No goal yet, so feedback aims at CLB {DEFAULT_GOAL}. <a href={href('/goal')}>Choose your CLB goal</a></>
            )}
          </p>
        </div>
      </section>

      {/* A fixed example of the results screen, built from its own styles. The numbers are not anyone's result. */}
      <section className="home-section home-example" aria-labelledby="example-title">
        <div>
          <h2 id="example-title">What you see after each task</h2>
          <p>Your estimated level next to your goal, a score for each part of your answer, and tips for what to change.</p>
        </div>
        <figure className="results-card example-card">
          <figcaption>Example: feedback on a speaking task</figcaption>
          <div className="level-pair">
            <div className="is-level">
              <span>Estimated level</span>
              <strong>CLB 7</strong>
            </div>
            <div>
              <span>Your goal</span>
              <strong>CLB 9</strong>
            </div>
          </div>
          <div className="criterion-head">
            <span>Vocabulary</span>
            <strong>7 (goal 9)</strong>
          </div>
          <div className="bar" aria-label="Vocabulary: about 7 of 12, goal 9">
            <span className="bar-fill" style={{ width: `${(7 / 12) * 100}%` }} />
            <span className="bar-goal" style={{ left: `${(9 / 12) * 100}%` }} aria-hidden="true" />
          </div>
          <p className="example-tip">
            <Icon name="sparkle" /> <span>Organize your answer with linking words such as “first”, “for example” and “as a result”.</span>
          </p>
        </figure>
      </section>

      <section className="home-section" aria-labelledby="skills-title">
        <h2 id="skills-title">Practise one skill</h2>
        <ul className="skill-list">
          {SKILLS.map((skill) => (
            <li key={skill.id}>
              <SkillCard skill={skill} next={nextTask(progress, skill.id)} progress={skillProgress(progress, skill.id)} />
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
            <dt>Best on a laptop</dt>
            <dd>Use Chrome or Edge. Your first task downloads the AI models once. Phones use smaller models.</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
