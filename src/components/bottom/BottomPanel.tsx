import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { Ball } from '@/types/ball';
import AnimationPanel from './AnimationPanel';
import { useUIStore } from '@/store/uiStore';

function BottomPanel() {
  const { animationPanelVisible } = useUIStore();
  const {
    selectedObjectId,
    players,
    balls,
    shapes,
    updateBall,
    updateShape,
    removeSelectedObject,
  } = useTacticalBoardStore();
  const selectedPlayer = players.find((p) => p.id === selectedObjectId);
  const selectedBall = balls.find((ball) => ball.id === selectedObjectId);
  const selectedShape = shapes.find((shape) => shape.id === selectedObjectId);

  if (!selectedObjectId || (!selectedPlayer && !selectedBall && !selectedShape)) {
    return animationPanelVisible ? <AnimationPanel /> : null;
  }

  if (selectedShape && selectedShape.type === 'arrow') {
    const dashStyle = selectedShape.dash ? 'dashed' : 'solid';

    return (
      <div className="h-[200px] bg-gray-800 border-t border-gray-700 p-4">
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
    return (
      <div className="h-[200px] bg-gray-800 border-t border-gray-700 p-4">
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
    const handleBallUpdate = (field: keyof Ball, value: Ball[keyof Ball]) => {
      updateBall(selectedBall.id, { [field]: value });
    };

    return (
      <div className="h-[200px] bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedBall.color }} />
          <h3 className="text-sm font-medium text-white">축구공 설정</h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">색상</label>
            <input
              type="color"
              value={selectedBall.color}
              onChange={(e) => handleBallUpdate('color', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm h-8"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">반지름</label>
            <input
              type="number"
              min={4}
              max={40}
              value={selectedBall.radius}
              onChange={(e) => handleBallUpdate('radius', Number(e.target.value))}
              className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">X 위치</label>
            <input
              type="number"
              value={Math.round(selectedBall.x)}
              onChange={(e) => handleBallUpdate('x', parseFloat(e.target.value))}
              className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Y 위치</label>
            <input
              type="number"
              value={Math.round(selectedBall.y)}
              onChange={(e) => handleBallUpdate('y', parseFloat(e.target.value))}
              className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={removeSelectedObject}
              className="w-full px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default BottomPanel;
