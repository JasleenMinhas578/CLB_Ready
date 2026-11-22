import type { ReactNode } from 'react';
import { href } from '@/app/router';
import { useSession } from '@/app/session';

function Header() {
  const { goal } = useSession();
  return (
    <header className="site-header">
      <a className="brand" href={href('/')}>
        <img src="./favicon.svg" alt="" width={34} height={34} />
        <span>CLB Ready</span>
      </a>
      <nav aria-label="Main">
        <a className="goal-chip" href={href('/goal')}>
          {goal ? `Goal: CLB ${goal}` : 'Set your goal'}
        </a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p className="privacy-line">
        <span aria-hidden="true">🔒</span> Your answers never leave this device. We only count anonymous visits.
      </p>
      <p className="disclaimer">
        CLB Ready is an independent, AI-powered practice tool. It is not affiliated with, endorsed by or
        connected to CELPIP, Prometric, the Centre for Canadian Language Benchmarks or the Government of
        Canada. CELPIP is a trademark of its owner. Scores are estimates for practice only.
      </p>
      <p className="footer-links">
        <a href={href('/lab')}>Model lab</a>
        <span>Open source under MIT</span>
      </p>
    </footer>
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
