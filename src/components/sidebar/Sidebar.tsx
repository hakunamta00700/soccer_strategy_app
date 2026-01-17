import { useUIStore } from '@/store/uiStore';
import PlayersTab from './PlayersTab';
import ToolsTab from './ToolsTab';
import TacticsTab from './TacticsTab';
import FormationTab from './FormationTab';

function Sidebar() {
  const { sidebarOpen, activeTab, setActiveTab } = useUIStore();

  if (!sidebarOpen) {
    return (
      <div className="w-full lg:w-12 bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-700 flex lg:flex-col items-center justify-between py-2 lg:py-4 px-4 lg:px-0">
        <span className="text-xs text-gray-400 lg:hidden">도구 메뉴</span>
        <button
          onClick={() => useUIStore.getState().setSidebarOpen(true)}
          className="p-2 hover:bg-gray-700 rounded"
        >
          ☰
        </button>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[280px] bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-700 flex flex-col">
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

      <div className="flex-1 overflow-y-auto p-4 max-h-[40vh] lg:max-h-none">
        {activeTab === 'players' && <PlayersTab />}
        {activeTab === 'tools' && <ToolsTab />}
        {activeTab === 'tactics' && <TacticsTab />}
        {activeTab === 'formation' && <FormationTab />}
      </div>
    </div>
  );
}

export default Sidebar;
