import { useEffect } from 'react';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useAnimationStore } from '@/store/animationStore';
import { saveCurrentSession } from '@/services/sessionPersistence';
import { CANVAS_HEIGHT, CANVAS_WIDTH, GRID_SIZE } from '@/constants/field';
import { snapValue } from '@/utils/grid';

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select';
};

function KeyboardShortcuts() {
  useEffect(() => {
    const clampValue = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);
    const playerRadius = 22;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const isMeta = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (isMeta && key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          useTacticalBoardStore.getState().redo();
        } else {
          useTacticalBoardStore.getState().undo();
        }
        return;
      }

      if (isMeta && key === 'y') {
        event.preventDefault();
        useTacticalBoardStore.getState().redo();
        return;
      }

      if (isMeta && key === 's') {
        event.preventDefault();
        void saveCurrentSession('manual');
        return;
      }

      if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright') {
        const boardState = useTacticalBoardStore.getState();
        if (boardState.selectedPlayerIds.length === 0) {
          return;
        }

        event.preventDefault();
        const baseStep = boardState.snapToGrid ? GRID_SIZE : 5;
        const step = event.shiftKey ? baseStep * 3 : baseStep;
        const delta =
          key === 'arrowup'
            ? { x: 0, y: -step }
            : key === 'arrowdown'
              ? { x: 0, y: step }
              : key === 'arrowleft'
                ? { x: -step, y: 0 }
                : { x: step, y: 0 };

        const nextPlayers = boardState.players.map((player) => {
          if (!boardState.selectedPlayerIds.includes(player.id)) {
            return player;
          }
          const snappedX = snapValue(player.x + delta.x, boardState.snapToGrid);
          const snappedY = snapValue(player.y + delta.y, boardState.snapToGrid);
          const nextX = clampValue(snappedX, playerRadius, CANVAS_WIDTH - playerRadius);
          const nextY = clampValue(snappedY, playerRadius, CANVAS_HEIGHT - playerRadius);
          return {
            ...player,
            x: nextX,
            y: nextY,
          };
        });

        boardState.setPlayersWithHistory(nextPlayers);
        return;
      }

      if (key === ' ') {
        event.preventDefault();
        const animationStore = useAnimationStore.getState();
        if (animationStore.animations.length === 0) {
          return;
        }

        if (event.shiftKey) {
          animationStore.setIsPlaying(false);
          animationStore.setCurrentTime(0);
        } else {
          animationStore.setIsPlaying(!animationStore.isPlaying);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}

export default KeyboardShortcuts;
