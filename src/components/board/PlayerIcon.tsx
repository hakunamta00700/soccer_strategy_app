import { Group, Circle, Text } from 'react-konva';
import { Player as PlayerType } from '@/types/player';

interface PlayerProps {
  player: PlayerType;
  isSelected?: boolean;
  onSelect?: () => void;
  onDragEnd?: (x: number, y: number) => void;
}

function PlayerIcon({ player, isSelected = false, onSelect, onDragEnd }: PlayerProps) {
  const handleDragEnd = (e: any) => {
    onDragEnd?.(e.target.x(), e.target.y());
  };

  const handleSelect = (e: any) => {
    e.cancelBubble = true;
    onSelect?.();
  };

  return (
    <Group
      x={player.x}
      y={player.y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={handleSelect}
      onTap={handleSelect}
    >
      <Circle
        radius={20}
        fill={player.color}
        stroke={isSelected ? '#3b82f6' : 'white'}
        strokeWidth={isSelected ? 3 : 2}
      />
      <Text
        text={player.number.toString()}
        x={-10}
        y={-10}
        width={20}
        height={20}
        align="center"
        verticalAlign="middle"
        fontSize={14}
        fontFamily="Arial, sans-serif"
        fill="white"
        fontStyle="bold"
      />
    </Group>
  );
}

export default PlayerIcon;
