import { useState } from 'react';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { Player } from '@/types/player';
import { FIELD_WIDTH, FIELD_HEIGHT, PIXELS_PER_METER } from '@/constants/field';
import { snapValue } from '@/utils/grid';

function PlayersTab() {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState<'GK' | 'DF' | 'MF' | 'FW'>('MF');
  const [team, setTeam] = useState<'home' | 'away'>('home');

  const { players, addPlayer, removePlayer, snapToGrid } = useTacticalBoardStore();

  const teamColors = {
    home: '#e63946',
    away: '#457b9d',
  };

  const handleAddPlayer = () => {
    if (!number || !name) {
      alert('등번호와 이름을 입력해주세요.');
      return;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      number: parseInt(number, 10),
      name,
      position,
      team,
      color: teamColors[team],
      x: snapValue((FIELD_WIDTH * PIXELS_PER_METER) / 2, snapToGrid),
      y: snapValue((FIELD_HEIGHT * PIXELS_PER_METER) / 2, snapToGrid),
    };

    addPlayer(newPlayer);
    setNumber('');
    setName('');
  };

  const handleDeletePlayer = (playerId: string) => {
    removePlayer(playerId);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">선수 추가</h3>
        <div className="bg-gray-700 p-3 rounded space-y-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">등번호</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
              placeholder="번호"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
              placeholder="이름"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">포지션</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
            >
              <option value="GK">GK</option>
              <option value="DF">DF</option>
              <option value="MF">MF</option>
              <option value="FW">FW</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">팀</label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value as any)}
              className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
            >
              <option value="home">홈</option>
              <option value="away">어웨이</option>
            </select>
          </div>
          <button
            onClick={handleAddPlayer}
            className="w-full btn-primary text-sm"
          >
            추가
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">배치된 선수</h3>
        <div className="bg-gray-700 p-3 rounded space-y-2 max-h-64 overflow-y-auto">
          {players.length === 0 ? (
            <p className="text-xs text-gray-400">선수가 없습니다</p>
          ) : (
            players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 bg-gray-600 rounded text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="text-white">
                    #{player.number} {player.name}
                  </span>
                  <span className="text-xs text-gray-400">({player.position})</span>
                </div>
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayersTab;
