import { useMemo, useState } from 'react';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { Player } from '@/types/player';
import { FIELD_HEIGHT, FIELD_WIDTH, PIXELS_PER_METER } from '@/constants/field';
import { snapValue } from '@/utils/grid';

type FormationSide = 'home' | 'away';
type Formation = { id: string; name: string; lines: number[] };

const FORMATIONS: Formation[] = [
  { id: '4-4-2', name: '4-4-2', lines: [4, 4, 2] },
  { id: '4-3-3', name: '4-3-3', lines: [4, 3, 3] },
  { id: '4-2-3-1', name: '4-2-3-1', lines: [4, 2, 3, 1] },
  { id: '3-5-2', name: '3-5-2', lines: [3, 5, 2] },
  { id: '3-4-3', name: '3-4-3', lines: [3, 4, 3] },
  { id: '5-3-2', name: '5-3-2', lines: [5, 3, 2] },
  { id: '5-4-1', name: '5-4-1', lines: [5, 4, 1] },
  { id: '4-4-1-1', name: '4-4-1-1', lines: [4, 4, 1, 1] },
  { id: '4-1-4-1', name: '4-1-4-1', lines: [4, 1, 4, 1] },
  { id: '3-4-2-1', name: '3-4-2-1', lines: [3, 4, 2, 1] },
];

const toPixel = (meters: number) => meters * PIXELS_PER_METER;

const distribute = (count: number, min: number, max: number) => {
  if (count <= 1) {
    return [(min + max) / 2];
  }
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, index) => min + step * index);
};

const getLinePositions = (lines: number, isHome: boolean) => {
  const half = FIELD_WIDTH / 2;
  const margin = 6;
  const start = isHome ? margin : half + margin;
  const end = isHome ? half - margin : FIELD_WIDTH - margin;
  const step = (end - start) / (lines + 1);
  return Array.from({ length: lines }, (_, index) => start + step * (index + 1));
};

const pickPlayers = (
  pool: Player[],
  count: number,
  preferred: Player['position']
) => {
  const matched = pool.filter((player) => player.position === preferred);
  const others = pool.filter((player) => player.position !== preferred);
  const selected = [...matched, ...others].slice(0, count);
  const remainingIds = new Set(selected.map((player) => player.id));
  const remaining = pool.filter((player) => !remainingIds.has(player.id));
  return { selected, remaining };
};

const getLinePositionType = (lineIndex: number, totalLines: number) => {
  if (lineIndex === 0) {
    return 'DF';
  }
  if (lineIndex === totalLines - 1) {
    return 'FW';
  }
  return 'MF';
};

