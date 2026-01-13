import { Layer } from 'react-konva';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { snapValue } from '@/utils/grid';
import PlayerIcon from '../PlayerIcon';

function PlayerLayer() {
  const { players, selectedObjectId, updatePlayer, snapToGrid } = useTacticalBoardStore();

  const handleSelect = (playerId: string) => {
    useTacticalBoardStore.getState().setSelectedObject(playerId);
  };

  const handleDragEnd = (playerId: string) => (x: number, y: number) => {
    updatePlayer(playerId, {
      x: snapValue(x, snapToGrid),
      y: snapValue(y, snapToGrid),
    });
  };

  return (
    <Layer>
      {players.map((player) => (
        <PlayerIcon
          key={player.id}
          player={player}
          isSelected={selectedObjectId === player.id}
          onSelect={() => handleSelect(player.id)}
          onDragEnd={handleDragEnd(player.id)}
        />
      ))}
    </Layer>
  );
}

export default PlayerLayer;
