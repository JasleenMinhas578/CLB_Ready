import { SKILLS } from '@/domain/skills';
import { MODULES } from '@/content/modules';
import { useSession } from '@/app/session';
import { LinkButton } from '@/components/Button';
import { Mascot } from '@/components/Mascot';
import { SkillCard } from './SkillCard';

const firstModuleId = MODULES.find((module) => module.status === 'available')?.id ?? 'module-1';

const PROMISES = [
  { emoji: '🔒', title: 'Private', text: 'Your voice and writing stay on your device. Nothing is uploaded.' },
  { emoji: '🍭', title: 'Free', text: 'No account, no subscription. The AI runs in your browser.' },
  { emoji: '🎯', title: 'Goal-based', text: 'Feedback shows what to change to reach your CLB target.' },
];

export function HomeScreen() {
  const { goal } = useSession();

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>Get CELPIP-ready, one sweet answer at a time.</h1>
          <p className="hero-lede">
            Practise speaking and writing with an AI coach that runs on your own device.
            Free, timed like the real test, and private by design.
          </p>
          <div className="hero-actions">
            {goal ? (
              <LinkButton to={`/practice/speaking/${firstModuleId}`}>Start speaking practice</LinkButton>
            ) : (
              <LinkButton to="/goal">Choose your CLB goal</LinkButton>
            )}
            <LinkButton to={`/practice/writing/${firstModuleId}`} variant="secondary">Try writing</LinkButton>
          </div>
        </div>
        <div className="hero-art">
          <Mascot size={190} spin />
          <p className="speech-bubble">Hi, I'm Pip! Let's practise.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="skills-heading">
        <h2 id="skills-heading">Pick a skill</h2>
        <div className="skill-grid">
          {SKILLS.map((skill) => (
            <SkillCard key={skill.id} skill={skill} moduleId={firstModuleId} />
          ))}
        </div>
      </section>

      <section className="section promises" aria-label="Why CLB Ready">
        {PROMISES.map((item) => (
          <div className="promise" key={item.title}>
            <span className="promise-emoji" aria-hidden="true">{item.emoji}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
