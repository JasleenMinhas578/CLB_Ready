import { SKILLS, getSkill } from '@/domain/skills';
import { getModuleSummary } from '@/content/modules/catalog';
import { useSession } from '@/app/session';
import { LinkButton } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Pip } from '@/components/Pip';
import { DEFAULT_GOAL } from '@/domain/attempt';
import { nextTask, skillProgress, taskPath, useProgress } from '@/services/progress/progress';
import { SkillCard } from './SkillCard';

/**
 * Two spreads on one two-column grid. The first is the two ways in: start the next task (left,
 * with the facts under it) or pick a skill (right). The second shows what you get after a task.
 */
export function HomeScreen() {
  const { goal } = useSession();
  const progress = useProgress();
  const next = nextTask(progress);
  const overall = skillProgress(progress);
  const isNew = overall.done === 0;
  const nextSkill = getSkill(next.task.skill);

  return (
    <>
      <div className="home-spread home-top">
        <section className="home-start" aria-labelledby="home-title">
          <h1 id="home-title">Free CELPIP practice with a friendly coach</h1>
          <p className="home-lede">Practise under real test timers. Then Pip, your AI coach, shows your level and what to fix.</p>

          {/* The one-click start, shown as the task it opens, with Pip in its top row. */}
          <div className={`next-card skill-${next.task.skill}`}>
            <div className="next-head">
              <span className="skill-badge"><Icon name={next.task.skill} size="lg" /></span>
              <div>
                <p className="next-title">{next.task.title}</p>
                <p className="next-where">
                  {nextSkill?.name} task {next.task.order}, {getModuleSummary(next.moduleId)?.title}
                </p>
              </div>
              <Pip size={64} className="next-pip" />
            </div>
            <LinkButton to={taskPath(next)} className="next-start">
              {isNew ? 'Start practising' : 'Continue practising'} <Icon name="arrow-right" />
            </LinkButton>
            <div className="next-foot">
              {!isNew && (
                <p className="home-done">
                  <Icon name="tick" /> {overall.done} of {overall.total} practice tasks done
                </p>
              )}
              {/* The header's goal button is the one way to set it; this only says what feedback aims at. */}
              <p className="home-goal">
                {goal ? <>Feedback is aimed at CLB {goal}.</> : <>Until you set a goal, feedback aims at CLB {DEFAULT_GOAL}.</>}
              </p>
            </div>
          </div>
        </section>

        <section className="home-skills" aria-labelledby="skills-title">
          <h2 id="skills-title">Pick a skill</h2>
          <ul className="skill-list">
            {SKILLS.map((skill) => (
              <li key={skill.id}>
                <SkillCard skill={skill} next={nextTask(progress, skill.id)} progress={skillProgress(progress, skill.id)} />
              </li>
            ))}
          </ul>
        </section>

        <section className="home-facts" aria-labelledby="facts-title">
          <h2 id="facts-title">Practise more, worry less</h2>
          <ul className="fact-list">
            <li>
              <h3><Icon name="tick" />Free, with nothing to sign up for</h3>
              <p>Start your first task in seconds. No account, no payment, no limit on practice. Teachers and settlement programs can share it with a whole class.</p>
            </li>
            <li>
              <h3><Icon name="lock" />Your own coach, right in your browser</h3>
              <p>Pip runs on your device, so your answers stay private. Use Chrome or Edge on a laptop for the best results. Phones work too, with a smaller AI.</p>
            </li>
          </ul>
        </section>
      </div>

      {/* A fixed example of the results screen, built from its own styles. The numbers are not anyone's result. */}
      <section className="home-spread home-more" aria-labelledby="example-title">
        <div>
          <h2 id="example-title">What you see after each task</h2>
          <p className="home-intro">After Pip checks your answer, you see your estimated level next to your goal, a score for each part, and a tip for what to change.</p>
        </div>
        <figure className="results-card example-card">
          <figcaption>Example feedback on a speaking task. The numbers are made up.</figcaption>
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
          <div className="bar" aria-label="Example vocabulary score: about 7 of 12, goal 9">
            <span className="bar-fill" style={{ width: `${(7 / 12) * 100}%` }} />
            <span className="bar-goal" style={{ left: `${(9 / 12) * 100}%` }} aria-hidden="true" />
          </div>
          <p className="example-tip">
            <Icon name="sparkle" /> <span>Organize your answer with linking words such as “first”, “for example” and “as a result”.</span>
          </p>
        </figure>
      </section>
    </>
  );
}
