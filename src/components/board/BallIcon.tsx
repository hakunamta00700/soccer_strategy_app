import { Group, Circle } from 'react-konva';
import { Ball } from '@/types/ball';

interface BallIconProps {
  ball: Ball;
  isSelected?: boolean;
  onSelect?: () => void;
  onDragEnd?: (x: number, y: number) => void;
}

function BallIcon({ ball, isSelected = false, onSelect, onDragEnd }: BallIconProps) {
  const handleDragEnd = (e: any) => {
    onDragEnd?.(e.target.x(), e.target.y());
  };

  const handleSelect = (e: any) => {
    e.cancelBubble = true;
    onSelect?.();
  };

  return (
    <Group
      x={ball.x}
      y={ball.y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={handleSelect}
      onTap={handleSelect}
    >
      <Circle
        radius={ball.radius}
        fill={ball.color}
        stroke={isSelected ? '#facc15' : ball.strokeColor ?? '#111827'}
        strokeWidth={isSelected ? 3 : 2}
      />
      <Circle radius={ball.radius * 0.35} fill="#111827" opacity={0.8} />
    </Group>
  );
}

export default BallIcon;
