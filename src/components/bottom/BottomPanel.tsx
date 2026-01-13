import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';
import { Player } from '@/types/player';

function BottomPanel() {
  const { selectedObjectId, players, shapes, updatePlayer, updateShape, removeSelectedObject } =
    useTacticalBoardStore();
  const { activeTool } = useUIStore();

  const selectedPlayer = players.find((p) => p.id === selectedObjectId);
  const selectedShape = shapes.find((shape) => shape.id === selectedObjectId);

  if (!selectedObjectId || (!selectedPlayer && !selectedShape)) {
    return (
      <div className="h-[200px] bg-gray-800 border-t border-gray-700 p-4">
        <div className="text-sm text-gray-400">
          {activeTool ? `도구: ${activeTool}` : '객체를 선택하세요'}
        </div>
      </div>
    );
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

  if (!selectedPlayer) {
    return (
      <div className="h-[200px] bg-gray-800 border-t border-gray-700 p-4">
        <div className="text-sm text-gray-400">객체를 선택하세요</div>
      </div>
    );
  }

  const handlePlayerUpdate = (field: keyof Player, value: Player[keyof Player]) => {
    updatePlayer(selectedPlayer.id, { [field]: value });
  };

  return (
    <div className="h-[200px] bg-gray-800 border-t border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedPlayer.color }} />
        <h3 className="text-sm font-medium text-white">
          선수 #{selectedPlayer.number} {selectedPlayer.name}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">등번호</label>
          <input
            type="number"
            value={selectedPlayer.number}
            onChange={(e) => handlePlayerUpdate('number', parseInt(e.target.value, 10))}
            className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">이름</label>
          <input
            type="text"
            value={selectedPlayer.name}
            onChange={(e) => handlePlayerUpdate('name', e.target.value)}
            className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">포지션</label>
          <select
            value={selectedPlayer.position}
            onChange={(e) => handlePlayerUpdate('position', e.target.value)}
            className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
          >
            <option value="GK">GK</option>
            <option value="DF">DF</option>
            <option value="MF">MF</option>
            <option value="FW">FW</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">색상</label>
          <input
            type="color"
            value={selectedPlayer.color}
            onChange={(e) => handlePlayerUpdate('color', e.target.value)}
            className="w-full px-2 py-1 bg-gray-700 rounded text-sm h-8"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">X 위치</label>
          <input
            type="number"
            value={Math.round(selectedPlayer.x)}
            onChange={(e) => handlePlayerUpdate('x', parseFloat(e.target.value))}
            className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Y 위치</label>
          <input
            type="number"
            value={Math.round(selectedPlayer.y)}
            onChange={(e) => handlePlayerUpdate('y', parseFloat(e.target.value))}
            className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">회전</label>
          <input
            type="number"
            value={selectedPlayer.rotation || 0}
            onChange={(e) => handlePlayerUpdate('rotation', parseFloat(e.target.value))}
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

export default BottomPanel;
