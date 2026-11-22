import { useSession } from '@/app/session';
import { getCriteria } from '@/domain/criteria';
import { LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';

// Sample numbers for the layout only. Real scores come from the
// measurement code and feedback model in later build steps.
const SAMPLE_SCORES: Record<string, number> = { content: 8, vocabulary: 7, listenability: 7, task: 9 };
const SAMPLE_CHECKLIST = [
  { text: 'Gives at least two pieces of advice', met: true },
  { text: 'Gives a reason for each', met: true },
  { text: 'Uses a friendly, supportive tone', met: false },
];
const SAMPLE_TIPS = [
  'Swap general words like "good" and "nice" for precise ones such as "welcoming" or "practical".',
  'You paused for over 3 seconds twice. Plan your next point during the prep time.',
  'End with a warm line to your friend, like "I know you\'ll settle in quickly."',
];

const MAX_LEVEL = 12;

export function ResultsScreen() {
  const { goal } = useSession();
  const target = goal ?? 9;
  const criteria = getCriteria('speaking');

  return (
    <section className="narrow">
      <div className="screen-head">
        <Emoji symbol="🍬" size="xl" motion="bounce" />
        <h1>Your feedback</h1>
        <p className="sample-note">These are sample results to preview the layout. Real feedback comes in a later step.</p>
      </div>

      <div className="results-card">
        <h2>Estimated level against your goal of CLB {target}</h2>
        <ul className="criteria-bars">
          {criteria.map((criterion) => {
            const score = SAMPLE_SCORES[criterion.id] ?? 0;
            const reached = score >= target;
            return (
              <li key={criterion.id}>
                <div className="criterion-head">
                  <span>{criterion.name}</span>
                  <strong>{score}{reached ? ' 🎉' : ''}</strong>
                </div>
                <div className="bar" aria-label={`${criterion.name}: about ${score} of ${MAX_LEVEL}, goal ${target}`}>
                  <span className={`bar-fill ${reached ? 'is-reached' : ''}`} style={{ width: `${(score / MAX_LEVEL) * 100}%` }} />
                  <span className="bar-goal" style={{ left: `${(target / MAX_LEVEL) * 100}%` }} aria-hidden="true" />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="fine-print">Estimates for practice only, not official CELPIP scores.</p>
      </div>

      <div className="results-card">
        <h2>Did you cover the task?</h2>
        <ul className="checklist">
          {SAMPLE_CHECKLIST.map((item) => (
            <li key={item.text} className={item.met ? 'is-met' : 'is-missed'}>
              <span aria-hidden="true">{item.met ? '✅' : '⭕'}</span>
              <span>{item.text}</span>
              <span className="sr-only">{item.met ? 'covered' : 'not covered'}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="results-card">
        <h2>To reach CLB {target}, try this next</h2>
        <ol className="tips">
          {SAMPLE_TIPS.map((tip) => <li key={tip}>{tip}</li>)}
        </ol>
      </div>

      <div className="row-actions center">
        <LinkButton to="/">Back to skills</LinkButton>
      </div>
    </section>
  );
}
