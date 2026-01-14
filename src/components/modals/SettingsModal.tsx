import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { FIELD_COLOR, LINE_COLOR } from '@/constants/field';

function SettingsModal() {
  const { setModalOpen } = useUIStore();
  const {
    fieldColor,
    lineColor,
    homeColor,
    awayColor,
    setFieldColor,
    setLineColor,
    setTeamColor,
  } = useTacticalBoardStore();
  const [localField, setLocalField] = useState(fieldColor);
  const [localLine, setLocalLine] = useState(lineColor);
  const [localHome, setLocalHome] = useState(homeColor);
  const [localAway, setLocalAway] = useState(awayColor);

  const applyChanges = () => {
    setFieldColor(localField);
    setLineColor(localLine);
    setTeamColor('home', localHome);
    setTeamColor('away', localAway);
    setModalOpen(null);
  };

  const resetDefaults = () => {
    setLocalField(FIELD_COLOR);
    setLocalLine(LINE_COLOR);
    setLocalHome('#e63946');
    setLocalAway('#457b9d');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-white">설정</h2>
          <button
            onClick={() => setModalOpen(null)}
            className="text-gray-400 hover:text-white"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-400">축구장 색상</h3>
            <label className="flex items-center justify-between text-xs text-gray-300">
              배경색
              <input
                type="color"
                value={localField}
                onChange={(e) => setLocalField(e.target.value)}
                className="h-8 w-20 bg-gray-700 rounded"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-gray-300">
              라인 색
              <input
                type="color"
                value={localLine}
                onChange={(e) => setLocalLine(e.target.value)}
                className="h-8 w-20 bg-gray-700 rounded"
              />
            </label>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-400">팀 색상</h3>
            <label className="flex items-center justify-between text-xs text-gray-300">
              홈 색
              <input
                type="color"
                value={localHome}
                onChange={(e) => setLocalHome(e.target.value)}
                className="h-8 w-20 bg-gray-700 rounded"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-gray-300">
              어웨이 색
              <input
                type="color"
                value={localAway}
                onChange={(e) => setLocalAway(e.target.value)}
                className="h-8 w-20 bg-gray-700 rounded"
              />
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
          <button
            onClick={resetDefaults}
            className="px-3 py-1 text-xs text-gray-200 bg-gray-700 rounded"
          >
            기본값
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setModalOpen(null)}
              className="px-3 py-1 text-xs text-gray-200 bg-gray-700 rounded"
            >
              취소
            </button>
            <button
              onClick={applyChanges}
              className="px-3 py-1 text-xs text-white bg-primary-600 rounded"
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
