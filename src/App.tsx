import { useEffect } from 'react';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import TacticalBoard from './components/board/TacticalBoard';
import BottomPanel from './components/bottom/BottomPanel';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import SettingsModal from './components/modals/SettingsModal';
import { useUIStore } from './store/uiStore';
import PlayerInfoPanel from './components/panels/PlayerInfoPanel';
import SessionListModal from './components/modals/SessionListModal';
import { storageService } from './services/storageService';
import { useSessionStore } from './store/sessionStore';
import { useTacticalBoardStore } from './store/tacticalBoardStore';
import { useAnimationStore } from './store/animationStore';
import SessionPersistence from './components/SessionPersistence';
import HelpModal from './components/modals/HelpModal';

function App() {
  const { modalOpen, playerInfoLocation, playerInfoVisible, setSaveStatus } = useUIStore();
  const { setSessions, setCurrentSession, setCurrentTactic } = useSessionStore();
  const { setPlayers, setShapes, setBalls, clearSelection } = useTacticalBoardStore();
  const { setAnimations, setIsPlaying, setCurrentTime } = useAnimationStore();

  useEffect(() => {
    const loadSessions = async () => {
      const sessions = await storageService.getSessions();
      setSessions(sessions);

      if (sessions.length === 0) {
        return;
      }

      const sorted = [...sessions].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
      const active = sorted[0];
      const tactic = active.tactics[0] ?? null;
      setCurrentSession(active.id);
      setCurrentTactic(tactic?.id ?? null);
      setPlayers(tactic?.players ?? []);
      setBalls(tactic?.balls ?? []);
      setShapes(tactic?.shapes ?? []);
      setAnimations(tactic?.animations ?? []);
      setIsPlaying(false);
      setCurrentTime(0);
      clearSelection();
      setSaveStatus('saved');
    };

    loadSessions();
  }, [
    setSessions,
    setCurrentSession,
    setCurrentTactic,
    setPlayers,
    setBalls,
    setShapes,
    setAnimations,
    setIsPlaying,
    setCurrentTime,
    clearSelection,
    setSaveStatus,
  ]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <SessionPersistence />
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
      {modalOpen === 'help' && <HelpModal />}
      {modalOpen === 'sessionList' && <SessionListModal />}
      {playerInfoLocation === 'modal' && playerInfoVisible && (
        <PlayerInfoPanel variant="modal" />
      )}
    </div>
  );
}

export default App;
