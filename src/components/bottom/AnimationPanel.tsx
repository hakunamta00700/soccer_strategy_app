import { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimationStore } from '@/store/animationStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { Animation, Keyframe } from '@/types/animation';
import { Player } from '@/types/player';
import { Shape } from '@/types/shape';

const clonePlayers = (players: Player[]) => players.map((player) => ({ ...player }));

const cloneShapes = (shapes: Shape[]) =>
  shapes.map((shape) => ({
    ...shape,
    points: [...shape.points],
    dash: shape.dash ? [...shape.dash] : undefined,
  }));

const sortKeyframes = (keyframes: Keyframe[]) =>
  [...keyframes].sort((a, b) => a.time - b.time);

const getDuration = (keyframes: Keyframe[], fallback: number) => {
  if (keyframes.length === 0) {
    return fallback;
  }

  return Math.max(fallback, ...keyframes.map((frame) => frame.time));
};

const interpolatePlayers = (start: Player, end: Player, t: number) => ({
  ...start,
  x: start.x + (end.x - start.x) * t,
  y: start.y + (end.y - start.y) * t,
  rotation: (start.rotation ?? 0) + ((end.rotation ?? 0) - (start.rotation ?? 0)) * t,
});

const interpolateValue = (start: number, end: number, t: number) => start + (end - start) * t;

const interpolatePoints = (start: number[], end: number[], t: number) => {
  if (start.length !== end.length) {
    return start;
  }

  return start.map((value, index) => interpolateValue(value, end[index], t));
};

const interpolateShape = (start: Shape, end: Shape, t: number) => ({
  ...start,
  points: interpolatePoints(start.points, end.points, t),
});

const getInterpolatedFrame = (animation: Animation, time: number) => {
  const sorted = sortKeyframes(animation.keyframes);

  if (sorted.length === 0) {
    return { players: [], shapes: [] };
  }

  if (time <= sorted[0].time) {
    return sorted[0];
  }

  if (time >= sorted[sorted.length - 1].time) {
    return sorted[sorted.length - 1];
  }

  const nextIndex = sorted.findIndex((frame) => frame.time >= time);
  const prev = sorted[Math.max(0, nextIndex - 1)];
  const next = sorted[nextIndex];
  const span = Math.max(0.001, next.time - prev.time);
  const t = Math.min(1, Math.max(0, (time - prev.time) / span));

  const prevPlayers = new Map(prev.players.map((player) => [player.id, player]));
  const nextPlayers = new Map(next.players.map((player) => [player.id, player]));
  const playerIds = new Set([...prevPlayers.keys(), ...nextPlayers.keys()]);

  const players = Array.from(playerIds).map((id) => {
    const start = prevPlayers.get(id);
    const end = nextPlayers.get(id);

    if (start && end) {
      return interpolatePlayers(start, end, t);
    }

    return start ? { ...start } : { ...(end as Player) };
  });

  const prevShapes = new Map(prev.shapes.map((shape) => [shape.id, shape]));
  const nextShapes = new Map(next.shapes.map((shape) => [shape.id, shape]));
  const shapeIds = new Set([...prevShapes.keys(), ...nextShapes.keys()]);

  const shapes = Array.from(shapeIds).map((id) => {
    const start = prevShapes.get(id);
    const end = nextShapes.get(id);

    if (start && end && start.type === end.type) {
      return interpolateShape(start, end, t);
    }

    return start ? cloneShapes([start])[0] : cloneShapes([end as Shape])[0];
  });

  return {
    time,
    players,
    shapes,
  };
};

