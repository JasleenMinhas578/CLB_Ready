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
          <h1>This page didn’t load</h1>
          <p>
            Part of the page didn’t download, often because the internet connection dropped. Reloading usually fixes it. Your
            saved progress is not affected.
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
