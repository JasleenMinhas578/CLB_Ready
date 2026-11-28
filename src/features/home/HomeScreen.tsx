import { SKILLS } from '@/domain/skills';
import { CONTENT_COUNTS as counts, MODULE_CATALOG } from '@/content/modules/catalog';
import { useSession } from '@/app/session';
import { LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { SkillCard } from './SkillCard';
import { FeedbackDemo } from './FeedbackDemo';

const firstModuleId = MODULE_CATALOG[0].id;

const INSIDE = [
  { emoji: '🎤', title: 'Speaking with a coach', text: `${counts.speaking} timed tasks. Your answer is turned into text, you see your pace, pauses and filler words, and you get a better version at your goal level.` },
  { emoji: '🔊', title: 'Sample answers you can hear', text: `${counts.samples} CLB 10+ answers, each with notes on why it works and a button to hear it read aloud.` },
  { emoji: '✏️', title: 'Writing, marked like a teacher would', text: `${counts.writing} email and survey tasks in a test-style editor with a live word count, grammar marks and an improved version.` },
  { emoji: '📖', title: 'Reading with every answer explained', text: `${counts.reading} questions about messages, charts and articles. Each answer shows the line in the text that proves it.` },
  { emoji: '🎧', title: 'Listening that plays once', text: `${counts.listening} questions with AI voices. Each recording plays once, like test day. Then you can read every word that was said.` },
  { emoji: '🎯', title: 'Aimed at your CLB goal', text: 'Pick CLB 7 to 12. Every score, tip and example answer is aimed at the level you need.' },
];

const STEPS = [
  { title: 'Pick your goal', text: 'Choose the CLB level you need, from 7 to 12.' },
  { title: 'Practise like test day', text: 'Real timers, a test-style screen and one listen per recording.' },
  { title: 'See exactly what to fix', text: 'Corrections, a level estimate and a stronger version of your own answer.' },
];

const FAQ = [
  {
    q: 'Is it really free?',
    a: 'Yes. There’s no account, trial or card. The AI runs on your own device, so there are no server costs to charge you for.',
  },
  {
    q: 'Does anyone hear my recordings or read my writing?',
    a: 'No. Speech-to-text and feedback run inside your browser, and your answers are never uploaded. Your answers disappear when you close the tab. Until then, an unfinished writing draft stays in the tab, so reloading the page doesn’t lose it. Only the ticks for finished tasks are saved, on your device.',
  },
  {
    q: 'Which device works best?',
    a: 'A laptop or desktop with Chrome or Edge. The first visit downloads the AI models once (they’re saved in your browser after that). Phones work too, with a smaller AI.',
  },
  {
    q: 'Are the scores official?',
    a: 'No. They’re practice estimates to show your progress. CLB Ready is an independent study tool and isn’t connected to CELPIP or Paragon Testing.',
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function HomeScreen() {
  const { goal } = useSession();
  const start = goal ? `/practice/speaking/${firstModuleId}` : '/goal';

  return (
    <>
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="price-sticker">
            <strong>$0</strong> No account. No card. No fees.
          </p>
          <h1>Free CELPIP practice with an AI coach that runs in your browser.</h1>
          <p className="hero-lede">
            Speak, write, read and listen under real test timers, then see exactly what to change to reach your CLB goal. Your
            answers never leave your device.
          </p>
          <div className="hero-actions">
            <LinkButton to={start}>Start practising free</LinkButton>
            <button type="button" className="btn btn-secondary" onClick={() => scrollToSection('inside')}>
              See what’s inside
            </button>
          </div>
          <ul className="hero-facts" aria-label="What you get">
            <li><strong>{counts.modules}</strong> full practice tests</li>
            <li><strong>4</strong> skills</li>
            <li><strong>{counts.reading + counts.listening}</strong> reading and listening questions</li>
          </ul>
        </div>
        <FeedbackDemo />
      </section>

      <section className="section" id="inside" aria-labelledby="inside-heading">
        <h2 id="inside-heading">Everything you need, in one place</h2>
        <p className="section-lede">No switching between apps, videos and answer keys. Practise, get feedback and learn from strong answers right here.</p>
        <div className="inside-grid">
          {INSIDE.map((item) => (
            <article className="inside-card" key={item.title}>
              <Emoji symbol={item.emoji} size="lg" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <ol className="steps">
          {STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="skills-heading">
        <h2 id="skills-heading">Pick a skill to start</h2>
        <div className="skill-grid">
          {SKILLS.map((skill) => (
            <SkillCard key={skill.id} skill={skill} moduleId={firstModuleId} />
          ))}
        </div>
      </section>

      <section className="section private-band" aria-labelledby="private-heading">
        <div>
          <h2 id="private-heading">Free because it runs on your device</h2>
          <p>
            Most AI apps send your voice to a server and charge you for it. CLB Ready downloads free, open-source AI into your
            browser once. Then it does everything on your own device: speech-to-text, feedback and voices.
          </p>
        </div>
        <ul className="private-points">
          <li><Emoji symbol="🔒" /> Your recordings and writing are never uploaded</li>
          <li><Emoji symbol="🍭" /> No account, so nothing to sell or leak</li>
          <li><Emoji symbol="⚡" /> The AI downloads once, then loads from your browser</li>
        </ul>
      </section>

      <section className="section schools" aria-labelledby="schools-heading">
        <h2 id="schools-heading">For colleges, universities and settlement programs</h2>
        <p>
          Share one link with your students. There’s nothing to install, no accounts to manage and no student data to protect,
          because none is collected. It works on campus laptops in Chrome or Edge.
        </p>
      </section>

      <section className="section" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Questions</h2>
        <div className="faq">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section final-cta">
        <h2>Your next CELPIP practice starts now.</h2>
        <LinkButton to={start}>Start practising free</LinkButton>
      </section>
    </>
  );
}
