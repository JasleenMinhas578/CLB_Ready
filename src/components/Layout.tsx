import type { ReactNode } from 'react';
import { href } from '@/app/router';
import { useSession } from '@/app/session';
import { Footer } from './Footer';
import { Icon } from './Icon';
import { Pip } from './Pip';

function Header() {
  const { goal } = useSession();
  return (
    <header className="site-header">
      <a className="brand" href={href('/')}>
        <Pip size={36} />
        <span>CLB Ready</span>
      </a>
      <nav aria-label="Main" className="header-nav">
        <a className="nav-link" href={href('/settings')}>
          <Icon name="settings" />
          <span className="nav-label">Settings</span>
        </a>
        <a className={`goal-chip${goal ? ' is-set' : ''}`} href={href('/goal')}>
          {goal ? `Goal: CLB ${goal}` : 'Set your goal'}
        </a>
      </nav>
    </header>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      {/* Plain #main would clash with the hash router, so focus it directly. */}
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
