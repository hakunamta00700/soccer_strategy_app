import { useAnimationStore } from '@/store/animationStore';
import { useSessionStore } from '@/store/sessionStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';
import { storageService } from '@/services/storageService';
import { Session, Tactic } from '@/types/session';

type SerializableTactic = Omit<Tactic, 'createdAt'> & { createdAt: string };
type SerializableSession = Omit<Session, 'createdAt' | 'updatedAt' | 'tactics'> & {
  createdAt: string;
  updatedAt: string;
  tactics: SerializableTactic[];
};

export type ExportPayload =
  | { type: 'session'; exportedAt: string; session: SerializableSession }
  | { type: 'tactic'; exportedAt: string; tactic: SerializableTactic }
  | { type: 'backup'; exportedAt: string; sessions: SerializableSession[] };

const ensureDateString = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : value;

const serializeTactic = (tactic: Tactic): SerializableTactic => ({
  ...tactic,
  balls: tactic.balls ?? [],
  createdAt: ensureDateString(tactic.createdAt),
});

const serializeSession = (session: Session): SerializableSession => ({
  ...session,
  createdAt: ensureDateString(session.createdAt),
  updatedAt: ensureDateString(session.updatedAt),
  tactics: session.tactics.map(serializeTactic),
});

const deserializeTactic = (tactic: SerializableTactic): Tactic => ({
  ...tactic,
  balls: tactic.balls ?? [],
  createdAt: new Date(tactic.createdAt),
});

const deserializeSession = (session: SerializableSession): Session => ({
  ...session,
  createdAt: new Date(session.createdAt),
  updatedAt: new Date(session.updatedAt),
  tactics: session.tactics.map(deserializeTactic),
});

const createSessionId = () => `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const createTacticId = () => `tactic-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const applyTacticToBoard = (tactic: Tactic | null) => {
  const board = useTacticalBoardStore.getState();
  const animation = useAnimationStore.getState();
  if (!tactic) {
    board.setPlayers([]);
    board.setBalls([]);
    board.setShapes([]);
    animation.setAnimations([]);
    animation.setIsPlaying(false);
    animation.setCurrentTime(0);
    board.clearSelection();
    return;
  }

  board.setPlayers(tactic.players);
  board.setBalls(tactic.balls ?? []);
  board.setShapes(tactic.shapes);
  animation.setAnimations(tactic.animations);
  animation.setIsPlaying(false);
  animation.setCurrentTime(0);
  board.clearSelection();
};

const buildTacticSnapshot = (fallback?: Tactic): Tactic => {
  const board = useTacticalBoardStore.getState();
  const animation = useAnimationStore.getState();
  return {
    id: fallback?.id ?? createTacticId(),
    name: fallback?.name ?? '기본 전술',
    players: board.players,
    balls: board.balls,
    shapes: board.shapes,
    animations: animation.animations,
    createdAt: fallback?.createdAt ?? new Date(),
  };
};

const buildSessionSnapshot = (): Session | null => {
  const sessionState = useSessionStore.getState();
  if (!sessionState.currentSessionId) {
    return null;
  }

  const session =
    sessionState.sessions.find((item) => item.id === sessionState.currentSessionId) ?? null;
  if (!session) {
    return null;
  }

  const existing =
    session.tactics.find((tactic) => tactic.id === sessionState.currentTacticId) ??
    session.tactics[0];
  const updatedTactic = buildTacticSnapshot(existing);
  const tactics = session.tactics.some((tactic) => tactic.id === updatedTactic.id)
    ? session.tactics.map((tactic) => (tactic.id === updatedTactic.id ? updatedTactic : tactic))
    : [...session.tactics, updatedTactic];

  return {
    ...session,
    updatedAt: new Date(),
    tactics,
  };
};

const normalizeImportedSession = (
  session: Session,
  sessionIds: Set<string>,
  tacticIds: Set<string>
) => {
  let sessionId = session.id;
  if (sessionIds.has(sessionId)) {
    sessionId = createSessionId();
  }
  sessionIds.add(sessionId);

  const tactics = session.tactics.map((tactic) => {
    let tacticId = tactic.id;
    if (tacticIds.has(tacticId)) {
      tacticId = createTacticId();
    }
    tacticIds.add(tacticId);
    return { ...tactic, id: tacticId };
  });

  return { ...session, id: sessionId, tactics };
};

const updateSessionPersistence = async (sessions: Session[]) => {
  await storageService.clearSessions();
  await storageService.saveSessions(sessions);
};

export const exportCurrentSession = (): ExportPayload | null => {
  const session = buildSessionSnapshot();
  if (!session) {
    return null;
  }

  return {
    type: 'session',
    exportedAt: new Date().toISOString(),
    session: serializeSession(session),
  };
};

