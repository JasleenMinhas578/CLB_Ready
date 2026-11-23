import { useSession } from '@/app/session';
import { LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { SpeakingResults } from './SpeakingResults';
import { WritingResults } from './WritingResults';

/** Shows the latest answer's feedback, using the view for its skill. */
export function ResultsScreen() {
  const { lastAttempt: attempt } = useSession();

  if (!attempt) {
    return (
      <section className="empty-state">
        <Emoji symbol="🍬" size="xl" motion="float" />
        <h1>No answer to review yet</h1>
        <p>Answer a speaking or writing task and your feedback will appear here. Results are kept only until you close this tab.</p>
        <LinkButton to="/">Choose a task</LinkButton>
      </section>
    );
  }

  return attempt.skill === 'speaking' ? <SpeakingResults attempt={attempt} /> : <WritingResults attempt={attempt} />;
}
