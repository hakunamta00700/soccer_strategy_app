import { Layer, Line, Circle, Group } from 'react-konva';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useAnimationStore } from '@/store/animationStore';
import { Player } from '@/types/player';

type PathPoint = { x: number; y: number };

const buildPlayerPaths = (playersByFrame: Player[][]) => {
  const playerIds = new Set<string>();

  playersByFrame.forEach((players) => {
    players.forEach((player) => playerIds.add(player.id));
  });

  const paths: Record<string, PathPoint[]> = {};
  playerIds.forEach((id) => {
    paths[id] = [];
  });

  playersByFrame.forEach((players) => {
    const frameMap = new Map(players.map((player) => [player.id, player]));
    playerIds.forEach((id) => {
      const player = frameMap.get(id);
      if (player) {
        paths[id].push({ x: player.x, y: player.y });
      }
    });
  });

  return paths;
};

interface PathLayerProps {
  transform?: { rotation: number; x: number; y: number };
}

function PathLayer({ transform }: PathLayerProps) {
  const { pathVisible } = useTacticalBoardStore();
  const { animations } = useAnimationStore();

  if (!pathVisible || animations.length === 0) {
    return null;
  }

  const animation = animations[0];
  const playersByFrame = animation.keyframes.map((frame) => frame.players);
  const paths = buildPlayerPaths(playersByFrame);

  return (
    <Layer>
      <Group rotation={transform?.rotation ?? 0} x={transform?.x ?? 0} y={transform?.y ?? 0}>
      {Object.entries(paths).map(([playerId, points]) => {
        if (points.length < 2) {
          return null;
        }

        const flatPoints = points.flatMap((point) => [point.x, point.y]);

        return (
          <Line
            key={`path-${playerId}`}
            points={flatPoints}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={2}
            dash={[6, 6]}
          />
        );
      })}
      {Object.entries(paths).flatMap(([playerId, points]) =>
        points.map((point, index) => (
          <Circle
            key={`path-point-${playerId}-${index}`}
            x={point.x}
            y={point.y}
            radius={3}
            fill="rgba(255,255,255,0.8)"
          />
        ))
      )}
      </Group>
    </Layer>
  );
}

export default PathLayer;