export const exportCurrentTactic = (): ExportPayload | null => {
  const sessionState = useSessionStore.getState();
  const session = buildSessionSnapshot();
  if (!session) {
    return null;
  }

  const tactic =
    session.tactics.find((item) => item.id === sessionState.currentTacticId) ??
    session.tactics[0];
  if (!tactic) {
    return null;
  }

  return {
    type: 'tactic',
    exportedAt: new Date().toISOString(),
    tactic: serializeTactic(tactic),
  };
};

export const exportBackup = (): ExportPayload => {
  const sessionState = useSessionStore.getState();
  const snapshot = buildSessionSnapshot();
  const sessions = sessionState.sessions.map((session) => {
    if (snapshot && session.id === snapshot.id) {
      return serializeSession(snapshot);
    }
    return serializeSession(session);
  });
  return {
    type: 'backup',
    exportedAt: new Date().toISOString(),
    sessions,
  };
};

export const downloadJson = (payload: ExportPayload, filename: string) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const importPayload = async (payload: ExportPayload, mode: 'merge' | 'overwrite') => {
  const sessionState = useSessionStore.getState();
  const ui = useUIStore.getState();

  if (payload.type === 'session') {
    const imported = deserializeSession(payload.session);
    const existingIds = new Set(sessionState.sessions.map((session) => session.id));
    const existingTacticIds = new Set(
      sessionState.sessions.flatMap((session) => session.tactics.map((tactic) => tactic.id))
    );
    const session = normalizeImportedSession(imported, existingIds, existingTacticIds);

    if (mode === 'overwrite') {
      sessionState.setSessions([session]);
      sessionState.setCurrentSession(session.id);
      sessionState.setCurrentTactic(session.tactics[0]?.id ?? null);
      applyTacticToBoard(session.tactics[0] ?? null);
      await updateSessionPersistence([session]);
      ui.setSaveStatus('saved');
      return true;
    }

    sessionState.addSession(session);
    await storageService.saveSession(session);
    if (!sessionState.currentSessionId) {
      sessionState.setCurrentSession(session.id);
      sessionState.setCurrentTactic(session.tactics[0]?.id ?? null);
      applyTacticToBoard(session.tactics[0] ?? null);
    }
    return true;
  }

  if (payload.type === 'tactic') {
    if (!sessionState.currentSessionId) {
      window.alert('현재 세션이 없습니다. 먼저 세션을 생성하세요.');
      return false;
    }

    const session = sessionState.sessions.find(
      (item) => item.id === sessionState.currentSessionId
    );
    if (!session) {
      return false;
    }

    const tactic = deserializeTactic(payload.tactic);
    if (mode === 'overwrite') {
      const targetId = sessionState.currentTacticId ?? createTacticId();
      const updated: Tactic = {
        ...tactic,
        id: targetId,
        createdAt: tactic.createdAt ?? new Date(),
      };
      const updatedAt = new Date();
      const tactics = session.tactics.some((item) => item.id === targetId)
        ? session.tactics.map((item) => (item.id === targetId ? updated : item))
        : [...session.tactics, updated];
      sessionState.updateSession(session.id, { tactics, updatedAt });
      sessionState.setCurrentTactic(updated.id);
      applyTacticToBoard(updated);
      await storageService.saveSession({ ...session, tactics, updatedAt });
      ui.setSaveStatus('saved');
      return true;
    }

    const newTactic: Tactic = { ...tactic, id: createTacticId() };
    const updatedAt = new Date();
    const tactics = [...session.tactics, newTactic];
    sessionState.updateSession(session.id, { tactics, updatedAt });
    sessionState.setCurrentTactic(newTactic.id);
    applyTacticToBoard(newTactic);
    await storageService.saveSession({ ...session, tactics, updatedAt });
    ui.setSaveStatus('saved');
    return true;
  }

  if (payload.type === 'backup') {
    const importedSessions = payload.sessions.map(deserializeSession);
    if (mode === 'overwrite') {
      sessionState.setSessions(importedSessions);
      const active =
        [...importedSessions].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0] ??
        null;
      sessionState.setCurrentSession(active?.id ?? null);
      sessionState.setCurrentTactic(active?.tactics[0]?.id ?? null);
      applyTacticToBoard(active?.tactics[0] ?? null);
      await updateSessionPersistence(importedSessions);
      ui.setSaveStatus('saved');
      return true;
    }

    const existingIds = new Set(sessionState.sessions.map((session) => session.id));
    const existingTacticIds = new Set(
      sessionState.sessions.flatMap((session) => session.tactics.map((tactic) => tactic.id))
    );
    const normalized = importedSessions.map((session) =>
      normalizeImportedSession(session, existingIds, existingTacticIds)
    );
    const nextSessions = [...sessionState.sessions, ...normalized];
    sessionState.setSessions(nextSessions);
    await storageService.saveSessions(normalized);
    if (!sessionState.currentSessionId) {
      const active = normalized[0] ?? null;
      sessionState.setCurrentSession(active?.id ?? null);
      sessionState.setCurrentTactic(active?.tactics[0]?.id ?? null);
      applyTacticToBoard(active?.tactics[0] ?? null);
    }
    return true;
  }

  return false;
};