function AnimationPanel() {
  const {
    animations,
    addAnimation,
    updateAnimation,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    playbackSpeed,
    setPlaybackSpeed,
  } = useAnimationStore();
  const { players, shapes, setPlayers, setShapes } = useTacticalBoardStore();

  const activeAnimation = animations[0] ?? null;
  const activeRef = useRef<Animation | null>(activeAnimation);
  const timeRef = useRef(currentTime);
  const [panelHeight, setPanelHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef(0);
  const resizeStartHeight = useRef(200);
  const MIN_HEIGHT = 140;
  const MAX_HEIGHT = 420;

  useEffect(() => {
    activeRef.current = activeAnimation;
  }, [activeAnimation]);

  useEffect(() => {
    timeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const delta = resizeStartY.current - event.clientY;
      const nextHeight = Math.max(
        MIN_HEIGHT,
        Math.min(MAX_HEIGHT, resizeStartHeight.current + delta)
      );
      setPanelHeight(nextHeight);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const animation = activeRef.current;
      if (!animation) {
        setIsPlaying(false);
        return;
      }

      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const duration = Math.max(0.1, animation.duration);
      let nextTime = timeRef.current + delta * playbackSpeed;

      if (nextTime > duration) {
        if (animation.loop) {
          nextTime = 0;
        } else {
          nextTime = duration;
          setIsPlaying(false);
        }
      }

      setCurrentTime(nextTime);
      const frame = getInterpolatedFrame(animation, nextTime);
      setPlayers(clonePlayers(frame.players));
      setShapes(cloneShapes(frame.shapes));

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, playbackSpeed, setCurrentTime, setIsPlaying, setPlayers, setShapes]);

  const handleCreateAnimation = () => {
    if (activeAnimation) {
      return;
    }

    const newAnimation: Animation = {
      id: `animation-${Date.now()}`,
      name: '기본 애니메이션',
      keyframes: [],
      duration: 10,
      loop: true,
    };
    addAnimation(newAnimation);
  };

  const handleAddKeyframe = () => {
    const animation = activeRef.current;
    const time = currentTime;
    const frame: Keyframe = {
      time,
      players: clonePlayers(players),
      shapes: cloneShapes(shapes),
    };

    if (!animation) {
      addAnimation({
        id: `animation-${Date.now()}`,
        name: '기본 애니메이션',
        keyframes: [frame],
        duration: Math.max(10, time),
        loop: true,
      });
      return;
    }

    const keyframes = sortKeyframes([...animation.keyframes, frame]);
    updateAnimation(animation.id, {
      keyframes,
      duration: getDuration(keyframes, animation.duration),
    });
  };

  const handleUpdateKeyframeTime = (index: number, time: number) => {
    if (!activeAnimation) {
      return;
    }

    const keyframes = activeAnimation.keyframes.map((frame, frameIndex) =>
      frameIndex === index ? { ...frame, time } : frame
    );
    const sorted = sortKeyframes(keyframes);
    updateAnimation(activeAnimation.id, {
      keyframes: sorted,
      duration: getDuration(sorted, activeAnimation.duration),
    });
  };

  const handleApplyKeyframe = (frame: Keyframe) => {
    setCurrentTime(frame.time);
    setPlayers(clonePlayers(frame.players));
    setShapes(cloneShapes(frame.shapes));
  };

  const handleRemoveKeyframe = (index: number) => {
    if (!activeAnimation) {
      return;
    }

    const keyframes = activeAnimation.keyframes.filter((_, frameIndex) => frameIndex !== index);
    const sorted = sortKeyframes(keyframes);
    updateAnimation(activeAnimation.id, {
      keyframes: sorted,
      duration: getDuration(sorted, activeAnimation.duration),
    });
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);

    if (activeAnimation && activeAnimation.keyframes.length > 0) {
      handleApplyKeyframe(sortKeyframes(activeAnimation.keyframes)[0]);
    }
  };

  const handleScrub = (time: number) => {
    setCurrentTime(time);
    if (activeAnimation) {
      const frame = getInterpolatedFrame(activeAnimation, time);
      setPlayers(clonePlayers(frame.players));
      setShapes(cloneShapes(frame.shapes));
    }
  };

  const keyframes = useMemo(
    () => (activeAnimation ? sortKeyframes(activeAnimation.keyframes) : []),
    [activeAnimation]
  );
  const duration = activeAnimation?.duration ?? 10;
  const timelinePercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const clampPercent = (time: number) =>
    duration > 0 ? Math.min(100, Math.max(0, (time / duration) * 100)) : 0;

  const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    resizeStartY.current = event.clientY;
    resizeStartHeight.current = panelHeight;
    setIsResizing(true);
  };

  return (
    <div
      className="bg-gray-800 border-t border-gray-700 relative overflow-y-auto"
      style={{ height: panelHeight }}
    >
      <div
        onPointerDown={handleResizeStart}
        className="absolute top-0 left-0 right-0 h-2 cursor-row-resize bg-gray-700/70"
        aria-label="애니메이션 패널 크기 조절"
      />
      <div className="h-full px-4 pb-4 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">애니메이션</h3>
          {!activeAnimation && (
            <button
              onClick={handleCreateAnimation}
              className="px-2 py-1 bg-gray-700 text-xs text-white rounded"
            >
              애니메이션 생성
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={handleAddKeyframe}
            className="px-2 py-2 bg-primary-600 text-xs text-white rounded"
          >
            키프레임 추가
          </button>
          <button
            onClick={() => setIsPlaying(true)}
            disabled={!activeAnimation || isPlaying}
            className="px-2 py-2 bg-gray-700 text-xs text-white rounded disabled:opacity-40"
          >
            재생
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            disabled={!activeAnimation || !isPlaying}
            className="px-2 py-2 bg-gray-700 text-xs text-white rounded disabled:opacity-40"
          >
            일시정지
          </button>
          <button
            onClick={handleStop}
            disabled={!activeAnimation}
            className="px-2 py-2 bg-gray-700 text-xs text-white rounded disabled:opacity-40"
          >
            정지
          </button>
          <div className="flex items-center gap-2 bg-gray-700 rounded px-2">
            <span className="text-xs text-gray-300">배속</span>
            <input
              type="number"
              min={0.1}
              max={3}
              step={0.1}
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Math.max(0.1, Number(e.target.value)))}
              className="w-12 bg-transparent text-xs text-white text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-gray-300">
          <label className="flex items-center gap-2 bg-gray-700 rounded px-2 py-1">
            현재 시간
            <input
              type="number"
              min={0}
              step={0.1}
              value={currentTime.toFixed(1)}
              onChange={(e) => handleScrub(Number(e.target.value))}
              className="ml-auto w-14 bg-transparent text-right text-white"
            />
          </label>
          <label className="flex items-center gap-2 bg-gray-700 rounded px-2 py-1">
            길이
            <input
              type="number"
              min={1}
              step={0.5}
              value={activeAnimation?.duration ?? 10}
              onChange={(e) =>
                activeAnimation &&
                updateAnimation(activeAnimation.id, {
                  duration: Math.max(1, Number(e.target.value)),
                })
              }
              className="ml-auto w-14 bg-transparent text-right text-white"
            />
          </label>
          <label className="flex items-center gap-2 bg-gray-700 rounded px-2 py-1">
            반복
            <input
              type="checkbox"
              checked={activeAnimation?.loop ?? false}
              onChange={(e) =>
                activeAnimation && updateAnimation(activeAnimation.id, { loop: e.target.checked })
              }
              className="ml-auto"
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="relative h-6 bg-gray-700 rounded">
            <div
              className="absolute top-0 left-0 h-full bg-primary-600/40 rounded"
              style={{ width: `${timelinePercent}%` }}
            />
            <div
              className="absolute top-0 h-full w-0.5 bg-white"
              style={{ left: `${timelinePercent}%` }}
            />
            {keyframes.map((frame, index) => (
              <button
                key={`marker-${index}`}
                onClick={() => handleApplyKeyframe(frame)}
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-yellow-400 border border-gray-900"
                style={{ left: `calc(${clampPercent(frame.time)}% - 6px)` }}
                aria-label={`키프레임 ${index + 1}`}
              />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleScrub(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="max-h-28 overflow-y-auto space-y-2">
          {keyframes.length === 0 ? (
            <div className="text-xs text-gray-400">키프레임이 없습니다.</div>
          ) : (
            keyframes.map((frame, index) => (
              <div
                key={`frame-${index}`}
                className="flex items-center gap-2 bg-gray-700 rounded px-2 py-1"
              >
                <span className="text-xs text-gray-300">#{index + 1}</span>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={frame.time}
                  onChange={(e) => handleUpdateKeyframeTime(index, Number(e.target.value))}
                  className="w-16 bg-transparent text-xs text-white text-right"
                />
                <button
                  onClick={() => handleApplyKeyframe(frame)}
                  className="ml-auto px-2 py-1 text-xs text-white bg-gray-600 rounded"
                >
                  적용
                </button>
                <button
                  onClick={() => handleRemoveKeyframe(index)}
                  className="px-2 py-1 text-xs text-white bg-red-600 rounded"
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimationPanel;
