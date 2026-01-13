import { Player } from './player';
import { Shape } from './shape';

export interface Animation {
  id: string;
  name: string;
  keyframes: Keyframe[];
  duration: number;
  loop: boolean;
}

export interface Keyframe {
  time: number;
  players: Player[];
  shapes: Shape[];
}
