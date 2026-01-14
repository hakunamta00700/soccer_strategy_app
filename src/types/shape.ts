export type ShapeType = 'arrow' | 'line' | 'rect' | 'circle' | 'text';

export interface Shape {
  id: string;
  type: ShapeType;
  points: number[];
  color: string;
  strokeWidth: number;
  dash?: number[];
  pointerLength?: number;
  pointerWidth?: number;
  fill?: string;
  opacity?: number;
}
