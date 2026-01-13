import { create } from 'zustand';
import { Session, Tactic } from '@/types/session';

interface SessionState {
  sessions: Session[];
  currentSessionId: string | null;
  currentTacticId: string | null;

  // Actions
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  removeSession: (id: string) => void;
  setCurrentSession: (id: string | null) => void;
  setCurrentTactic: (id: string | null) => void;
  addTactic: (sessionId: string, tactic: Tactic) => void;
  updateTactic: (sessionId: string, tacticId: string, updates: Partial<Tactic>) => void;
  removeTactic: (sessionId: string, tacticId: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  currentSessionId: null,
  currentTacticId: null,

  setSessions: (sessions) => set({ sessions }),
  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),
  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  removeSession: (id) =>
    set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),
  setCurrentSession: (id) => set({ currentSessionId: id }),
  setCurrentTactic: (id) => set({ currentTacticId: id }),
  addTactic: (sessionId, tactic) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, tactics: [...session.tactics, tactic] }
          : session
      ),
    })),
  updateTactic: (sessionId, tacticId, updates) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              tactics: session.tactics.map((t) =>
                t.id === tacticId ? { ...t, ...updates } : t
              ),
            }
          : session
      ),
    })),
  removeTactic: (sessionId, tacticId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, tactics: session.tactics.filter((t) => t.id !== tacticId) }
          : session
      ),
    })),
}));
