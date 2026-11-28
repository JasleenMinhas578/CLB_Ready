import { useSession } from '@/app/session';
import { LinkButton } from '@/components/Button';
import { Pip } from '@/components/Pip';
import { SpeakingResults } from './SpeakingResults';
import { WritingResults } from './WritingResults';
import { ObjectiveResults } from './ObjectiveResults';

/** Shows the latest answer's feedback, using the view for its skill. */
export function ResultsScreen() {
  const { lastAttempt: attempt } = useSession();

  if (!attempt) {
    return (
      <section className="empty-state">
        <Pip size={72} />
        <div>
          <h1>No answer to review yet</h1>
          <p>Finish a task or part and your feedback will appear here. Results are kept only until you close this tab.</p>
          <LinkButton to="/">Choose a task</LinkButton>
        </div>
      </section>
    );
  }

  if (attempt.skill === 'speaking') return <SpeakingResults attempt={attempt} />;
  if (attempt.skill === 'writing') return <WritingResults attempt={attempt} />;
  return <ObjectiveResults attempt={attempt} />;
}
