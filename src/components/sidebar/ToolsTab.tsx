import { useUIStore } from '@/store/uiStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';

function ToolsTab() {
  const {
    activeTool,
    setActiveTool,
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
    undo,
    redo,
    past,
    future,
  } = useTacticalBoardStore();

  const tools = [
    { id: 'arrow', label: '화살표', icon: '→' },
    { id: 'line', label: '직선', icon: '─' },
    { id: 'rect', label: '사각형', icon: '□' },
    { id: 'circle', label: '원', icon: '○' },
    { id: 'text', label: '텍스트', icon: 'T' },
  ] as const;

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
    </div>
  );
}

export default ToolsTab;
