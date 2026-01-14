import { Layer, Group } from 'react-konva';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { snapValue } from '@/utils/grid';
import BallIcon from '../BallIcon';

interface BallLayerProps {
  transform?: { rotation: number; x: number; y: number };
}

function BallLayer({ transform }: BallLayerProps) {
  const { balls, selectedObjectId, updateBall, snapToGrid } = useTacticalBoardStore();

  const handleSelect = (ballId: string) => {
    useTacticalBoardStore.getState().setSelectedObject(ballId);
  };

  const handleDragEnd = (ballId: string) => (x: number, y: number) => {
    updateBall(ballId, {
      x: snapValue(x, snapToGrid),
      y: snapValue(y, snapToGrid),
    });
  };

  return (
    <Layer>
      <Group rotation={transform?.rotation ?? 0} x={transform?.x ?? 0} y={transform?.y ?? 0}>
        {balls.map((ball) => (
          <BallIcon
            key={ball.id}
            ball={ball}
            isSelected={selectedObjectId === ball.id}
            onSelect={() => handleSelect(ball.id)}
            onDragEnd={handleDragEnd(ball.id)}
          />
        ))}
      </Group>
    </Layer>
  );
}

export default BallLayer;
