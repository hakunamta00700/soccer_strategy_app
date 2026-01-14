import { Layer, Rect, Line, Circle } from 'react-konva';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LINE_WIDTH,
  LINES,
  PIXELS_PER_METER,
  GRID_SIZE,
  GRID_COLOR,
} from '@/constants/field';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';

const mapPoint = (x: number, y: number, isPortrait: boolean) => {
  if (!isPortrait) {
    return { x, y };
  }
  return { x: y, y: CANVAS_WIDTH - x };
};

const mapLine = (points: number[], isPortrait: boolean) => {
  const start = mapPoint(points[0], points[1], isPortrait);
  const end = mapPoint(points[2], points[3], isPortrait);
  return [start.x, start.y, end.x, end.y];
};

const mapRect = (x: number, y: number, width: number, height: number, isPortrait: boolean) => {
  if (!isPortrait) {
    return { x, y, width, height };
  }

  const corners = [
    mapPoint(x, y, isPortrait),
    mapPoint(x + width, y, isPortrait),
    mapPoint(x + width, y + height, isPortrait),
    mapPoint(x, y + height, isPortrait),
  ];
  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

function BackgroundLayer() {
  const { gridVisible, fieldColor, lineColor } = useTacticalBoardStore();
  const { boardOrientation } = useUIStore();
  const isPortrait = boardOrientation === 'portrait';
  const toPixel = (meters: number) => meters * PIXELS_PER_METER;

  const verticalLines = gridVisible
    ? Array.from({ length: Math.floor(CANVAS_WIDTH / GRID_SIZE) }, (_, index) => {
        const points = mapLine(
          [(index + 1) * GRID_SIZE, 0, (index + 1) * GRID_SIZE, CANVAS_HEIGHT],
          isPortrait
        );
        return (
          <Line
            key={`grid-v-${index}`}
            points={points}
            stroke={GRID_COLOR}
            strokeWidth={1}
          />
        );
      })
    : null;
  const horizontalLines = gridVisible
    ? Array.from({ length: Math.floor(CANVAS_HEIGHT / GRID_SIZE) }, (_, index) => {
        const points = mapLine(
          [0, (index + 1) * GRID_SIZE, CANVAS_WIDTH, (index + 1) * GRID_SIZE],
          isPortrait
        );
        return (
          <Line
            key={`grid-h-${index}`}
            points={points}
            stroke={GRID_COLOR}
            strokeWidth={1}
          />
        );
      })
    : null;

  const backgroundRect = mapRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, isPortrait);
  const penaltyBoxLeft = mapRect(
    0,
    toPixel(LINES.centerY - LINES.penaltyBoxHeight / 2),
    toPixel(LINES.penaltyBoxDistance),
    toPixel(LINES.penaltyBoxHeight),
    isPortrait
  );
  const penaltyBoxRight = mapRect(
    CANVAS_WIDTH - toPixel(LINES.penaltyBoxDistance),
    toPixel(LINES.centerY - LINES.penaltyBoxHeight / 2),
    toPixel(LINES.penaltyBoxDistance),
    toPixel(LINES.penaltyBoxHeight),
    isPortrait
  );
  const goalAreaLeft = mapRect(
    0,
    toPixel(LINES.centerY - LINES.goalAreaHeight / 2),
    toPixel(LINES.goalAreaDistance),
    toPixel(LINES.goalAreaHeight),
    isPortrait
  );
  const goalAreaRight = mapRect(
    CANVAS_WIDTH - toPixel(LINES.goalAreaDistance),
    toPixel(LINES.centerY - LINES.goalAreaHeight / 2),
    toPixel(LINES.goalAreaDistance),
    toPixel(LINES.goalAreaHeight),
    isPortrait
  );
  const centerLine = mapLine([toPixel(LINES.centerX), 0, toPixel(LINES.centerX), CANVAS_HEIGHT], isPortrait);
  const centerCircle = mapPoint(toPixel(LINES.centerX), toPixel(LINES.centerY), isPortrait);
  const centerSpot = mapPoint(toPixel(LINES.centerX), toPixel(LINES.centerY), isPortrait);
  const penaltySpotLeft = mapPoint(toPixel(LINES.penaltySpotDistance), toPixel(LINES.centerY), isPortrait);
  const penaltySpotRight = mapPoint(
    CANVAS_WIDTH - toPixel(LINES.penaltySpotDistance),
    toPixel(LINES.centerY),
    isPortrait
  );
  const sidelineLeft = mapLine([0, 0, 0, CANVAS_HEIGHT], isPortrait);
  const sidelineRight = mapLine([CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT], isPortrait);
  const goalLineTop = mapLine([0, 0, CANVAS_WIDTH, 0], isPortrait);
  const goalLineBottom = mapLine([0, CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT], isPortrait);

  return (
    <Layer>
      <Rect
        x={backgroundRect.x}
        y={backgroundRect.y}
        width={backgroundRect.width}
        height={backgroundRect.height}
        fill={fieldColor}
      />

      {verticalLines}
      {horizontalLines}

      <Line
        points={centerLine}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Circle
        x={centerCircle.x}
        y={centerCircle.y}
        radius={toPixel(LINES.centerCircleRadius)}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Circle
        x={centerSpot.x}
        y={centerSpot.y}
        radius={3}
        fill={lineColor}
      />

      <Rect
        x={penaltyBoxLeft.x}
        y={penaltyBoxLeft.y}
        width={penaltyBoxLeft.width}
        height={penaltyBoxLeft.height}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Rect
        x={penaltyBoxRight.x}
        y={penaltyBoxRight.y}
        width={penaltyBoxRight.width}
        height={penaltyBoxRight.height}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Rect
        x={goalAreaLeft.x}
        y={goalAreaLeft.y}
        width={goalAreaLeft.width}
        height={goalAreaLeft.height}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Rect
        x={goalAreaRight.x}
        y={goalAreaRight.y}
        width={goalAreaRight.width}
        height={goalAreaRight.height}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Circle
        x={penaltySpotLeft.x}
        y={penaltySpotLeft.y}
        radius={3}
        fill={lineColor}
      />

      <Circle
        x={penaltySpotRight.x}
        y={penaltySpotRight.y}
        radius={3}
        fill={lineColor}
      />

      <Line
        points={sidelineLeft}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Line
        points={sidelineRight}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Line
        points={goalLineTop}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />

      <Line
        points={goalLineBottom}
        stroke={lineColor}
        strokeWidth={LINE_WIDTH}
      />
      {[
        { x: 0, y: 0, angle: 0 },
        { x: CANVAS_WIDTH, y: 0, angle: 90 },
        { x: 0, y: CANVAS_HEIGHT, angle: 270 },
        { x: CANVAS_WIDTH, y: CANVAS_HEIGHT, angle: 180 },
      ].map((corner) => {
        const mapped = mapPoint(corner.x, corner.y, isPortrait);
        const angle = isPortrait ? (corner.angle + 90) % 360 : corner.angle;
        return (
          <Circle
            key={`corner-${corner.x}-${corner.y}`}
            x={mapped.x}
            y={mapped.y}
            radius={toPixel(LINES.cornerArcRadius)}
            stroke={lineColor}
            strokeWidth={LINE_WIDTH}
            angle={angle}
          />
        );
      })}
    </Layer>
  );
}

export default BackgroundLayer;
