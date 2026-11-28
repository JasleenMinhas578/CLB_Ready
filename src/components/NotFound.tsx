import { LinkButton } from './Button';
import { Emoji } from './Emoji';

export function NotFound() {
  return (
    <section className="empty-state">
      <Emoji symbol="🍬" size="xl" />
      <h1>This page doesn’t exist</h1>
      <p>The link may be old or mistyped. Go to the home page to pick a skill.</p>
      <LinkButton to="/">Go home</LinkButton>
    </section>
  );
}
