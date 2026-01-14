export type RosterSide = 'home' | 'away';
export type RosterViewMode = 'number' | 'photo';

export interface RosterEntry {
  club: string;
  name: string;
  position: string;
  number: string;
  imgUrl: string;
  playerId: string;
}
