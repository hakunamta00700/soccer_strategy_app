import { Layer, Rect, Circle, Line, Arrow, Group } from 'react-konva';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';

interface ShapeLayerProps {
  drawingPoints: number[];
  activeTool: string | null;
  transform?: { rotation: number; x: number; y: number };
}

function ShapeLayer({ drawingPoints, activeTool, transform }: ShapeLayerProps) {
  const { shapes, selectedObjectId, setSelectedObject, clearPlayerSelection } =
    useTacticalBoardStore();
  const {
    arrowColor,
    arrowStrokeWidth,
    arrowStyle,
    arrowPointerLength,
    arrowPointerWidth,
    freehandColor,
    freehandStrokeWidth,
    freehandOpacity,
  } = useUIStore();

  const renderDrawingShape = () => {
    if (drawingPoints.length < 4) return null;

    const [x1, y1, x2, y2] = drawingPoints;

    switch (activeTool) {
      case 'rect':
        return (
          <Rect
            x={x1}
            y={y1}
            width={x2 - x1}
            height={y2 - y1}
            stroke="#ffffff"
            strokeWidth={2}
            fill="rgba(255, 255, 255, 0.2)"
            dash={[5, 5]}
          />
        );
      case 'circle':
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return (
          <Circle
            x={x1}
            y={y1}
            radius={radius}
            stroke="#ffffff"
            strokeWidth={2}
            fill="rgba(255, 255, 255, 0.2)"
            dash={[5, 5]}
          />
        );
      case 'line':
        return (
          <Line
            points={drawingPoints}
            stroke="#ffffff"
            strokeWidth={2}
            dash={[5, 5]}
          />
        );
      case 'freehand':
        return (
          <Line
            points={drawingPoints}
            stroke={freehandColor}
            strokeWidth={freehandStrokeWidth}
            lineCap="round"
            lineJoin="round"
            opacity={freehandOpacity}
          />
        );
      case 'arrow':
        return (
          <Arrow
            points={drawingPoints}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            fill={arrowColor}
            pointerLength={arrowPointerLength}
            pointerWidth={arrowPointerWidth}
            dash={arrowStyle === 'dashed' ? [8, 6] : undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layer>
      <Group rotation={transform?.rotation ?? 0} x={transform?.x ?? 0} y={transform?.y ?? 0}>
      {shapes.map((shape) => {
        const isSelected = selectedObjectId === shape.id;
        const stroke = isSelected ? '#facc15' : shape.color;
        const strokeWidth = isSelected ? shape.strokeWidth + 1 : shape.strokeWidth;
        const handleSelect = (e: any) => {
          e.cancelBubble = true;
          clearPlayerSelection();
          setSelectedObject(shape.id);
        };

        switch (shape.type) {
          case 'rect':
            return (
              <Rect
                key={shape.id}
                x={shape.points[0]}
                y={shape.points[1]}
                width={shape.points[2]}
                height={shape.points[3]}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={shape.fill}
                opacity={shape.opacity}
                onClick={handleSelect}
                onTap={handleSelect}
              />
            );
          case 'circle':
            return (
              <Circle
                key={shape.id}
                x={shape.points[0]}
                y={shape.points[1]}
                radius={shape.points[2]}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={shape.fill}
                opacity={shape.opacity}
                onClick={handleSelect}
                onTap={handleSelect}
              />
            );
          case 'line':
            return (
              <Line
                key={shape.id}
                points={shape.points}
                stroke={stroke}
                strokeWidth={strokeWidth}
                onClick={handleSelect}
                onTap={handleSelect}
              />
            );
          case 'freehand':
            return (
              <Line
                key={shape.id}
                points={shape.points}
                stroke={stroke}
                strokeWidth={strokeWidth}
                lineCap="round"
                lineJoin="round"
                opacity={shape.opacity}
                onClick={handleSelect}
                onTap={handleSelect}
              />
            );
          case 'arrow':
            return (
              <Arrow
                key={shape.id}
                points={shape.points}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={shape.color}
                dash={shape.dash}
                pointerLength={shape.pointerLength ?? 10}
                pointerWidth={shape.pointerWidth ?? 10}
                onClick={handleSelect}
                onTap={handleSelect}
              />
            );
          default:
            return null;
        }
      })}
      {renderDrawingShape()}
      </Group>
    </Layer>
  );
}

export default ShapeLayer;
