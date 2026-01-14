import { useUIStore } from '@/store/uiStore';

function HelpModal() {
  const { setModalOpen } = useUIStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-white">단축키</h2>
          <button
            onClick={() => setModalOpen(null)}
            className="text-gray-400 hover:text-white"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-3 text-sm text-gray-200">
          <div className="flex justify-between">
            <span>저장</span>
            <span className="text-gray-400">Ctrl/Cmd + S</span>
          </div>
          <div className="flex justify-between">
            <span>실행 취소</span>
            <span className="text-gray-400">Ctrl/Cmd + Z</span>
          </div>
          <div className="flex justify-between">
            <span>다시 실행</span>
            <span className="text-gray-400">Ctrl/Cmd + Y</span>
          </div>
          <div className="flex justify-between">
            <span>재생/일시정지</span>
            <span className="text-gray-400">Space</span>
          </div>
          <div className="flex justify-between">
            <span>정지/초기화</span>
            <span className="text-gray-400">Shift + Space</span>
          </div>
          <div className="flex justify-between">
            <span>선수 위치 이동</span>
            <span className="text-gray-400">방향키</span>
          </div>
          <div className="flex justify-between">
            <span>선수 빠른 이동</span>
            <span className="text-gray-400">Shift + 방향키</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
