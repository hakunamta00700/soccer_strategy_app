import { create } from 'zustand';
import { Player } from '@/types/player';
import { Ball } from '@/types/ball';
import { Shape } from '@/types/shape';

type Snapshot = {
  players: Player[];
  balls: Ball[];
  shapes: Shape[];
};

const clonePlayers = (players: Player[]) => players.map((player) => ({ ...player }));
const cloneBalls = (balls: Ball[]) => balls.map((ball) => ({ ...ball }));

const cloneShapes = (shapes: Shape[]) =>
  shapes.map((shape) => ({
    ...shape,
    points: [...shape.points],
    dash: shape.dash ? [...shape.dash] : undefined,
  }));

const createSnapshot = (state: TacticalBoardState): Snapshot => ({
  players: clonePlayers(state.players),
  balls: cloneBalls(state.balls),
  shapes: cloneShapes(state.shapes),
});

interface TacticalBoardState {
  players: Player[];
  balls: Ball[];
  shapes: Shape[];
  selectedObjectId: string | null;
  selectedPlayerIds: string[];
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
  addBall: (ball: Ball) => void;
  updateBall: (id: string, updates: Partial<Ball>) => void;
  removeBall: (id: string) => void;
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  removeShape: (id: string) => void;
  removeSelectedObject: () => void;
  undo: () => void;
  redo: () => void;
  setPlayers: (players: Player[]) => void;
  setPlayersWithHistory: (players: Player[]) => void;
  setBalls: (balls: Ball[]) => void;
  setShapes: (shapes: Shape[]) => void;
  setSelectedObject: (id: string | null) => void;
  setSelectedPlayers: (ids: string[]) => void;
  toggleSelectedPlayer: (id: string) => void;
  clearSelection: () => void;
  clearPlayerSelection: () => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setGridVisible: (visible: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  setPathVisible: (visible: boolean) => void;
}

export const useTacticalBoardStore = create<TacticalBoardState>((set) => ({
  players: [],
  balls: [],
  shapes: [],
  selectedObjectId: null,
  selectedPlayerIds: [],
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
      selectedPlayerIds: state.selectedPlayerIds.filter((playerId) => playerId !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    })),
  addBall: (ball) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      balls: [ball],
      selectedObjectId: ball.id,
    })),
  updateBall: (id, updates) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      balls: state.balls.map((ball) => (ball.id === id ? { ...ball, ...updates } : ball)),
    })),
  removeBall: (id) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      balls: state.balls.filter((ball) => ball.id !== id),
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
      const isBall = state.balls.some((ball) => ball.id === state.selectedObjectId);
      const isShape = state.shapes.some((shape) => shape.id === state.selectedObjectId);

      if (!isPlayer && !isBall && !isShape) {
        return { ...state, selectedObjectId: null };
      }

      return {
        past: [...state.past, createSnapshot(state)],
        future: [],
        players: isPlayer
          ? state.players.filter((player) => player.id !== state.selectedObjectId)
          : state.players,
        balls: isBall
          ? state.balls.filter((ball) => ball.id !== state.selectedObjectId)
          : state.balls,
        shapes: isShape
          ? state.shapes.filter((shape) => shape.id !== state.selectedObjectId)
          : state.shapes,
        selectedPlayerIds: isPlayer
          ? state.selectedPlayerIds.filter((playerId) => playerId !== state.selectedObjectId)
          : state.selectedPlayerIds,
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
        balls: cloneBalls(previous.balls),
        shapes: cloneShapes(previous.shapes),
        past: state.past.slice(0, -1),
        future: [createSnapshot(state), ...state.future],
        selectedObjectId: null,
        selectedPlayerIds: [],
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
        balls: cloneBalls(next.balls),
        shapes: cloneShapes(next.shapes),
        past: [...state.past, createSnapshot(state)],
        future: state.future.slice(1),
        selectedObjectId: null,
        selectedPlayerIds: [],
      };
    }),
  setPlayers: (players) => set({ players: clonePlayers(players) }),
  setPlayersWithHistory: (players) =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      players: clonePlayers(players),
    })),
  setBalls: (balls) => set({ balls: cloneBalls(balls) }),
  setShapes: (shapes) => set({ shapes: cloneShapes(shapes) }),
  setSelectedObject: (id) => set({ selectedObjectId: id }),
  setSelectedPlayers: (ids) =>
    set({
      selectedPlayerIds: ids,
      selectedObjectId: ids.length > 0 ? ids[ids.length - 1] : null,
    }),
  toggleSelectedPlayer: (id) =>
    set((state) => {
      const exists = state.selectedPlayerIds.includes(id);
      const nextIds = exists
        ? state.selectedPlayerIds.filter((playerId) => playerId !== id)
        : [...state.selectedPlayerIds, id];
      const nextSelected = nextIds.length > 0 ? nextIds[nextIds.length - 1] : null;
      return {
        selectedPlayerIds: nextIds,
        selectedObjectId: nextSelected,
      };
    }),
  clearSelection: () => set({ selectedObjectId: null, selectedPlayerIds: [] }),
  clearPlayerSelection: () => set({ selectedPlayerIds: [] }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
  setGridVisible: (visible) => set({ gridVisible: visible }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  setPathVisible: (visible) => set({ pathVisible: visible }),
}));
