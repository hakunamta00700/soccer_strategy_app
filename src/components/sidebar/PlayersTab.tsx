import { useMemo, useState } from 'react';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useRosterStore } from '@/store/rosterStore';
import { Ball } from '@/types/ball';
import { Player } from '@/types/player';
import { RosterEntry, RosterSide } from '@/types/roster';
import { FIELD_WIDTH, FIELD_HEIGHT, PIXELS_PER_METER } from '@/constants/field';
import { snapValue } from '@/utils/grid';

function PlayersTab() {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState<'GK' | 'DF' | 'MF' | 'FW'>('MF');
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const {
    rosterHome,
    rosterAway,
    rosterInput,
    rosterSide,
    rosterMode,
    rosterFilterHome,
    rosterFilterAway,
    setRosterHome,
    setRosterAway,
    setRosterInput,
    setRosterSide,
    setRosterMode,
    setRosterFilterHome,
    setRosterFilterAway,
  } = useRosterStore();
  const [sectionsOpen, setSectionsOpen] = useState({
    rosterLoad: true,
    rosterMode: true,
    rosterLists: true,
    rosterHome: true,
    rosterAway: true,
    addPlayer: true,
    placedPlayers: true,
    balls: true,
  });

  const { players, balls, addPlayer, removePlayer, addBall, removeBall, updateBall, snapToGrid } =
    useTacticalBoardStore();

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

  const normalizePosition = (value: string): Player['position'] => {
    const upper = value.toUpperCase();
    if (upper === 'GK' || upper === 'DF' || upper === 'MF' || upper === 'FW') {
      return upper;
    }
    return 'MF';
  };

  const mapRosterEntry = (entry: any): RosterEntry | null => {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const nameValue = String(entry.name ?? '').trim();
    if (!nameValue) {
      return null;
    }

    return {
      club: String(entry.club ?? '').trim(),
      name: nameValue,
      position: String(entry.position ?? '').trim(),
      number: String(entry.number ?? '').trim(),
      imgUrl: String(entry.img_url ?? '').trim(),
      playerId: String(entry.player_id ?? '').trim(),
    };
  };

  const loadRosterFromJson = (jsonText: string, side: RosterSide) => {
    let data: unknown;
    try {
      data = JSON.parse(jsonText);
    } catch (error) {
      alert('JSON 형식이 올바르지 않습니다.');
      return;
    }

    if (!Array.isArray(data)) {
      alert('JSON은 배열 형식이어야 합니다.');
      return;
    }

    const entries = data
      .map(mapRosterEntry)
      .filter((entry): entry is RosterEntry => Boolean(entry));

    if (entries.length === 0) {
      alert('불러올 수 있는 선수 데이터가 없습니다.');
      return;
    }

    if (side === 'home') {
      setRosterHome(entries);
    } else {
      setRosterAway(entries);
    }
  };

  const handleRosterPaste = () => {
    if (!rosterInput.trim()) {
      alert('붙여넣은 데이터가 없습니다.');
      return;
    }
    loadRosterFromJson(rosterInput, rosterSide);
  };

  const handleRosterFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      loadRosterFromJson(text, rosterSide);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const centerX = snapValue((FIELD_WIDTH * PIXELS_PER_METER) / 2, snapToGrid);
  const centerY = snapValue((FIELD_HEIGHT * PIXELS_PER_METER) / 2, snapToGrid);

  const handleAddRosterPlayer = (entry: RosterEntry, side: RosterSide) => {
    const numberValue = Number(entry.number);
    const newPlayer: Player = {
      id: `player-${side}-${entry.playerId || Date.now()}`,
      number: Number.isFinite(numberValue) ? numberValue : 0,
      name: entry.name,
      position: normalizePosition(entry.position),
      team: side,
      color: teamColors[side],
      imgUrl: entry.imgUrl || undefined,
      x: centerX,
      y: centerY,
    };
    addPlayer(newPlayer);
  };

  const positions = [
    { id: 'GK', label: 'GK' },
    { id: 'DF', label: 'DF' },
    { id: 'MF', label: 'MF' },
    { id: 'FW', label: 'FW' },
  ] as const;

  const getRosterPosition = (entry: RosterEntry) => {
    const upper = entry.position.toUpperCase();
    if (upper === 'GK' || upper === 'DF' || upper === 'MF' || upper === 'FW') {
      return upper;
    }
    return null;
  };

  const filterRoster = (entries: RosterEntry[], filter: Array<'GK' | 'DF' | 'MF' | 'FW'>) =>
    entries.filter((entry) => {
      const pos = getRosterPosition(entry);
      if (!pos) {
        return true;
      }
      return filter.includes(pos);
    });

  const toggleRosterFilter = (pos: (typeof positions)[number]['id'], side: RosterSide) => {
    if (side === 'home') {
      setRosterFilterHome(
        rosterFilterHome.includes(pos)
          ? rosterFilterHome.filter((item) => item !== pos)
          : [...rosterFilterHome, pos]
      );
    } else {
      setRosterFilterAway(
        rosterFilterAway.includes(pos)
          ? rosterFilterAway.filter((item) => item !== pos)
          : [...rosterFilterAway, pos]
      );
    }
  };

  const rosterSummary = useMemo(
    () => ({
      home: rosterHome.length,
      away: rosterAway.length,
    }),
    [rosterHome.length, rosterAway.length]
  );

  const handleAddBall = () => {
    const x = centerX;
    const y = centerY;

    if (balls.length > 0) {
      updateBall(balls[0].id, { x, y });
      useTacticalBoardStore.getState().setSelectedObject(balls[0].id);
      return;
    }

    const ball: Ball = {
      id: `ball-${Date.now()}`,
      x,
      y,
      radius: 10,
      color: '#f9fafb',
      strokeColor: '#111827',
    };
    addBall(ball);
  };

  const handleDeletePlayer = (playerId: string) => {
    removePlayer(playerId);
  };

  const handleDeleteBall = (ballId: string) => {
    removeBall(ballId);
  };

  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={() =>
            setSectionsOpen((prev) => ({ ...prev, rosterLoad: !prev.rosterLoad }))
          }
          className="w-full flex items-center justify-between text-sm font-medium text-gray-300 mb-2"
        >
          선수 리스트 불러오기
          <span className="text-xs text-gray-400">
            {sectionsOpen.rosterLoad ? '접기' : '펼치기'}
          </span>
        </button>
        {sectionsOpen.rosterLoad && (
          <div className="bg-gray-700 p-3 rounded space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRosterSide('home')}
                className={`px-2 py-2 rounded text-xs ${
                  rosterSide === 'home'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-600 text-gray-200'
                }`}
              >
                홈에 불러오기
              </button>
              <button
                onClick={() => setRosterSide('away')}
                className={`px-2 py-2 rounded text-xs ${
                  rosterSide === 'away'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-600 text-gray-200'
                }`}
              >
                어웨이에 불러오기
              </button>
            </div>
            <textarea
              value={rosterInput}
              onChange={(e) => setRosterInput(e.target.value)}
              rows={4}
              className="w-full px-2 py-2 bg-gray-600 text-white rounded text-xs"
              placeholder="JSON 배열 데이터를 붙여넣기"
            />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleRosterPaste} className="btn-primary text-xs">
                붙여넣기 불러오기
              </button>
              <label className="flex items-center justify-center gap-2 px-2 py-2 bg-gray-600 text-xs text-gray-200 rounded cursor-pointer">
                파일 선택
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleRosterFile}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-[11px] text-gray-400">
              홈 {rosterSummary.home}명 · 어웨이 {rosterSummary.away}명
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() =>
            setSectionsOpen((prev) => ({ ...prev, rosterMode: !prev.rosterMode }))
          }
          className="w-full flex items-center justify-between text-sm font-medium text-gray-300 mb-2"
        >
          리스트 표시 모드
          <span className="text-xs text-gray-400">
            {sectionsOpen.rosterMode ? '접기' : '펼치기'}
          </span>
        </button>
        {sectionsOpen.rosterMode && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setRosterMode('number')}
              className={`px-2 py-2 rounded text-xs ${
                rosterMode === 'number'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              등번호
            </button>
            <button
              onClick={() => setRosterMode('photo')}
              className={`px-2 py-2 rounded text-xs ${
                rosterMode === 'photo'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              얼굴
            </button>
          </div>
        )}
      </div>

      {(rosterHome.length > 0 || rosterAway.length > 0) && (
        <div className="space-y-3">
          <div>
            <button
              onClick={() =>
                setSectionsOpen((prev) => ({ ...prev, rosterLists: !prev.rosterLists }))
              }
              className="w-full flex items-center justify-between text-xs font-medium text-gray-400 mb-2"
            >
              홈/어웨이 선수
              <span className="text-[11px] text-gray-500">
                {sectionsOpen.rosterLists ? '접기' : '펼치기'}
              </span>
            </button>
            {sectionsOpen.rosterLists && (
              <div className="space-y-3">
                <div>
                  <button
                    onClick={() =>
                      setSectionsOpen((prev) => ({ ...prev, rosterHome: !prev.rosterHome }))
                    }
                    className="w-full flex items-center justify-between text-xs font-medium text-gray-400 mb-2"
                  >
                    홈 선수
                    <span className="text-[11px] text-gray-500">
                      {sectionsOpen.rosterHome ? '접기' : '펼치기'}
                    </span>
                  </button>
                  {sectionsOpen.rosterHome && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        {positions.map((position) => (
                          <button
                            key={`home-filter-${position.id}`}
                            onClick={() => toggleRosterFilter(position.id, 'home')}
                            className={`px-2 py-2 rounded text-xs ${
                              rosterFilterHome.includes(position.id)
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-600 text-gray-200'
                            }`}
                          >
                            {position.label}
                          </button>
                        ))}
                      </div>
                      {rosterHome.length === 0 ? (
                        <p className="text-xs text-gray-500">홈 선수 리스트가 없습니다.</p>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {filterRoster(rosterHome, rosterFilterHome).map((entry) => (
                            <button
                              key={`home-${entry.playerId}-${entry.name}`}
                              onClick={() => handleAddRosterPlayer(entry, 'home')}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-semibold text-white border border-gray-600 overflow-hidden"
                                style={
                                  rosterMode === 'photo' && entry.imgUrl
                                    ? {
                                        backgroundImage: `url(${entry.imgUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                      }
                                    : { backgroundColor: '#374151' }
                                }
                              >
                                {rosterMode === 'number' ? entry.number || '-' : ''}
                              </div>
                              <div className="text-[10px] text-gray-300 text-center leading-tight">
                                {entry.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() =>
                      setSectionsOpen((prev) => ({ ...prev, rosterAway: !prev.rosterAway }))
                    }
                    className="w-full flex items-center justify-between text-xs font-medium text-gray-400 mb-2"
                  >
                    어웨이 선수
                    <span className="text-[11px] text-gray-500">
                      {sectionsOpen.rosterAway ? '접기' : '펼치기'}
                    </span>
                  </button>
                  {sectionsOpen.rosterAway && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        {positions.map((position) => (
                          <button
                            key={`away-filter-${position.id}`}
                            onClick={() => toggleRosterFilter(position.id, 'away')}
                            className={`px-2 py-2 rounded text-xs ${
                              rosterFilterAway.includes(position.id)
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-600 text-gray-200'
                            }`}
                          >
                            {position.label}
                          </button>
                        ))}
                      </div>
                      {rosterAway.length === 0 ? (
                        <p className="text-xs text-gray-500">어웨이 선수 리스트가 없습니다.</p>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {filterRoster(rosterAway, rosterFilterAway).map((entry) => (
                            <button
                              key={`away-${entry.playerId}-${entry.name}`}
                              onClick={() => handleAddRosterPlayer(entry, 'away')}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-semibold text-white border border-gray-600 overflow-hidden"
                                style={
                                  rosterMode === 'photo' && entry.imgUrl
                                    ? {
                                        backgroundImage: `url(${entry.imgUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                      }
                                    : { backgroundColor: '#374151' }
                                }
                              >
                                {rosterMode === 'number' ? entry.number || '-' : ''}
                              </div>
                              <div className="text-[10px] text-gray-300 text-center leading-tight">
                                {entry.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <button
          onClick={() =>
            setSectionsOpen((prev) => ({ ...prev, addPlayer: !prev.addPlayer }))
          }
          className="w-full flex items-center justify-between text-sm font-medium text-gray-300 mb-2"
        >
          선수 추가
          <span className="text-xs text-gray-400">
            {sectionsOpen.addPlayer ? '접기' : '펼치기'}
          </span>
        </button>
        {sectionsOpen.addPlayer && (
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
        )}
      </div>

      <div>
        <button
          onClick={() =>
            setSectionsOpen((prev) => ({ ...prev, placedPlayers: !prev.placedPlayers }))
          }
          className="w-full flex items-center justify-between text-sm font-medium text-gray-300 mb-2"
        >
          배치된 선수
          <span className="text-xs text-gray-400">
            {sectionsOpen.placedPlayers ? '접기' : '펼치기'}
          </span>
        </button>
        {sectionsOpen.placedPlayers && (
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
        )}
      </div>

      <div>
        <button
          onClick={() => setSectionsOpen((prev) => ({ ...prev, balls: !prev.balls }))}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-300 mb-2"
        >
          축구공
          <span className="text-xs text-gray-400">
            {sectionsOpen.balls ? '접기' : '펼치기'}
          </span>
        </button>
        {sectionsOpen.balls && (
          <div className="bg-gray-700 p-3 rounded space-y-2">
            <button
              onClick={handleAddBall}
              className="w-full btn-primary text-sm"
            >
              축구공 추가
            </button>
            {balls.length === 0 ? (
              <p className="text-xs text-gray-400">추가된 축구공이 없습니다</p>
            ) : (
              balls.map((ball) => (
                <div
                  key={ball.id}
                  className="flex items-center justify-between p-2 bg-gray-600 rounded text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-800"
                      style={{ backgroundColor: ball.color }}
                    />
                    <span className="text-white">축구공</span>
                  </div>
                  <button
                    onClick={() => handleDeleteBall(ball.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayersTab;
