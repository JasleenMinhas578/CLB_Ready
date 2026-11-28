import { href } from '@/app/router';
import { Icon } from './Icon';
import { Disclaimer } from './Disclaimer';
import { Pip } from './Pip';

const PRACTICE_LINKS = [
  { label: 'Speaking practice', to: '/practice/speaking/module-1' },
  { label: 'Writing practice', to: '/practice/writing/module-1' },
  { label: 'Reading practice', to: '/practice/reading/module-1' },
  { label: 'Listening practice', to: '/practice/listening/module-1' },
];

// Settings and the goal are already in the header, so the footer doesn't repeat them.
const REPO_URL = 'https://github.com/JasleenMinhas578/CLB_Ready';

/** Site footer: brand and privacy promise on the left, link groups on the right, the disclaimer and © along the bottom. */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="footer-logo" href={href('/')}>
            <Pip size={36} />
            <span>CLB Ready</span>
          </a>
          <p className="footer-tagline">Free CELPIP-style practice in speaking, writing, reading and listening, with Pip, your AI coach.</p>
          <p className="footer-privacy">
            <Icon name="lock" size="sm" /> Your answers never leave this device.
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
            <li><a href={href('/lab')}>Model lab</a></li>
            <li><a href={REPO_URL}>Open source under MIT</a></li>
          </ul>
        </nav>
      </div>

      <div className="footer-legal">
        <Disclaimer />
        <p className="footer-copy">© {new Date().getFullYear()} CLB Ready</p>
      </div>
    </footer>
  );
}
