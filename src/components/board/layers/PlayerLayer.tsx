import { Layer, Group } from 'react-konva';
import { useRef } from 'react';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';
import { snapValue } from '@/utils/grid';
import PlayerIcon from '../PlayerIcon';

interface PlayerLayerProps {
  transform?: { rotation: number; x: number; y: number };
}

function PlayerLayer({ transform }: PlayerLayerProps) {
  const {
    players,
    selectedObjectId,
    selectedPlayerIds,
    updatePlayer,
    setPlayers,
    setPlayersWithHistory,
    snapToGrid,
    setSelectedPlayers,
    toggleSelectedPlayer,
  } = useTacticalBoardStore();
  const { playerViewMode, positionFilter, activeTool } = useUIStore();
  const dragSelectionRef = useRef<{
    ids: string[];
    startPositions: Map<string, { x: number; y: number }>;
    anchorId: string;
  } | null>(null);
  const dragRaf = useRef<number | null>(null);
  const isShapeSelected =
    selectedObjectId !== null &&
    !players.some((player) => player.id === selectedObjectId);

  const handleSelect = (playerId: string, event: any) => {
    if (activeTool || isShapeSelected) {
      return;
    }
    const isMulti = event?.evt?.shiftKey;
    if (isMulti) {
      toggleSelectedPlayer(playerId);
    } else {
      setSelectedPlayers([playerId]);
    }
  };

  const handleDragEnd = (playerId: string) => (x: number, y: number) => {
    const dragState = dragSelectionRef.current;
    if (!dragState) {
      updatePlayer(playerId, {
        x: snapValue(x, snapToGrid),
        y: snapValue(y, snapToGrid),
      });
      return;
    }

    const anchorStart = dragState.startPositions.get(dragState.anchorId);
    if (!anchorStart) {
      dragSelectionRef.current = null;
      return;
    }

    const deltaX = snapValue(x, snapToGrid) - anchorStart.x;
    const deltaY = snapValue(y, snapToGrid) - anchorStart.y;

    const nextPlayers = useTacticalBoardStore.getState().players.map((player) => {
      const start = dragState.startPositions.get(player.id);
      if (!start || !dragState.ids.includes(player.id)) {
        return player;
      }
      return {
        ...player,
        x: snapValue(start.x + deltaX, snapToGrid),
        y: snapValue(start.y + deltaY, snapToGrid),
      };
    });

    setPlayersWithHistory(nextPlayers);
    dragSelectionRef.current = null;
    if (dragRaf.current) {
      cancelAnimationFrame(dragRaf.current);
      dragRaf.current = null;
    }
  };

  const handleDragStart = (playerId: string) => (x: number, y: number) => {
    const selection = selectedPlayerIds.includes(playerId)
      ? selectedPlayerIds
      : [playerId];
    if (!selectedPlayerIds.includes(playerId)) {
      setSelectedPlayers([playerId]);
    }

    const startPositions = new Map<string, { x: number; y: number }>();
    useTacticalBoardStore.getState().players.forEach((player) => {
      if (selection.includes(player.id)) {
        startPositions.set(player.id, { x: player.x, y: player.y });
      }
    });

    dragSelectionRef.current = {
      ids: selection,
      startPositions,
      anchorId: playerId,
    };
  };

  const handleDragMove = (playerId: string) => (x: number, y: number) => {
    const dragState = dragSelectionRef.current;
    if (!dragState || dragState.anchorId !== playerId) {
      return;
    }

    const anchorStart = dragState.startPositions.get(playerId);
    if (!anchorStart) {
      return;
    }

    const deltaX = x - anchorStart.x;
    const deltaY = y - anchorStart.y;

    if (dragRaf.current) {
      cancelAnimationFrame(dragRaf.current);
    }

    dragRaf.current = requestAnimationFrame(() => {
      const nextPlayers = useTacticalBoardStore.getState().players.map((player) => {
        const start = dragState.startPositions.get(player.id);
        if (!start || !dragState.ids.includes(player.id)) {
          return player;
        }
        return {
          ...player,
          x: snapValue(start.x + deltaX, snapToGrid),
          y: snapValue(start.y + deltaY, snapToGrid),
        };
      });
      setPlayers(nextPlayers);
    });
  };

  return (
    <Layer>
      <Group rotation={transform?.rotation ?? 0} x={transform?.x ?? 0} y={transform?.y ?? 0}>
        {players
        .filter((player) => positionFilter.includes(player.position))
        .map((player) => (
          <PlayerIcon
            key={player.id}
            player={player}
            isSelected={
              selectedPlayerIds.includes(player.id) || selectedObjectId === player.id
            }
            viewMode={playerViewMode}
            onSelect={(event) => handleSelect(player.id, event)}
            onDragStart={handleDragStart(player.id)}
            onDragMove={handleDragMove(player.id)}
            onDragEnd={handleDragEnd(player.id)}
          />
        ))}
      </Group>
    </Layer>
  );
}

export default PlayerLayer;
