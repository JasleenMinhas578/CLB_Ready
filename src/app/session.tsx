import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ClbGoal } from '@/domain/goals';
import { hasAnswer, type AnyAttempt } from '@/domain/attempt';
import { markDone } from '@/services/progress/progress';

/**
 * Session state lives in memory only: closing the tab clears it. Only the
 * latest answer is kept, for the results screen. The one thing saved is
 * which tasks were finished (services/progress), never the answers.
 */
interface SessionValue {
  goal: ClbGoal | null;
  setGoal: (goal: ClbGoal) => void;
  /** The learner passed the mic check this session. */
  micReady: boolean;
  setMicReady: (ready: boolean) => void;
  lastAttempt: AnyAttempt | null;
  setLastAttempt: (attempt: AnyAttempt) => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState<ClbGoal | null>(null);
  const [micReady, setMicReady] = useState(false);
  const [lastAttempt, setAttempt] = useState<AnyAttempt | null>(null);
  const value = useMemo(
    () => ({
      goal,
      setGoal,
      micReady,
      setMicReady,
      lastAttempt,
      setLastAttempt: (attempt: AnyAttempt) => {
        if (hasAnswer(attempt)) markDone(attempt.moduleId, attempt.taskTypeId);
        setAttempt(attempt);
      },
    }),
    [goal, micReady, lastAttempt],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
