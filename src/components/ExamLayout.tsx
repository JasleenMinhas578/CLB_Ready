import type { ReactNode } from 'react';

/**
 * Test-day frame for task screens: no site header, candy decoration or
 * footer links, so the learner focuses on the task like the real test.
 * Each task draws its own exam bar (title, timer, Next).
 */
export function ExamLayout({ children }: { children: ReactNode }) {
  return (
    <div className="exam-page">
      <main id="main" tabIndex={-1} className="exam-main">
        {children}
      </main>
      <p className="exam-footnote">
        CLB Ready practice test. Independent tool, not affiliated with CELPIP. Your answers stay on this device.
      </p>
    </div>
  );
}
