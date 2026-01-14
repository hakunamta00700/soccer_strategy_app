import { useUIStore } from '@/store/uiStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';

function ToolsTab() {
  const {
    activeTool,
    setActiveTool,
    playerViewMode,
    positionFilter,
    setPlayerViewMode,
    setPositionFilter,
    boardOrientation,
    setBoardOrientation,
    arrowColor,
    arrowStrokeWidth,
    arrowStyle,
    arrowPointerLength,
    arrowPointerWidth,
    setArrowColor,
    setArrowStrokeWidth,
    setArrowStyle,
    setArrowPointerLength,
    setArrowPointerWidth,
    freehandColor,
    freehandStrokeWidth,
    freehandOpacity,
    setFreehandColor,
    setFreehandStrokeWidth,
    setFreehandOpacity,
  } = useUIStore();
  const {
    gridVisible,
    snapToGrid,
    setGridVisible,
    setSnapToGrid,
    pathVisible,
    setPathVisible,
    selectedObjectId,
    removeSelectedObject,
    rotateBoard,
    clearShapes,
    clearPlayers,
    clearBoard,
    undo,
    redo,
    past,
    future,
  } = useTacticalBoardStore();

  const tools = [
    { id: 'arrow', label: '화살표', icon: '→' },
    { id: 'line', label: '직선', icon: '─' },
    { id: 'freehand', label: '자유곡선', icon: '✎' },
    { id: 'rect', label: '사각형', icon: '□' },
    { id: 'circle', label: '원', icon: '○' },
    { id: 'text', label: '텍스트', icon: 'T' },
  ] as const;

  const positions = [
    { id: 'GK', label: 'GK' },
    { id: 'DF', label: 'DF' },
    { id: 'MF', label: 'MF' },
    { id: 'FW', label: 'FW' },
  ] as const;

  const togglePosition = (pos: (typeof positions)[number]['id']) => {
    if (positionFilter.includes(pos)) {
      setPositionFilter(positionFilter.filter((item) => item !== pos));
    } else {
      setPositionFilter([...positionFilter, pos]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">그리기 도구</h3>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() =>
                setActiveTool(activeTool === tool.id ? null : (tool.id as any))
              }
              className={`p-3 bg-gray-700 rounded text-sm transition-colors ${
                activeTool === tool.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-lg mb-1">{tool.icon}</div>
              <div>{tool.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">보기 옵션</h3>
        <div className="bg-gray-700 p-3 rounded space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={gridVisible}
              onChange={(e) => setGridVisible(e.target.checked)}
              className="rounded"
            />
            격자 표시
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
              className="rounded"
            />
            스냅
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={pathVisible}
              onChange={(e) => setPathVisible(e.target.checked)}
              className="rounded"
            />
            경로 표시
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">보드 방향</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (boardOrientation === 'landscape') {
                return;
              }
              rotateBoard(false);
              setBoardOrientation('landscape');
            }}
            className={`px-2 py-2 rounded text-xs ${
              boardOrientation === 'landscape'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            가로
          </button>
          <button
            onClick={() => {
              if (boardOrientation === 'portrait') {
                return;
              }
              rotateBoard(true);
              setBoardOrientation('portrait');
            }}
            className={`px-2 py-2 rounded text-xs ${
              boardOrientation === 'portrait'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            세로
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">선수 표시</h3>
        <div className="bg-gray-700 p-3 rounded space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPlayerViewMode('number')}
              className={`px-2 py-2 rounded text-xs ${
                playerViewMode === 'number'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-600 text-gray-200'
              }`}
            >
              등번호
            </button>
            <button
              onClick={() => setPlayerViewMode('photo')}
              className={`px-2 py-2 rounded text-xs ${
                playerViewMode === 'photo'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-600 text-gray-200'
              }`}
            >
              얼굴+이름
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {positions.map((position) => (
              <button
                key={position.id}
                onClick={() => togglePosition(position.id)}
                className={`px-2 py-2 rounded text-xs ${
                  positionFilter.includes(position.id)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-600 text-gray-200'
                }`}
              >
                {position.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTool === 'arrow' && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">화살표 스타일</h3>
          <div className="bg-gray-700 p-3 rounded space-y-3">
            <label className="block text-xs text-gray-400">
              색상
              <input
                type="color"
                value={arrowColor}
                onChange={(e) => setArrowColor(e.target.value)}
                className="mt-1 w-full h-8 bg-gray-600 rounded"
              />
            </label>
            <label className="block text-xs text-gray-400">
              두께
              <input
                type="number"
                min={1}
                max={12}
                value={arrowStrokeWidth}
                onChange={(e) => setArrowStrokeWidth(Math.max(1, Number(e.target.value)))}
                className="mt-1 w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
              />
            </label>
            <label className="block text-xs text-gray-400">
              스타일
              <select
                value={arrowStyle}
                onChange={(e) => setArrowStyle(e.target.value as any)}
                className="mt-1 w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
              >
                <option value="solid">실선</option>
                <option value="dashed">점선</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs text-gray-400">
                촉 길이
                <input
                  type="number"
                  min={4}
                  max={30}
                  value={arrowPointerLength}
                  onChange={(e) =>
                    setArrowPointerLength(Math.max(4, Number(e.target.value)))
                  }
                  className="mt-1 w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
                />
              </label>
              <label className="block text-xs text-gray-400">
                촉 폭
                <input
                  type="number"
                  min={4}
                  max={30}
                  value={arrowPointerWidth}
                  onChange={(e) =>
                    setArrowPointerWidth(Math.max(4, Number(e.target.value)))
                  }
                  className="mt-1 w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'freehand' && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">자유곡선 스타일</h3>
          <div className="bg-gray-700 p-3 rounded space-y-3">
            <label className="block text-xs text-gray-400">
              색상
              <input
                type="color"
                value={freehandColor}
                onChange={(e) => setFreehandColor(e.target.value)}
                className="mt-1 w-full h-8 bg-gray-600 rounded"
              />
            </label>
            <label className="block text-xs text-gray-400">
              두께
              <input
                type="number"
                min={1}
                max={12}
                value={freehandStrokeWidth}
                onChange={(e) =>
                  setFreehandStrokeWidth(Math.max(1, Number(e.target.value)))
                }
                className="mt-1 w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
              />
            </label>
            <label className="block text-xs text-gray-400">
              투명도
              <input
                type="number"
                min={0.1}
                max={1}
                step={0.1}
                value={freehandOpacity}
                onChange={(e) =>
                  setFreehandOpacity(Math.min(1, Math.max(0.1, Number(e.target.value))))
                }
                className="mt-1 w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
              />
            </label>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">편집</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className="px-2 py-2 bg-gray-700 text-sm text-gray-200 rounded disabled:opacity-40"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="px-2 py-2 bg-gray-700 text-sm text-gray-200 rounded disabled:opacity-40"
          >
            Redo
          </button>
          <button
            onClick={removeSelectedObject}
            disabled={!selectedObjectId}
            className="px-2 py-2 bg-red-600 text-sm text-white rounded disabled:opacity-40"
          >
            삭제
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">클리어</h3>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={clearShapes}
            className="px-2 py-2 bg-gray-700 text-sm text-gray-200 rounded"
          >
            도형 모두 클리어
          </button>
          <button
            onClick={clearPlayers}
            className="px-2 py-2 bg-gray-700 text-sm text-gray-200 rounded"
          >
            선수 모두 클리어
          </button>
          <button
            onClick={clearBoard}
            className="px-2 py-2 bg-red-600 text-sm text-white rounded"
          >
            도형 + 선수 모두 클리어
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToolsTab;
