import type { ReactNode } from 'react';
import { href } from '@/app/router';

interface ExamBarProps {
  /** e.g. "Writing Task 1 of 2" */
  position: string;
  title: string;
  /** Where "Exit" goes. */
  exitTo: string;
  /** Timer, word count or other status, shown on the right. */
  status?: ReactNode;
  /** Usually the Next button. */
  action?: ReactNode;
}

/** The fixed bar at the top of every test-style task screen. */
export function ExamBar({ position, title, exitTo, status, action }: ExamBarProps) {
  return (
    <header className="exam-bar">
      <div className="exam-bar-title">
        <a className="exam-exit" href={href(exitTo)} aria-label="Exit this task">
          Exit
        </a>
        <div>
          <span className="exam-position">{position}</span>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="exam-bar-right">
        {status}
        {action}
      </div>
    </header>
  );
}

/** Time remaining, shown in the exam bar. Turns to a warning in the last minute or five. */
export function TimeRemaining({ seconds, warnBelow = 60, label = 'Time remaining' }: { seconds: number; warnBelow?: number; label?: string }) {
  const safe = Math.max(0, Math.ceil(seconds));
  const text = `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
  return (
    <div className={`exam-time ${safe <= warnBelow ? 'is-low' : ''}`} role="timer" aria-label={`${label}: ${text}`}>
      <span>{label}</span>
      <strong>{text}</strong>
    </div>
  );
}
