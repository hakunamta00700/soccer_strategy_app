import { GRID_SIZE } from '@/constants/field';

export const snapValue = (value: number, snapEnabled: boolean) =>
  snapEnabled ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;

export const snapPoint = (x: number, y: number, snapEnabled: boolean) => ({
  x: snapValue(x, snapEnabled),
  y: snapValue(y, snapEnabled),
});
