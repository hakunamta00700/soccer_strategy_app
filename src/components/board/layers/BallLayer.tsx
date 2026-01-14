import { Layer } from 'react-konva';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { snapValue } from '@/utils/grid';
import BallIcon from '../BallIcon';

function BallLayer() {
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
      {balls.map((ball) => (
        <BallIcon
          key={ball.id}
          ball={ball}
          isSelected={selectedObjectId === ball.id}
          onSelect={() => handleSelect(ball.id)}
          onDragEnd={handleDragEnd(ball.id)}
        />
      ))}
    </Layer>
  );
}

export default BallLayer;
