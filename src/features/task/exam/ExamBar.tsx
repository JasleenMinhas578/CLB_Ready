import { useRef, type MouseEvent, type ReactNode } from 'react';
import { href, navigate } from '@/app/router';
import { formatSeconds, passedWarning, warningText } from '@/domain/timer';

interface ExamBarProps {
  /** e.g. "Writing task 1 of 2" */
  position: string;
  title: string;
  /** Where "Exit" goes. */
  exitTo: string;
  /** Timer, word count or other status, shown on the right. */
  status?: ReactNode;
  /** Usually the Next button. */
  action?: ReactNode;
  /** Set while leaving would lose an answer: Exit asks first, with this message. */
  exitWarning?: string;
}

/** The fixed bar at the top of every test-style task screen. */
export function ExamBar({ position, title, exitTo, status, action, exitWarning }: ExamBarProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  // A hash link leaves without any browser warning, so ask in the page instead.
  const onExit = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!exitWarning) return;
    event.preventDefault();
    dialog.current?.showModal();
  };

  return (
    <>
      <header className="exam-bar">
        <div className="exam-bar-title">
          <a className="exam-exit" href={href(exitTo)} aria-label="Exit this task" onClick={onExit}>
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
      {/* A modal <dialog> keeps focus inside it, makes the page behind inert, and closes on Esc. */}
      <dialog ref={dialog} className="exam-dialog" aria-labelledby="exam-dialog-title" aria-describedby="exam-dialog-text">
        <h2 id="exam-dialog-title">Leave this task?</h2>
        <p id="exam-dialog-text">{exitWarning}</p>
        <div className="exam-dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={() => dialog.current?.close()}>
            Stay
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              dialog.current?.close();
              navigate(exitTo);
            }}
          >
            Leave task
          </button>
        </div>
      </dialog>
    </>
  );
}

/** Time remaining, shown in the exam bar. In the warning window it gains an icon as well as a colour. */
export function TimeRemaining({
  seconds,
  totalSeconds,
  warnBelow = 60,
  label = 'Time remaining',
}: {
  seconds: number;
  totalSeconds: number;
  warnBelow?: number;
  label?: string;
}) {
  const text = formatSeconds(seconds);
  const low = Math.ceil(seconds) <= warnBelow;
  return (
    <>
      <div className={`exam-time ${low ? 'is-low' : ''}`} role="timer" aria-label={`${label}: ${text}`}>
        <span>{label}</span>
        <strong>
          {low && <WarnIcon />}
          {text}
        </strong>
      </div>
      <TimeWarning secondsLeft={seconds} totalSeconds={totalSeconds} />
    </>
  );
}

/**
 * Says "5 minutes left", "1 minute left" and "10 seconds left" once each.
 * It stays mounted with empty text so screen readers notice each change.
 * `muted` keeps it quiet while the mic records, so the warning is not in the answer.
 */
export function TimeWarning({ secondsLeft, totalSeconds, muted = false }: { secondsLeft: number; totalSeconds: number; muted?: boolean }) {
  const mark = muted ? null : passedWarning(secondsLeft, totalSeconds);
  return (
    <span className="sr-only" aria-live="polite">
      {mark === null ? '' : warningText(mark)}
    </span>
  );
}

/** A small "!" in a circle, so a low timer is not shown by colour alone. */
export function WarnIcon() {
  return (
    <svg className="warn-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 7v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}
