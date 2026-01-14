import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useAnimationStore } from '@/store/animationStore';
import { useSessionStore } from '@/store/sessionStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';
import { saveCurrentSession } from '@/services/sessionPersistence';

const AUTOSAVE_INTERVAL_MS = 30000;

function SessionPersistence() {
  const currentSessionId = useSessionStore((state) => state.currentSessionId);

  useEffect(() => {
    const markUnsaved = () => {
      if (!useSessionStore.getState().currentSessionId) {
        return;
      }
      const ui = useUIStore.getState();
      if (ui.saveStatus !== 'unsaved') {
        ui.setSaveStatus('unsaved');
      }
    };

    const unsubscribeBoard = useTacticalBoardStore.subscribe(
      (state) => [state.players, state.balls, state.shapes],
      markUnsaved,
      { equalityFn: shallow }
    );

    const unsubscribeAnimations = useAnimationStore.subscribe(
      (state) => state.animations,
      markUnsaved,
      { equalityFn: shallow }
    );

    return () => {
      unsubscribeBoard();
      unsubscribeAnimations();
    };
  }, []);

  useEffect(() => {
    if (!currentSessionId) {
      return;
    }

    const interval = window.setInterval(() => {
      const sessionId = useSessionStore.getState().currentSessionId;
      const ui = useUIStore.getState();
      if (!sessionId || ui.saveStatus !== 'unsaved') {
        return;
      }
      void saveCurrentSession('auto');
    }, AUTOSAVE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [currentSessionId]);

  return null;
}

export default SessionPersistence;
