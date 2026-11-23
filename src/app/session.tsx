import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ClbGoal } from '@/domain/goals';

/**
 * Session state lives in memory only. Per the privacy spec, nothing about
 * the learner is saved: closing the tab clears it.
 */
interface SessionValue {
  goal: ClbGoal | null;
  setGoal: (goal: ClbGoal) => void;
  /** The learner passed the mic check this session. */
  micReady: boolean;
  setMicReady: (ready: boolean) => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState<ClbGoal | null>(null);
  const [micReady, setMicReady] = useState(false);
  const value = useMemo(() => ({ goal, setGoal, micReady, setMicReady }), [goal, micReady]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
