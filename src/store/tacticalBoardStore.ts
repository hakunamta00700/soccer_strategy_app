import { create } from 'zustand';
import { Player } from '@/types/player';
import { Shape } from '@/types/shape';

type Snapshot = {
  players: Player[];
  shapes: Shape[];
};

const clonePlayers = (players: Player[]) => players.map((player) => ({ ...player }));

const cloneShapes = (shapes: Shape[]) =>
  shapes.map((shape) => ({
    ...shape,
    points: [...shape.points],
    dash: shape.dash ? [...shape.dash] : undefined,
  }));

const createSnapshot = (state: TacticalBoardState): Snapshot => ({
  players: clonePlayers(state.players),
  shapes: cloneShapes(state.shapes),
});

interface TacticalBoardState {
  players: Player[];
  shapes: Shape[];
  selectedObjectId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  gridVisible: boolean;
  snapToGrid: boolean;
  pathVisible: boolean;
  past: Snapshot[];
  future: Snapshot[];

  // Actions
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  removeShape: (id: string) => void;
  removeSelectedObject: () => void;
  undo: () => void;
  redo: () => void;
  setPlayers: (players: Player[]) => void;
  setShapes: (shapes: Shape[]) => void;
  setSelectedObject: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setGridVisible: (visible: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  setPathVisible: (visible: boolean) => void;
}

export const useTacticalBoardStore = create<TacticalBoardState>((set) => ({
  players: [],
  shapes: [],
  selectedObjectId: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  gridVisible: false,
  snapToGrid: false,
  pathVisible: false,
  past: [],
  future: [],

  addPlayer: (player) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      players: [...state.players, player],
    })),
  updatePlayer: (id, updates) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      players: state.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removePlayer: (id) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      players: state.players.filter((p) => p.id !== id),
    })),
  addShape: (shape) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      shapes: [...state.shapes, shape],
    })),
  updateShape: (id, updates) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      shapes: state.shapes.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  removeShape: (id) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      shapes: state.shapes.filter((s) => s.id !== id),
    })),
  removeSelectedObject: () =>
    set((state) => {
      if (!state.selectedObjectId) {
        return state;
      }

      const isPlayer = state.players.some((player) => player.id === state.selectedObjectId);
      const isShape = state.shapes.some((shape) => shape.id === state.selectedObjectId);

      if (!isPlayer && !isShape) {
        return { ...state, selectedObjectId: null };
      }

      return {
        past: [...state.past, createSnapshot(state)],
        future: [],
        players: isPlayer
          ? state.players.filter((player) => player.id !== state.selectedObjectId)
          : state.players,
        shapes: isShape
          ? state.shapes.filter((shape) => shape.id !== state.selectedObjectId)
          : state.shapes,
        selectedObjectId: null,
      };
    }),
  undo: () =>
    set((state) => {
      if (state.past.length === 0) {
        return state;
      }

      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        players: clonePlayers(previous.players),
        shapes: cloneShapes(previous.shapes),
        past: state.past.slice(0, -1),
        future: [createSnapshot(state), ...state.future],
        selectedObjectId: null,
      };
    }),
  redo: () =>
    set((state) => {
      if (state.future.length === 0) {
        return state;
      }

      const next = state.future[0];
      return {
        ...state,
        players: clonePlayers(next.players),
        shapes: cloneShapes(next.shapes),
        past: [...state.past, createSnapshot(state)],
        future: state.future.slice(1),
        selectedObjectId: null,
      };
    }),
  setPlayers: (players) => set({ players: clonePlayers(players) }),
  setShapes: (shapes) => set({ shapes: cloneShapes(shapes) }),
  setSelectedObject: (id) => set({ selectedObjectId: id }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
  setGridVisible: (visible) => set({ gridVisible: visible }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  setPathVisible: (visible) => set({ pathVisible: visible }),
}));
