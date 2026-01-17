import { useUIStore } from '@/store/uiStore';
import PlayersTab from './PlayersTab';
import ToolsTab from './ToolsTab';
import TacticsTab from './TacticsTab';
import FormationTab from './FormationTab';

function Sidebar() {
  const { sidebarOpen, activeTab, setActiveTab } = useUIStore();

  if (!sidebarOpen) {
    return (
      <>
        <div className="hidden lg:flex w-12 bg-gray-800 border-r border-gray-700 flex-col items-center py-4">
          <button
            onClick={() => useUIStore.getState().setSidebarOpen(true)}
            className="p-2 hover:bg-gray-700 rounded"
          >
            ☰
          </button>
        </div>
        <button
          onClick={() => useUIStore.getState().setSidebarOpen(true)}
          className="lg:hidden fixed top-[72px] left-3 z-40 p-2 bg-gray-800 text-white rounded-full shadow-lg border border-gray-700 hover:bg-gray-700"
          aria-label="대시보드 열기"
        >
          ☰
        </button>
      </>
    );
  }

  return (
    <>
      <div className="hidden lg:flex w-[280px] bg-gray-800 border-r border-gray-700 flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'players'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            선수
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'tools'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            도구
          </button>
          <button
            onClick={() => setActiveTab('tactics')}
            className={`px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'tactics'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            전술
          </button>
          <button
            onClick={() => setActiveTab('formation')}
            className={`px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'formation'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            포메이션
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'players' && <PlayersTab />}
          {activeTab === 'tools' && <ToolsTab />}
          {activeTab === 'tactics' && <TacticsTab />}
          {activeTab === 'formation' && <FormationTab />}
        </div>
      </div>
      <div className="lg:hidden fixed inset-0 z-40 flex">
        <button
          className="absolute inset-0 bg-gray-900/80"
          onClick={() => useUIStore.getState().setSidebarOpen(false)}
          aria-label="대시보드 닫기"
        />
        <div className="relative w-full max-w-sm bg-gray-800 border-r border-gray-700 flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <span className="text-sm font-semibold text-white">대시보드</span>
            <button
              onClick={() => useUIStore.getState().setSidebarOpen(false)}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              aria-label="대시보드 닫기"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('players')}
              className={`px-4 py-3 text-xs font-medium transition-colors ${
                activeTab === 'players'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              선수
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-3 text-xs font-medium transition-colors ${
                activeTab === 'tools'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              도구
            </button>
            <button
              onClick={() => setActiveTab('tactics')}
              className={`px-4 py-3 text-xs font-medium transition-colors ${
                activeTab === 'tactics'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              전술
            </button>
            <button
              onClick={() => setActiveTab('formation')}
              className={`px-4 py-3 text-xs font-medium transition-colors ${
                activeTab === 'formation'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              포메이션
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'players' && <PlayersTab />}
            {activeTab === 'tools' && <ToolsTab />}
            {activeTab === 'tactics' && <TacticsTab />}
            {activeTab === 'formation' && <FormationTab />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
