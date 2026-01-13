import { create } from 'zustand';

export type TabType = 'players' | 'tools' | 'tactics';
export type ToolType = 'arrow' | 'line' | 'rect' | 'circle' | 'text' | null;
export type ModalType = 'settings' | 'help' | 'sessionList' | null;
export type StrokeStyle = 'solid' | 'dashed';

interface UIState {
  sidebarOpen: boolean;
  activeTab: TabType;
  activeTool: ToolType;
  modalOpen: ModalType;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  arrowColor: string;
  arrowStrokeWidth: number;
  arrowStyle: StrokeStyle;
  arrowPointerLength: number;
  arrowPointerWidth: number;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: TabType) => void;
  setActiveTool: (tool: ToolType) => void;
  setModalOpen: (modal: ModalType) => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'unsaved') => void;
  setArrowColor: (color: string) => void;
  setArrowStrokeWidth: (width: number) => void;
  setArrowStyle: (style: StrokeStyle) => void;
  setArrowPointerLength: (length: number) => void;
  setArrowPointerWidth: (width: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: 'players',
  activeTool: null,
  modalOpen: null,
  saveStatus: 'saved',
  arrowColor: '#ffffff',
  arrowStrokeWidth: 2,
  arrowStyle: 'solid',
  arrowPointerLength: 10,
  arrowPointerWidth: 10,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setModalOpen: (modal) => set({ modalOpen: modal }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setArrowColor: (color) => set({ arrowColor: color }),
  setArrowStrokeWidth: (width) => set({ arrowStrokeWidth: width }),
  setArrowStyle: (style) => set({ arrowStyle: style }),
  setArrowPointerLength: (length) => set({ arrowPointerLength: length }),
  setArrowPointerWidth: (width) => set({ arrowPointerWidth: width }),
}));
