import { Layer, Rect, Line, Circle } from 'react-konva';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LINE_COLOR,
  LINE_WIDTH,
  LINES,
  FIELD_COLOR,
  PIXELS_PER_METER,
} from '@/constants/field';

function BackgroundLayer() {
  const toPixel = (meters: number) => meters * PIXELS_PER_METER;

  return (
    <Layer>
      <Rect
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill={FIELD_COLOR}
      />

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
