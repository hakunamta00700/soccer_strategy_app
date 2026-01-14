import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import AnimationPanel from './AnimationPanel';
import { useUIStore } from '@/store/uiStore';

function BottomPanel() {
  const { animationPanelEnabled } = useUIStore();
  const { selectedObjectId, players, balls, shapes, updateShape, removeSelectedObject } =
    useTacticalBoardStore();
  const selectedPlayer = players.find((p) => p.id === selectedObjectId);
  const selectedBall = balls.find((ball) => ball.id === selectedObjectId);
  const selectedShape = shapes.find((shape) => shape.id === selectedObjectId);

  const panels: React.ReactNode[] = [];

  if (animationPanelEnabled) {
    panels.push(<AnimationPanel key="animation" />);
  }

  if (selectedShape && selectedShape.type === 'arrow') {
    const dashStyle = selectedShape.dash ? 'dashed' : 'solid';

    panels.push(
      <div key="arrow-settings" className="h-[200px] bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">화살표 설정</h3>
          <button
            onClick={removeSelectedObject}
            className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            삭제
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">색상</label>
            <input
              type="color"
              value={selectedShape.color}
              onChange={(e) => updateShape(selectedShape.id, { color: e.target.value })}
              className="w-full h-8 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">두께</label>
            <input
              type="number"
              min={1}
              max={12}
              value={selectedShape.strokeWidth}
              onChange={(e) =>
                updateShape(selectedShape.id, { strokeWidth: Math.max(1, Number(e.target.value)) })
              }
              className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">스타일</label>
            <select
              value={dashStyle}
              onChange={(e) =>
                updateShape(selectedShape.id, {
                  dash: e.target.value === 'dashed' ? [8, 6] : undefined,
                })
              }
              className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
            >
              <option value="solid">실선</option>
              <option value="dashed">점선</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">촉 길이</label>
            <input
              type="number"
              min={4}
              max={30}
              value={selectedShape.pointerLength ?? 10}
              onChange={(e) =>
                updateShape(selectedShape.id, {
                  pointerLength: Math.max(4, Number(e.target.value)),
                })
              }
              className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">촉 폭</label>
            <input
              type="number"
              min={4}
              max={30}
              value={selectedShape.pointerWidth ?? 10}
              onChange={(e) =>
                updateShape(selectedShape.id, {
                  pointerWidth: Math.max(4, Number(e.target.value)),
                })
              }
              className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  if (selectedShape) {
    panels.push(
      <div key="shape-settings" className="h-[200px] bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">선택된 도형: {selectedShape.type}</div>
          <button
            onClick={removeSelectedObject}
            className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    );
  }

  if (selectedBall) {
    return null;
  }

  if (panels.length === 0) {
    return null;
  }

  return <div className="flex flex-col gap-0">{panels}</div>;
}

export default BottomPanel;
