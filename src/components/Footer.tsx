import { href } from '@/app/router';

const PRACTICE_LINKS = [
  { label: 'Speaking practice', to: '/practice/speaking/module-1' },
  { label: 'Writing practice', to: '/practice/writing/module-1' },
  { label: 'Reading practice', to: '/practice/reading/module-1' },
  { label: 'Listening practice', to: '/practice/listening/module-1' },
  { label: 'Set your CLB goal', to: '/goal' },
];

const ABOUT_LINKS = [
  { label: 'AI models and privacy', to: '/settings' },
  { label: 'Model lab', to: '/lab' },
];

/** Site footer: brand, privacy promise, links, and the independence disclaimer. */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="footer-logo" href={href('/')}>
            <img src="./favicon.svg" alt="" width={36} height={36} />
            <span>CLB Ready</span>
          </a>
          <p className="footer-tagline">Free, private AI coaching for CELPIP-style practice in all four skills.</p>
          <p className="footer-privacy">
            <span aria-hidden="true">🔒</span> Your answers never leave this device.
          </p>
        </div>

        <nav className="footer-col" aria-label="Practise">
          <h2>Practise</h2>
          <ul>
            {PRACTICE_LINKS.map((link) => (
              <li key={link.to}><a href={href(link.to)}>{link.label}</a></li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="About">
          <h2>About</h2>
          <ul>
            {ABOUT_LINKS.map((link) => (
              <li key={link.to}><a href={href(link.to)}>{link.label}</a></li>
            ))}
            <li><span>Open source under MIT</span></li>
          </ul>
        </nav>
      </div>

      <div className="footer-legal">
        <p>
          CLB Ready is an independent, AI-powered practice tool. It is not affiliated with, endorsed by or connected to
          CELPIP, Prometric, the Centre for Canadian Language Benchmarks or the Government of Canada. CELPIP is a
          trademark of its owner. Scores are estimates for practice only.
        </p>
        <p className="footer-copy">© {new Date().getFullYear()} CLB Ready</p>
      </div>
    </footer>
  );
}
