import { Layer } from 'react-konva';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import PlayerIcon from '../PlayerIcon';

function PlayerLayer() {
  const { players, selectedObjectId, updatePlayer } = useTacticalBoardStore();

  const handleSelect = (playerId: string) => {
    useTacticalBoardStore.getState().setSelectedObject(playerId);
  };

  const handleDragEnd = (playerId: string) => (x: number, y: number) => {
    updatePlayer(playerId, { x, y });
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
