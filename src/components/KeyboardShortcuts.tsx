import { useEffect } from 'react';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useAnimationStore } from '@/store/animationStore';

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
