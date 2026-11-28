import { LinkButton } from './Button';
import { Pip } from './Pip';
import { nextTask, taskPath, useProgress } from '@/services/progress/progress';

export function NotFound() {
  const next = nextTask(useProgress());
  return (
    <section className="empty-state">
      <Pip mood="oops" size={72} />
      <div>
        <h1>We can’t find this page</h1>
        <p>The link may be old or have a typing mistake. Your saved progress is safe.</p>
        <div className="row-actions">
          <LinkButton to={taskPath(next)}>Continue practising</LinkButton>
          <LinkButton to="/" variant="secondary">Go to the home page</LinkButton>
        </div>
      </div>
    </section>
  );
}
