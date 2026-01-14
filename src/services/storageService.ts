import { openDB, DBSchema } from 'idb';
import { Session, Tactic } from '@/types/session';

const DB_NAME = 'soccer-strategy-db';
const DB_VERSION = 1;
const SESSION_STORE = 'sessions';

type PersistedTactic = Omit<Tactic, 'createdAt'> & { createdAt: string };
type PersistedSession = Omit<Session, 'createdAt' | 'updatedAt' | 'tactics'> & {
  createdAt: string;
  updatedAt: string;
  tactics: PersistedTactic[];
};

interface StrategyDB extends DBSchema {
  sessions: {
    key: string;
    value: PersistedSession;
    indexes: { 'by-updated': string };
  };
}

const ensureDateString = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : value;

const toPersistedTactic = (tactic: Tactic): PersistedTactic => ({
  ...tactic,
  createdAt: ensureDateString(tactic.createdAt),
});

const toPersistedSession = (session: Session): PersistedSession => ({
  ...session,
  createdAt: ensureDateString(session.createdAt),
  updatedAt: ensureDateString(session.updatedAt),
  tactics: session.tactics.map(toPersistedTactic),
});

const toSession = (persisted: PersistedSession): Session => ({
  ...persisted,
  createdAt: new Date(persisted.createdAt),
  updatedAt: new Date(persisted.updatedAt),
  tactics: persisted.tactics.map((tactic) => ({
    ...tactic,
    createdAt: new Date(tactic.createdAt),
    balls: tactic.balls ?? [],
  })),
});

const openDatabase = () =>
  openDB<StrategyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(SESSION_STORE)) {
        const store = db.createObjectStore(SESSION_STORE, { keyPath: 'id' });
        store.createIndex('by-updated', 'updatedAt');
      }
    },
  });

const getSessions = async () => {
  const db = await openDatabase();
  const rows = await db.getAll(SESSION_STORE);
  return rows.map(toSession);
};

const getSessionById = async (id: string) => {
  const db = await openDatabase();
  const row = await db.get(SESSION_STORE, id);
  return row ? toSession(row) : null;
};

const saveSession = async (session: Session) => {
  const db = await openDatabase();
  await db.put(SESSION_STORE, toPersistedSession(session));
};

const saveSessions = async (sessions: Session[]) => {
  const db = await openDatabase();
  const tx = db.transaction(SESSION_STORE, 'readwrite');
  await Promise.all(sessions.map((session) => tx.store.put(toPersistedSession(session))));
  await tx.done;
};

const deleteSession = async (id: string) => {
  const db = await openDatabase();
  await db.delete(SESSION_STORE, id);
};

const clearSessions = async () => {
  const db = await openDatabase();
  await db.clear(SESSION_STORE);
};

export const storageService = {
  getSessions,
  getSessionById,
  saveSession,
  saveSessions,
  deleteSession,
  clearSessions,
};
