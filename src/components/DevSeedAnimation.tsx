import { useEffect } from 'react';
import { useAnimationStore } from '@/store/animationStore';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { Player } from '@/types/player';
import { Shape } from '@/types/shape';

function DevSeedAnimation() {
  const { animations, addAnimation } = useAnimationStore();
  const { players, setPlayers, setShapes } = useTacticalBoardStore();

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    if (animations.length > 0 || players.length > 0) {
      return;
    }

    const basePlayers: Player[] = [
      {
        id: 'player-dev-1',
        number: 10,
        name: 'Demo',
        position: 'MF',
        team: 'home',
        color: '#e63946',
        x: 320,
        y: 240,
      },
      {
        id: 'player-dev-2',
        number: 7,
        name: 'Test',
        position: 'FW',
        team: 'away',
        color: '#457b9d',
        x: 520,
        y: 360,
      },
    ];

    const keyframes = [
      {
        time: 0,
        players: basePlayers,
        shapes: [] as Shape[],
      },
      {
        time: 4,
        players: [
          { ...basePlayers[0], x: 620, y: 260 },
          { ...basePlayers[1], x: 300, y: 420 },
        ],
        shapes: [] as Shape[],
      },
      {
        time: 8,
        players: [
          { ...basePlayers[0], x: 780, y: 480 },
          { ...basePlayers[1], x: 440, y: 180 },
        ],
        shapes: [] as Shape[],
      },
    ];

    addAnimation({
      id: 'animation-dev',
      name: 'Demo Animation',
      keyframes,
      duration: 8,
      loop: true,
    });

    setPlayers(basePlayers);
    setShapes([]);
  }, [animations.length, players.length, addAnimation, setPlayers, setShapes]);

  return null;
}

export default DevSeedAnimation;
