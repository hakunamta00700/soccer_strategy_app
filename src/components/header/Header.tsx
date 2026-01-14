import { useUIStore } from '@/store/uiStore';
import { useSessionStore } from '@/store/sessionStore';

function Header() {
  const { saveStatus, setModalOpen } = useUIStore();
  const { sessions, currentSessionId } = useSessionStore();
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saved':
        return 'text-green-500';
      case 'saving':
        return 'text-yellow-500';
      case 'unsaved':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saved':
        return '저장됨 ✓';
      case 'saving':
        return '저장 중...';
      case 'unsaved':
        return '저장 안됨';
      default:
        return '';
    }
  };

  return (
    <header className="h-[60px] bg-gray-800 flex items-center justify-between px-6 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-white">⚽ 전술 보드</div>
        <button
          onClick={() => setModalOpen('sessionList')}
          className="text-gray-300 hover:text-white text-sm"
        >
          {currentSession ? currentSession.name : '세션 없음'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className={`text-sm ${getSaveStatusColor()}`}>{getSaveStatusText()}</div>
        <button
          onClick={() => setModalOpen('settings')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          aria-label="설정"
        >
          ⚙️
        </button>
        <button
          onClick={() => setModalOpen('help')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          aria-label="도움말"
        >
          ?
        </button>
      </div>
    </header>
  );
}

export default Header;
