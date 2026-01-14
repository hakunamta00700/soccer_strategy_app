import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';
import { Player } from '@/types/player';

type PanelVariant = 'modal' | 'sidebar';

function PlayerInfoPanel({ variant }: { variant: PanelVariant }) {
  const {
    selectedObjectId,
    selectedPlayerIds,
    players,
    updatePlayer,
    removeSelectedObject,
  } = useTacticalBoardStore();
  const { setModalOpen } = useUIStore();

  if (!selectedObjectId || selectedPlayerIds.length !== 1) {
    return null;
  }

  const selectedPlayer = players.find((player) => player.id === selectedObjectId);
  if (!selectedPlayer) {
    return null;
  }

  const handlePlayerUpdate = (field: keyof Player, value: Player[keyof Player]) => {
    updatePlayer(selectedPlayer.id, { [field]: value });
  };

  const content = (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedPlayer.color }} />
          <h3 className="text-sm font-medium text-white">
            선수 #{selectedPlayer.number} {selectedPlayer.name}
          </h3>
        </div>
        {variant === 'modal' && (
          <button
            onClick={() => setModalOpen(null)}
            className="text-gray-400 hover:text-white"
            aria-label="닫기"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
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

  if (variant === 'sidebar') {
    return (
      <div className="w-[280px] border-l border-gray-700 bg-gray-900 p-3">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto">{content}</div>
    </div>
  );
}

export default PlayerInfoPanel;
