import { create } from 'zustand';

export type TabType = 'players' | 'tools' | 'tactics' | 'formation';
export type ToolType = 'arrow' | 'line' | 'rect' | 'circle' | 'text' | 'freehand' | null;
export type ModalType = 'settings' | 'help' | 'sessionList' | null;
export type StrokeStyle = 'solid' | 'dashed';
export type PlayerViewMode = 'number' | 'photo';
export type BoardOrientation = 'landscape' | 'portrait';
export type PlayerInfoLocation = 'modal' | 'sidebar';

interface UIState {
  sidebarOpen: boolean;
  activeTab: TabType;
  activeTool: ToolType;
  modalOpen: ModalType;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  playerViewMode: PlayerViewMode;
  positionFilter: Array<'GK' | 'DF' | 'MF' | 'FW'>;
  boardOrientation: BoardOrientation;
  animationPanelVisible: boolean;
  playerInfoLocation: PlayerInfoLocation;
  playerInfoVisible: boolean;
  arrowColor: string;
  arrowStrokeWidth: number;
  arrowStyle: StrokeStyle;
  arrowPointerLength: number;
  arrowPointerWidth: number;
  freehandColor: string;
  freehandStrokeWidth: number;
  freehandOpacity: number;
  freehandHasArrow: boolean;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: TabType) => void;
  setActiveTool: (tool: ToolType) => void;
  setModalOpen: (modal: ModalType) => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'unsaved') => void;
  setPlayerViewMode: (mode: PlayerViewMode) => void;
  setPositionFilter: (positions: Array<'GK' | 'DF' | 'MF' | 'FW'>) => void;
  setBoardOrientation: (orientation: BoardOrientation) => void;
  setAnimationPanelVisible: (visible: boolean) => void;
  setPlayerInfoLocation: (location: PlayerInfoLocation) => void;
  setPlayerInfoVisible: (visible: boolean) => void;
  setArrowColor: (color: string) => void;
  setArrowStrokeWidth: (width: number) => void;
  setArrowStyle: (style: StrokeStyle) => void;
  setArrowPointerLength: (length: number) => void;
  setArrowPointerWidth: (width: number) => void;
  setFreehandColor: (color: string) => void;
  setFreehandStrokeWidth: (width: number) => void;
  setFreehandOpacity: (opacity: number) => void;
  setFreehandHasArrow: (enabled: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: 'players',
  activeTool: null,
  modalOpen: null,
  saveStatus: 'saved',
  playerViewMode: 'number',
  positionFilter: ['GK', 'DF', 'MF', 'FW'],
  boardOrientation: 'landscape',
  animationPanelVisible: false,
  playerInfoLocation: 'sidebar',
  playerInfoVisible: true,
  arrowColor: '#ffffff',
  arrowStrokeWidth: 2,
  arrowStyle: 'solid',
  arrowPointerLength: 10,
  arrowPointerWidth: 10,
  freehandColor: '#ffffff',
  freehandStrokeWidth: 2,
  freehandOpacity: 1,
  freehandHasArrow: true,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setModalOpen: (modal) => set({ modalOpen: modal }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setPlayerViewMode: (mode) => set({ playerViewMode: mode }),
  setPositionFilter: (positions) => set({ positionFilter: positions }),
  setBoardOrientation: (orientation) => set({ boardOrientation: orientation }),
  setAnimationPanelVisible: (visible) => set({ animationPanelVisible: visible }),
  setPlayerInfoLocation: (location) => set({ playerInfoLocation: location }),
  setPlayerInfoVisible: (visible) => set({ playerInfoVisible: visible }),
  setArrowColor: (color) => set({ arrowColor: color }),
  setArrowStrokeWidth: (width) => set({ arrowStrokeWidth: width }),
  setArrowStyle: (style) => set({ arrowStyle: style }),
  setArrowPointerLength: (length) => set({ arrowPointerLength: length }),
  setArrowPointerWidth: (width) => set({ arrowPointerWidth: width }),
  setFreehandColor: (color) => set({ freehandColor: color }),
  setFreehandStrokeWidth: (width) => set({ freehandStrokeWidth: width }),
  setFreehandOpacity: (opacity) => set({ freehandOpacity: opacity }),
  setFreehandHasArrow: (enabled) => set({ freehandHasArrow: enabled }),
}));
