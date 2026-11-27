import { useRef, type MouseEvent, type ReactNode } from 'react';
import { href, navigate } from '@/app/router';

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
            Leave
          </button>
        </div>
      </dialog>
    </>
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