function FormationTab() {
  const { players, setPlayersWithHistory, snapToGrid } = useTacticalBoardStore();
  const [side, setSide] = useState<FormationSide>('home');

  const teamPlayers = useMemo(
    () => players.filter((player) => player.team === side),
    [players, side]
  );

  const applyFormation = (formation: Formation) => {
    if (teamPlayers.length === 0) {
      return;
    }

    const isHome = side === 'home';
    const gk = teamPlayers.filter((player) => player.position === 'GK');
    const outfield = teamPlayers.filter((player) => player.position !== 'GK');
    const fallback = teamPlayers.filter((player) => player.position !== 'GK');
    const keeper = gk[0] ?? fallback[0];
    let pool = outfield.filter((player) => player.id !== keeper?.id);

    const lineXs = getLinePositions(formation.lines.length, isHome);
    const minY = 8;
    const maxY = FIELD_HEIGHT - 8;

    const updated: Record<string, Player> = {};

    if (keeper) {
      const half = FIELD_WIDTH / 2;
      const keeperX = isHome ? 6 : FIELD_WIDTH - 6;
      const clampedKeeperX = isHome ? Math.min(keeperX, half - 6) : Math.max(keeperX, half + 6);
      const keeperY = FIELD_HEIGHT / 2;
      updated[keeper.id] = {
        ...keeper,
        x: snapValue(toPixel(clampedKeeperX), snapToGrid),
        y: snapValue(toPixel(keeperY), snapToGrid),
      };
    }

    formation.lines.forEach((count, lineIndex) => {
      const preferred = getLinePositionType(lineIndex, formation.lines.length);
      const pick = pickPlayers(pool, count, preferred);
      pool = pick.remaining;

      const ys = distribute(count, minY, maxY);
      pick.selected.forEach((player, index) => {
        updated[player.id] = {
          ...player,
          x: snapValue(toPixel(lineXs[lineIndex]), snapToGrid),
          y: snapValue(toPixel(ys[index]), snapToGrid),
        };
      });
    });

    const nextPlayers = players.map((player) => updated[player.id] ?? player);
    setPlayersWithHistory(nextPlayers);
  };

  const updateTeamPositions = (
    updater: (player: Player, center: { x: number; y: number }) => Player
  ) => {
    if (teamPlayers.length === 0) {
      return;
    }

    const center = teamPlayers.reduce(
      (acc, player) => ({ x: acc.x + player.x, y: acc.y + player.y }),
      { x: 0, y: 0 }
    );
    const centerPoint = {
      x: center.x / teamPlayers.length,
      y: center.y / teamPlayers.length,
    };

    const nextPlayers = players.map((player) =>
      player.team === side ? updater(player, centerPoint) : player
    );
    setPlayersWithHistory(nextPlayers);
  };

  const scaleTeam = (scaleX: number, scaleY: number) => {
    updateTeamPositions((player, center) => {
      const nextX = center.x + (player.x - center.x) * scaleX;
      const nextY = center.y + (player.y - center.y) * scaleY;
      return {
        ...player,
        x: snapValue(nextX, snapToGrid),
        y: snapValue(nextY, snapToGrid),
      };
    });
  };

  const moveTeam = (deltaX: number, deltaY: number) => {
    updateTeamPositions((player) => ({
      ...player,
      x: snapValue(player.x + deltaX, snapToGrid),
      y: snapValue(player.y + deltaY, snapToGrid),
    }));
  };

  const MOVE_STEP = 10;
  const SCALE_STEP = 0.9;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">적용 팀</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSide('home')}
            className={`px-2 py-2 rounded text-xs ${
              side === 'home' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-200'
            }`}
          >
            홈
          </button>
          <button
            onClick={() => setSide('away')}
            className={`px-2 py-2 rounded text-xs ${
              side === 'away' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-200'
            }`}
          >
            어웨이
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">포메이션 리스트</h3>
        <p className="text-[11px] text-gray-400 mb-2">더블 클릭으로 적용됩니다.</p>
        <div className="grid grid-cols-2 gap-2">
          {FORMATIONS.map((formation) => (
            <button
              key={formation.id}
              onDoubleClick={() => applyFormation(formation)}
              className="px-2 py-2 rounded text-xs bg-gray-700 text-gray-200 hover:bg-gray-600"
            >
              {formation.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">배치 조정</h3>
        <div className="bg-gray-700 p-3 rounded space-y-3">
          <div>
            <h4 className="text-xs text-gray-400 mb-2">간격 조절</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => scaleTeam(SCALE_STEP, 1)}
                className="px-2 py-2 rounded text-xs bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                가로 좁히기
              </button>
              <button
                onClick={() => scaleTeam(1 / SCALE_STEP, 1)}
                className="px-2 py-2 rounded text-xs bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                가로 넓히기
              </button>
              <button
                onClick={() => scaleTeam(1, SCALE_STEP)}
                className="px-2 py-2 rounded text-xs bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                세로 좁히기
              </button>
              <button
                onClick={() => scaleTeam(1, 1 / SCALE_STEP)}
                className="px-2 py-2 rounded text-xs bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                세로 넓히기
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 mb-2">위치 이동</h4>
            <div className="grid grid-cols-3 gap-2">
              <div />
              <button
                onClick={() => moveTeam(0, -MOVE_STEP)}
                className="px-2 py-2 rounded text-xs bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                위로
              </button>
              <div />
              <button
                onClick={() => moveTeam(-MOVE_STEP, 0)}
                className="px-2 py-2 rounded text-xs bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                왼쪽
              </button>
              <button
                onClick={() => moveTeam(0, MOVE_STEP)}
                className="px-2 py-2 rounded text-xs bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                아래로
              </button>
              <button
                onClick={() => moveTeam(MOVE_STEP, 0)}
                className="px-2 py-2 rounded text-xs bg-gray-600 text-gray-200 hover:bg-gray-500"
              >
                오른쪽
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-gray-500">
        현재 팀 인원: {teamPlayers.length}명
      </div>
    </div>
  );
}

export default FormationTab;
