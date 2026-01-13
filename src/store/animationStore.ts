import { create } from 'zustand';
import { Animation } from '@/types/animation';

interface AnimationState {
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  animations: Animation[];

  // Actions
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setAnimations: (animations: Animation[]) => void;
  addAnimation: (animation: Animation) => void;
  updateAnimation: (id: string, updates: Partial<Animation>) => void;
  removeAnimation: (id: string) => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1,
  animations: [],

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setAnimations: (animations) => set({ animations }),
  addAnimation: (animation) =>
    set((state) => ({ animations: [...state.animations, animation] })),
  updateAnimation: (id, updates) =>
    set((state) => ({
      animations: state.animations.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  removeAnimation: (id) =>
    set((state) => ({ animations: state.animations.filter((a) => a.id !== id) })),
}));
