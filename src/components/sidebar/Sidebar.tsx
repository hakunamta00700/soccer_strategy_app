import { useUIStore } from '@/store/uiStore';
import PlayersTab from './PlayersTab';
import ToolsTab from './ToolsTab';
import TacticsTab from './TacticsTab';
import FormationTab from './FormationTab';

function Sidebar() {
  const { sidebarOpen, activeTab, setActiveTab } = useUIStore();

  if (!sidebarOpen) {
    return (
      <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
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
    <div className="w-[280px] bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('players')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'players'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
        >
          선수
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'tools'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
        >
          도구
        </button>
        <button
          onClick={() => setActiveTab('tactics')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'tactics'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
        >
          전술
        </button>
        <button
          onClick={() => setActiveTab('formation')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
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
  );
}

export default Sidebar;
