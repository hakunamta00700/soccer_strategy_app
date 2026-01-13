export type Position = 'GK' | 'DF' | 'MF' | 'FW';
export type Team = 'home' | 'away';

export interface Player {
  id: string;
  number: number;
  name: string;
  position: Position;
  team: Team;
  color: string;
  x: number;
  y: number;
  rotation?: number;
}
