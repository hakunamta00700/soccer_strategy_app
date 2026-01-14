import { create } from 'zustand';
import { Player } from '@/types/player';
import { Ball } from '@/types/ball';
import { Shape } from '@/types/shape';
import { CANVAS_WIDTH, FIELD_COLOR, LINE_COLOR } from '@/constants/field';
import { useAnimationStore } from '@/store/animationStore';

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

const rotatePoint = (x: number, y: number, clockwise: boolean) => {
  if (clockwise) {
    return { x: y, y: CANVAS_WIDTH - x };
  }
  return { x: CANVAS_WIDTH - y, y: x };
};

const rotateRect = (x: number, y: number, width: number, height: number, clockwise: boolean) => {
  const corners = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ].map((corner) => rotatePoint(corner.x, corner.y, clockwise));

  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

const rotateShapePoints = (shape: Shape, clockwise: boolean) => {
  if (shape.type === 'rect' && shape.points.length === 4) {
    const [x, y, width, height] = shape.points;
    const rotated = rotateRect(x, y, width, height, clockwise);
    return [rotated.x, rotated.y, rotated.width, rotated.height];
  }

  if (shape.type === 'circle' && shape.points.length === 3) {
    const [x, y, radius] = shape.points;
    const rotated = rotatePoint(x, y, clockwise);
    return [rotated.x, rotated.y, radius];
  }

  if (shape.points.length % 2 === 0) {
    const next: number[] = [];
    for (let index = 0; index < shape.points.length; index += 2) {
      const rotated = rotatePoint(shape.points[index], shape.points[index + 1], clockwise);
      next.push(rotated.x, rotated.y);
    }
    return next;
  }

  return shape.points;
};

const rotatePlayers = (players: Player[], clockwise: boolean) =>
  players.map((player) => {
    const rotated = rotatePoint(player.x, player.y, clockwise);
    return { ...player, x: rotated.x, y: rotated.y };
  });

const rotateBalls = (balls: Ball[], clockwise: boolean) =>
  balls.map((ball) => {
    const rotated = rotatePoint(ball.x, ball.y, clockwise);
    return { ...ball, x: rotated.x, y: rotated.y };
  });

const rotateShapes = (shapes: Shape[], clockwise: boolean) =>
  shapes.map((shape) => ({
    ...shape,
    points: rotateShapePoints(shape, clockwise),
  }));

const rotateAnimations = (clockwise: boolean) => {
  const animationStore = useAnimationStore.getState();
  if (animationStore.animations.length === 0) {
    return;
  }

  const nextAnimations = animationStore.animations.map((animation) => ({
    ...animation,
    keyframes: animation.keyframes.map((frame) => ({
      ...frame,
      players: rotatePlayers(frame.players, clockwise),
      shapes: rotateShapes(frame.shapes, clockwise),
    })),
  }));

  animationStore.setAnimations(nextAnimations);
};

interface TacticalBoardState {
  players: Player[];
  balls: Ball[];
  shapes: Shape[];
  selectedObjectId: string | null;
  selectedPlayerIds: string[];
  fieldColor: string;
  lineColor: string;
  homeColor: string;
  awayColor: string;
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
  rotateBoard: (clockwise: boolean) => void;
  setFieldColor: (color: string) => void;
  setLineColor: (color: string) => void;
  setTeamColor: (team: 'home' | 'away', color: string) => void;
  clearShapes: () => void;
  clearPlayers: () => void;
  clearBoard: () => void;
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
  fieldColor: FIELD_COLOR,
  lineColor: LINE_COLOR,
  homeColor: '#e63946',
  awayColor: '#457b9d',
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
  rotateBoard: (clockwise) =>
    set((state) => {
      rotateAnimations(clockwise);

      return {
        past: [...state.past, createSnapshot(state)],
        future: [],
        players: rotatePlayers(state.players, clockwise),
        balls: rotateBalls(state.balls, clockwise),
        shapes: rotateShapes(state.shapes, clockwise),
        pan: { x: 0, y: 0 },
      };
    }),
  setFieldColor: (color) => set({ fieldColor: color }),
  setLineColor: (color) => set({ lineColor: color }),
  setTeamColor: (team, color) =>
    set((state) => ({
      ...(team === 'home' ? { homeColor: color } : { awayColor: color }),
      players: state.players.map((player) =>
        player.team === team ? { ...player, color } : player
      ),
    })),
  clearShapes: () =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      shapes: [],
      selectedObjectId: null,
    })),
  clearPlayers: () =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      players: [],
      selectedObjectId: null,
      selectedPlayerIds: [],
    })),
  clearBoard: () =>
    set((state) => ({
      past: [...state.past, createSnapshot(state)],
      future: [],
      players: [],
      shapes: [],
      selectedObjectId: null,
      selectedPlayerIds: [],
    })),
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
  setGridVisible: (visible) => set({ gridVisible: visible }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  setPathVisible: (visible) => set({ pathVisible: visible }),
}));
