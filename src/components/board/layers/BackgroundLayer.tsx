import { Layer, Rect, Line, Circle } from 'react-konva';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LINE_COLOR,
  LINE_WIDTH,
  LINES,
  FIELD_COLOR,
  PIXELS_PER_METER,
  GRID_SIZE,
  GRID_COLOR,
} from '@/constants/field';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';

function BackgroundLayer() {
  const { gridVisible } = useTacticalBoardStore();
  const toPixel = (meters: number) => meters * PIXELS_PER_METER;
  const verticalLines = gridVisible
    ? Array.from({ length: Math.floor(CANVAS_WIDTH / GRID_SIZE) }, (_, index) => (
        <Line
          key={`grid-v-${index}`}
          points={[
            (index + 1) * GRID_SIZE,
            0,
            (index + 1) * GRID_SIZE,
            CANVAS_HEIGHT,
          ]}
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
      ))
    : null;
  const horizontalLines = gridVisible
    ? Array.from({ length: Math.floor(CANVAS_HEIGHT / GRID_SIZE) }, (_, index) => (
        <Line
          key={`grid-h-${index}`}
          points={[
            0,
            (index + 1) * GRID_SIZE,
            CANVAS_WIDTH,
            (index + 1) * GRID_SIZE,
          ]}
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
      ))
    : null;

  return (
    <Layer>
      <Rect
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill={FIELD_COLOR}
      />

      {verticalLines}
      {horizontalLines}

      <Line
        points={[toPixel(LINES.centerX), 0, toPixel(LINES.centerX), CANVAS_HEIGHT]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Line
        points={[0, toPixel(LINES.centerY), CANVAS_WIDTH, toPixel(LINES.centerY)]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Circle
        x={toPixel(LINES.centerX)}
        y={toPixel(LINES.centerY)}
        radius={toPixel(LINES.centerCircleRadius)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Circle
        x={toPixel(LINES.centerX)}
        y={toPixel(LINES.centerY)}
        radius={3}
        fill={LINE_COLOR}
      />

      <Rect
        x={0}
        y={toPixel((LINES.centerY - LINES.penaltyBoxHeight / 2))}
        width={toPixel(LINES.penaltyBoxDistance)}
        height={toPixel(LINES.penaltyBoxHeight)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Rect
        x={CANVAS_WIDTH - toPixel(LINES.penaltyBoxDistance)}
        y={toPixel((LINES.centerY - LINES.penaltyBoxHeight / 2))}
        width={toPixel(LINES.penaltyBoxDistance)}
        height={toPixel(LINES.penaltyBoxHeight)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Rect
        x={0}
        y={toPixel((LINES.centerY - LINES.goalAreaHeight / 2))}
        width={toPixel(LINES.goalAreaDistance)}
        height={toPixel(LINES.goalAreaHeight)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Rect
        x={CANVAS_WIDTH - toPixel(LINES.goalAreaDistance)}
        y={toPixel((LINES.centerY - LINES.goalAreaHeight / 2))}
        width={toPixel(LINES.goalAreaDistance)}
        height={toPixel(LINES.goalAreaHeight)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Circle
        x={toPixel(LINES.penaltySpotDistance)}
        y={toPixel(LINES.centerY)}
        radius={3}
        fill={LINE_COLOR}
      />

      <Circle
        x={CANVAS_WIDTH - toPixel(LINES.penaltySpotDistance)}
        y={toPixel(LINES.centerY)}
        radius={3}
        fill={LINE_COLOR}
      />

      <Circle
        x={toPixel(LINES.penaltySpotDistance)}
        y={toPixel(LINES.centerY)}
        radius={toPixel(LINES.penaltyArcRadius)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        angle={-53.13}
        clockwise
      />

      <Circle
        x={CANVAS_WIDTH - toPixel(LINES.penaltySpotDistance)}
        y={toPixel(LINES.centerY)}
        radius={toPixel(LINES.penaltyArcRadius)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        angle={126.87}
      />

      <Circle
        x={0}
        y={0}
        radius={toPixel(LINES.cornerArcRadius)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        angle={0}
      />

      <Circle
        x={CANVAS_WIDTH}
        y={0}
        radius={toPixel(LINES.cornerArcRadius)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        angle={90}
      />

      <Circle
        x={0}
        y={CANVAS_HEIGHT}
        radius={toPixel(LINES.cornerArcRadius)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        angle={270}
      />

      <Circle
        x={CANVAS_WIDTH}
        y={CANVAS_HEIGHT}
        radius={toPixel(LINES.cornerArcRadius)}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        angle={180}
      />

      <Line
        points={[0, 0, 0, CANVAS_HEIGHT]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Line
        points={[CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Line
        points={[0, 0, CANVAS_WIDTH, 0]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Line
        points={[0, CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />
    </Layer>
  );
}

export default BackgroundLayer;
