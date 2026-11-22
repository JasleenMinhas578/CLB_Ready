import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ClbGoal } from '@/domain/goals';

/**
 * Session state lives in memory only. Per the privacy spec, nothing about
 * the learner is saved: closing the tab clears the goal.
 */
interface SessionValue {
  goal: ClbGoal | null;
  setGoal: (goal: ClbGoal) => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState<ClbGoal | null>(null);
  const value = useMemo(() => ({ goal, setGoal }), [goal]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
