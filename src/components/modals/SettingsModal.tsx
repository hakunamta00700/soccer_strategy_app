import { useRef, useState, ChangeEvent } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useSessionStore } from '@/store/sessionStore';
import { FIELD_COLOR, LINE_COLOR } from '@/constants/field';
import {
  downloadJson,
  exportBackup,
  exportCurrentSession,
  exportCurrentTactic,
  importPayload,
} from '@/services/dataExchange';
import { downloadDataUrl, exportBoardImage } from '@/services/boardExport';

function SettingsModal() {
  const {
    setModalOpen,
    playerInfoLocation,
    setPlayerInfoLocation,
    playerInfoVisible,
    setPlayerInfoVisible,
    animationPanelEnabled,
    setAnimationPanelEnabled,
  } = useUIStore();
  const { sessions, currentSessionId, currentTacticId } = useSessionStore();
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
  const [importMode, setImportMode] = useState<'merge' | 'overwrite'>('merge');
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg'>('png');
  const [imageScale, setImageScale] = useState<'1x' | '2x'>('1x');
  const [includeBackground, setIncludeBackground] = useState(true);
  const [imageQuality, setImageQuality] = useState(0.92);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentSession = sessions.find((session) => session.id === currentSessionId) ?? null;
  const currentTactic =
    currentSession?.tactics.find((tactic) => tactic.id === currentTacticId) ??
    currentSession?.tactics[0] ??
    null;

  const formatTimestamp = () =>
    new Date().toISOString().replace(/[:.]/g, '-');

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

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

  const handleExportSession = () => {
    const payload = exportCurrentSession();
    if (!payload || !currentSession) {
      alert('내보낼 세션이 없습니다.');
      return;
    }
    const filename = `session-${slugify(currentSession.name)}-${formatTimestamp()}.json`;
    downloadJson(payload, filename);
  };

  const handleExportTactic = () => {
    const payload = exportCurrentTactic();
    if (!payload || !currentTactic) {
      alert('내보낼 전술이 없습니다.');
      return;
    }
    const filename = `tactic-${slugify(currentTactic.name)}-${formatTimestamp()}.json`;
    downloadJson(payload, filename);
  };

  const handleExportBackup = () => {
    const payload = exportBackup();
    const filename = `backup-${formatTimestamp()}.json`;
    downloadJson(payload, filename);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed?.type) {
        throw new Error('invalid');
      }
      const success = await importPayload(parsed, importMode);
      if (!success) {
        alert('가져오기에 실패했습니다.');
      }
    } catch (error) {
      alert('JSON 파일을 확인해주세요.');
    } finally {
      event.target.value = '';
    }
  };

  const handleExportImage = () => {
    const dataUrl = exportBoardImage({
      format: imageFormat,
      pixelRatio: imageScale === '2x' ? 2 : 1,
      includeBackground,
      quality: imageFormat === 'jpg' ? imageQuality : undefined,
    });

    if (!dataUrl) {
      alert('보드 이미지를 찾을 수 없습니다.');
      return;
    }

    const filename = `board-${formatTimestamp()}.${imageFormat}`;
    downloadDataUrl(dataUrl, filename);
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

          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-400">선수 정보 패널</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPlayerInfoLocation('sidebar')}
                className={`px-2 py-2 rounded text-xs ${
                  playerInfoLocation === 'sidebar'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                오른쪽 패널
              </button>
              <button
                onClick={() => setPlayerInfoLocation('modal')}
                className={`px-2 py-2 rounded text-xs ${
                  playerInfoLocation === 'modal'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                팝업
              </button>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={playerInfoVisible}
                onChange={(e) => setPlayerInfoVisible(e.target.checked)}
                className="rounded"
              />
              선수 정보 패널 표시
            </label>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-400">애니메이션 패널</h3>
            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={animationPanelEnabled}
                onChange={(e) => setAnimationPanelEnabled(e.target.checked)}
                className="rounded"
              />
              애니메이션 패널 표시
            </label>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-400">데이터 관리</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleExportSession}
                className="px-2 py-2 rounded text-xs bg-gray-700 text-gray-200"
              >
                세션 내보내기
              </button>
              <button
                onClick={handleExportTactic}
                className="px-2 py-2 rounded text-xs bg-gray-700 text-gray-200"
              >
                전술 내보내기
              </button>
              <button
                onClick={handleExportBackup}
                className="px-2 py-2 rounded text-xs bg-gray-700 text-gray-200"
              >
                전체 백업
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={importMode}
                onChange={(e) => setImportMode(e.target.value as 'merge' | 'overwrite')}
                className="flex-1 px-2 py-2 text-xs bg-gray-700 text-gray-200 rounded"
              >
                <option value="merge">병합 가져오기</option>
                <option value="overwrite">덮어쓰기</option>
              </select>
              <button
                onClick={handleImportClick}
                className="px-3 py-2 rounded text-xs bg-primary-600 text-white"
              >
                JSON 가져오기
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
            <div className="text-[11px] text-gray-400">
              세션/전술/백업 JSON 모두 지원합니다.
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-400">이미지 내보내기</h3>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={imageFormat}
                onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpg')}
                className="px-2 py-2 text-xs bg-gray-700 text-gray-200 rounded"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
              <select
                value={imageScale}
                onChange={(e) => setImageScale(e.target.value as '1x' | '2x')}
                className="px-2 py-2 text-xs bg-gray-700 text-gray-200 rounded"
              >
                <option value="1x">기본 해상도</option>
                <option value="2x">고해상도</option>
              </select>
            </div>
            {imageFormat === 'jpg' && (
              <label className="flex items-center justify-between text-xs text-gray-300">
                JPG 품질
                <input
                  type="range"
                  min={0.6}
                  max={1}
                  step={0.05}
                  value={imageQuality}
                  onChange={(e) => setImageQuality(Number(e.target.value))}
                  className="w-24"
                />
              </label>
            )}
            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={includeBackground}
                onChange={(e) => setIncludeBackground(e.target.checked)}
                className="rounded"
              />
              배경 포함
            </label>
            <button
              onClick={handleExportImage}
              className="w-full px-3 py-2 rounded text-xs bg-primary-600 text-white"
            >
              이미지로 저장
            </button>
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
