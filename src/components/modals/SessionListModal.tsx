import { useMemo, useState } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useAnimationStore } from '@/store/animationStore';
import { useUIStore } from '@/store/uiStore';
import { storageService } from '@/services/storageService';
import { Session, Tactic } from '@/types/session';

const createEmptyTactic = (): Tactic => ({
  id: `tactic-${Date.now()}`,
  name: '기본 전술',
  players: [],
  balls: [],
  shapes: [],
  animations: [],
  createdAt: new Date(),
});

const createSession = (name: string, description?: string): Session => ({
  id: `session-${Date.now()}`,
  name,
  description,
  createdAt: new Date(),
  updatedAt: new Date(),
  tactics: [createEmptyTactic()],
});

function SessionListModal() {
  const { setModalOpen, setSaveStatus, saveStatus } = useUIStore();
  const {
    sessions,
    currentSessionId,
    setSessions,
    addSession,
    removeSession,
    setCurrentSession,
    setCurrentTactic,
  } = useSessionStore();
  const { setPlayers, setShapes, setBalls, clearSelection } = useTacticalBoardStore();
  const { setAnimations, setIsPlaying, setCurrentTime } = useAnimationStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      ),
    [sessions]
  );

  const applyTactic = (tactic: Tactic | null) => {
    if (!tactic) {
      setPlayers([]);
      setBalls([]);
      setShapes([]);
      setAnimations([]);
      setIsPlaying(false);
      setCurrentTime(0);
      clearSelection();
      return;
    }

    setPlayers(tactic.players);
    setBalls(tactic.balls ?? []);
    setShapes(tactic.shapes);
    setAnimations(tactic.animations);
    setIsPlaying(false);
    setCurrentTime(0);
    clearSelection();
  };

  const confirmSessionSwitch = (nextSessionId: string | null) => {
    if (saveStatus !== 'unsaved') {
      return true;
    }
    if (!currentSessionId) {
      return true;
    }
    if (nextSessionId && nextSessionId === currentSessionId) {
      return true;
    }
    return window.confirm(
      '저장되지 않은 변경사항이 있습니다. 변경사항을 버리고 전환하시겠습니까?'
    );
  };

  const handleCreateSession = async () => {
    if (!name.trim()) {
      alert('세션 이름을 입력해주세요.');
      return;
    }
    if (!confirmSessionSwitch(null)) {
      return;
    }

    const session = createSession(name.trim(), description.trim() || undefined);
    addSession(session);
    setCurrentSession(session.id);
    setCurrentTactic(session.tactics[0]?.id ?? null);
    applyTactic(session.tactics[0] ?? null);
    await storageService.saveSession(session);
    setSaveStatus('saved');
    setName('');
    setDescription('');
    setModalOpen(null);
  };

  const handleLoadSession = (session: Session) => {
    if (!confirmSessionSwitch(session.id)) {
      return;
    }
    setCurrentSession(session.id);
    const tactic = session.tactics[0] ?? null;
    setCurrentTactic(tactic?.id ?? null);
    applyTactic(tactic);
    setSaveStatus('saved');
    setModalOpen(null);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm('세션을 삭제하시겠습니까?')) {
      return;
    }
    removeSession(sessionId);
    await storageService.deleteSession(sessionId);

    const remaining = sessions.filter((session) => session.id !== sessionId);
    setSessions(remaining);
    if (currentSessionId === sessionId) {
      const next = remaining[0] ?? null;
      setCurrentSession(next?.id ?? null);
      setCurrentTactic(next?.tactics[0]?.id ?? null);
      applyTactic(next?.tactics[0] ?? null);
      setSaveStatus('saved');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-white">세션 목록</h2>
          <button
            onClick={() => setModalOpen(null)}
            className="text-gray-400 hover:text-white"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-400">새 세션</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded text-sm"
                placeholder="세션 이름"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded text-sm"
                rows={3}
                placeholder="설명 (선택)"
              />
              <button
                onClick={handleCreateSession}
                className="w-full px-3 py-2 bg-primary-600 text-white rounded text-sm"
              >
                세션 생성
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-400">저장된 세션</h3>
            <div className="space-y-2 max-h-[360px] overflow-y-auto">
              {sortedSessions.length === 0 ? (
                <div className="text-xs text-gray-500">저장된 세션이 없습니다.</div>
              ) : (
                sortedSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`rounded border px-3 py-2 text-sm ${
                      session.id === currentSessionId
                        ? 'border-primary-500 bg-gray-700'
                        : 'border-gray-700 bg-gray-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white">{session.name}</div>
                        <div className="text-[11px] text-gray-400">
                          {session.updatedAt.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoadSession(session)}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded"
                        >
                          불러오기
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    {session.description && (
                      <div className="mt-2 text-xs text-gray-400">
                        {session.description}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionListModal;
