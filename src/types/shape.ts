export type ShapeType = 'arrow' | 'line' | 'rect' | 'circle' | 'text' | 'freehand';

export interface Shape {
  id: string;
  type: ShapeType;
  points: number[];
  color: string;
  strokeWidth: number;
  dash?: number[];
  pointerLength?: number;
  pointerWidth?: number;
  hasArrow?: boolean;
  fill?: string;
  opacity?: number;
}
