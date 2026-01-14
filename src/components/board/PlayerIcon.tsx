import { Group, Circle, Text } from 'react-konva';
import { useEffect, useMemo, useState } from 'react';
import { Player as PlayerType } from '@/types/player';
import { PlayerViewMode } from '@/store/uiStore';

interface PlayerProps {
  player: PlayerType;
  isSelected?: boolean;
  viewMode: PlayerViewMode;
  onSelect?: (event: any) => void;
  onDragEnd?: (x: number, y: number) => void;
  onDragStart?: (x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
}

const loadImage = (url?: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }

    const tryLoad = (useCors: boolean) =>
      new Promise<HTMLImageElement | null>((innerResolve) => {
        const img = new window.Image();
        img.referrerPolicy = 'no-referrer';
        if (useCors) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => innerResolve(img);
        img.onerror = () => innerResolve(null);
        img.src = url;
      });

    tryLoad(true).then((img) => {
      if (img) {
        resolve(img);
        return;
      }
      tryLoad(false).then(resolve);
    });
  });

function PlayerIcon({
  player,
  isSelected = false,
  viewMode,
  onSelect,
  onDragEnd,
  onDragStart,
  onDragMove,
}: PlayerProps) {
  const [avatar, setAvatar] = useState<HTMLImageElement | null>(null);

  const avatarPattern = useMemo(() => {
    if (!avatar) {
      return null;
    }

    const size = 36;
    const scale = Math.max(size / avatar.width, size / avatar.height);
    const offsetX = (avatar.width - size / scale) / 2;
    const offsetY = (avatar.height - size / scale) / 2;

    return { scale, offsetX, offsetY };
  }, [avatar]);

  useEffect(() => {
    let isMounted = true;
    loadImage(player.imgUrl).then((img) => {
      if (isMounted) {
        setAvatar(img);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [player.imgUrl]);

  const handleDragEnd = (e: any) => {
    onDragEnd?.(e.target.x(), e.target.y());
  };

  const handleDragStart = (e: any) => {
    onDragStart?.(e.target.x(), e.target.y());
  };

  const handleDragMove = (e: any) => {
    onDragMove?.(e.target.x(), e.target.y());
  };

  const handleSelect = (e: any) => {
    e.cancelBubble = true;
    onSelect?.(e);
  };

  return (
    <Group
      x={player.x}
      y={player.y}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleSelect}
      onTap={handleSelect}
    >
      {viewMode === 'photo' ? (
        <>
          <Circle
            radius={22}
            fill={player.color}
            stroke={isSelected ? '#facc15' : 'white'}
            strokeWidth={isSelected ? 3 : 2}
          />
          <Circle
            radius={18}
            fill={avatar ? undefined : 'rgba(17, 24, 39, 0.6)'}
            fillPatternImage={avatar ?? undefined}
            fillPatternRepeat="no-repeat"
            fillPatternScaleX={avatarPattern?.scale ?? 1}
            fillPatternScaleY={avatarPattern?.scale ?? 1}
            fillPatternOffsetX={avatarPattern?.offsetX ?? 0}
            fillPatternOffsetY={avatarPattern?.offsetY ?? 0}
            fillPatternX={-18}
            fillPatternY={-18}
          />
          <Text
            text={player.name}
            x={-30}
            y={26}
            width={60}
            align="center"
            fontSize={10}
            fontFamily="Arial, sans-serif"
            fill="white"
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </Group>
  );
}

export default PlayerIcon;
