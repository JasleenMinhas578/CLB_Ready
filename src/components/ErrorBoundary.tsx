import { Component, type ReactNode } from 'react';
import { Button } from './Button';

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
      <section className="empty-state">
        <h1>Something went wrong</h1>
        <p>This page didn’t load. Reload the page to try again.</p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </section>
    );
  }
}
