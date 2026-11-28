import { LinkButton } from './Button';
import { Pip } from './Pip';

export function NotFound() {
  return (
    <section className="empty-state">
      <Pip mood="oops" />
      <h1>This page doesn’t exist</h1>
      <p>The link may be old or mistyped. Go to the home page to pick a skill.</p>
      <LinkButton to="/">Go home</LinkButton>
    </section>
  );
}
