import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import TacticalBoard from './components/board/TacticalBoard';
import BottomPanel from './components/bottom/BottomPanel';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import SettingsModal from './components/modals/SettingsModal';
import { useUIStore } from './store/uiStore';
import PlayerInfoPanel from './components/panels/PlayerInfoPanel';

function App() {
  const { modalOpen, playerInfoLocation, playerInfoVisible } = useUIStore();

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <KeyboardShortcuts />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <TacticalBoard />
            <BottomPanel />
          </div>
          {playerInfoLocation === 'sidebar' && playerInfoVisible && (
            <PlayerInfoPanel variant="sidebar" />
          )}
        </div>
      </div>
      {modalOpen === 'settings' && <SettingsModal />}
      {playerInfoLocation === 'modal' && playerInfoVisible && (
        <PlayerInfoPanel variant="modal" />
      )}
    </div>
  );
}

export default App;
