import { Component, type ReactNode } from 'react';
import { Button, LinkButton } from './Button';
import { Pip } from './Pip';

interface Props {
  children: ReactNode;
}

/**
 * Catches a screen that fails to render, such as a lazy chunk or module content that
 * didn't download, so the rest of the page stays usable. Keyed by route, so moving
 * to another page clears it.
 */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="empty-state" role="alert">
        <Pip mood="oops" size={72} />
        <div>
          <h1>This page did not load</h1>
          <p>
            Part of the page did not download. This often happens when the internet connection drops. Reload the page to try
            again. Your saved progress is safe.
          </p>
          <div className="row-actions">
            <Button onClick={() => window.location.reload()}>Reload the page</Button>
            <LinkButton to="/" variant="secondary">Go to the home page</LinkButton>
          </div>
        </div>
      </section>
    );
  }
}
