import { LinkButton } from './Button';
import { Emoji } from './Emoji';

export function NotFound() {
  return (
    <section className="empty-state">
      <Emoji symbol="🍬" size="xl" motion="wiggle" />
      <h1>This page doesn't exist</h1>
      <p>The link may be old. Head back home to pick a skill.</p>
      <LinkButton to="/">Go home</LinkButton>
    </section>
  );
}
