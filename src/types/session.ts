import { Player } from './player';
import { Shape } from './shape';
import { Animation } from './animation';
import { Ball } from './ball';

export interface Session {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tactics: Tactic[];
  thumbnail?: string;
}

export interface Tactic {
  id: string;
  name: string;
  players: Player[];
  balls: Ball[];
  shapes: Shape[];
  animations: Animation[];
  createdAt: Date;
}
