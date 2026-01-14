import { storageService } from '@/services/storageService';
import { useAnimationStore } from '@/store/animationStore';
import { useSessionStore } from '@/store/sessionStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';
import { Session, Tactic } from '@/types/session';

let autoSaveFailureNotified = false;

const buildTactic = (fallback?: Tactic): Tactic => ({
  id: fallback?.id ?? `tactic-${Date.now()}`,
  name: fallback?.name ?? '기본 전술',
  players: fallback?.players ?? [],
  balls: fallback?.balls ?? [],
  shapes: fallback?.shapes ?? [],
  animations: fallback?.animations ?? [],
  createdAt: fallback?.createdAt ?? new Date(),
});

const getBoardThumbnail = () => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const canvas = document.querySelector('#tactical-board canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    return undefined;
  }

  try {
    return canvas.toDataURL('image/png');
  } catch (error) {
    return undefined;
  }
};

const buildSessionSnapshot = (session: Session, tacticId: string | null) => {
  const board = useTacticalBoardStore.getState();
  const animation = useAnimationStore.getState();
  const now = new Date();

  const existing = session.tactics.find((tactic) => tactic.id === tacticId) ?? session.tactics[0];
  const baseTactic = buildTactic(existing);
  const updatedTactic: Tactic = {
    ...baseTactic,
    players: board.players,
    balls: board.balls,
    shapes: board.shapes,
    animations: animation.animations,
  };

  const tactics = session.tactics.some((tactic) => tactic.id === updatedTactic.id)
    ? session.tactics.map((tactic) => (tactic.id === updatedTactic.id ? updatedTactic : tactic))
    : [...session.tactics, updatedTactic];

  return {
    session: {
      ...session,
      updatedAt: now,
      tactics,
      thumbnail: getBoardThumbnail() ?? session.thumbnail,
    },
    activeTacticId: updatedTactic.id,
  };
};

export const saveCurrentSession = async (mode: 'auto' | 'manual') => {
  const ui = useUIStore.getState();
  const sessionState = useSessionStore.getState();
  const currentSessionId = sessionState.currentSessionId;

  if (!currentSessionId) {
    return false;
  }

  const session = sessionState.sessions.find((item) => item.id === currentSessionId);
  if (!session) {
    return false;
  }

  const { session: snapshot, activeTacticId } = buildSessionSnapshot(
    session,
    sessionState.currentTacticId
  );
  ui.setSaveStatus('saving');
  try {
    sessionState.updateSession(session.id, {
      updatedAt: snapshot.updatedAt,
      tactics: snapshot.tactics,
    });
    sessionState.setCurrentTactic(activeTacticId ?? null);
    await storageService.saveSession({
      ...snapshot,
      tactics: snapshot.tactics,
    });
    ui.setSaveStatus('saved');
    autoSaveFailureNotified = false;
    return true;
  } catch (error) {
    ui.setSaveStatus('unsaved');
    if (mode === 'manual') {
      window.alert('저장에 실패했습니다.');
    } else if (!autoSaveFailureNotified) {
      autoSaveFailureNotified = true;
      window.alert('자동 저장에 실패했습니다.');
    }
    return false;
  }
};
