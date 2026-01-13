import { useState } from 'react';
import { Stage } from 'react-konva';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';
import BackgroundLayer from './layers/BackgroundLayer';
import PlayerLayer from './layers/PlayerLayer';
import ShapeLayer from './layers/ShapeLayer';
import PathLayer from './layers/PathLayer';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/field';
import { Shape } from '@/types/shape';
import { snapValue } from '@/utils/grid';

function TacticalBoard() {
  const { zoom, pan, setSelectedObject, addShape, snapToGrid } = useTacticalBoardStore();
  const {
    activeTool,
    arrowColor,
    arrowStrokeWidth,
    arrowStyle,
    arrowPointerLength,
    arrowPointerWidth,
  } = useUIStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<number[]>([]);

  const handleStageClick = (e: any) => {
    if (activeTool && !isDrawing) {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      const startX = snapValue(pos.x - pan.x, snapToGrid);
      const startY = snapValue(pos.y - pan.y, snapToGrid);
      setDrawingPoints([startX, startY]);
    } else if (isDrawing) {
      const pos = e.target.getStage().getPointerPosition();
      const endX = snapValue(pos.x - pan.x, snapToGrid);
      const endY = snapValue(pos.y - pan.y, snapToGrid);

      if (activeTool === 'rect') {
        const newShape: Shape = {
          id: `shape-${Date.now()}`,
          type: 'rect',
          points: [
            drawingPoints[0],
            drawingPoints[1],
            endX - drawingPoints[0],
            endY - drawingPoints[1],
          ],
          color: '#ffffff',
          strokeWidth: 2,
        };
        addShape(newShape);
        setIsDrawing(false);
        setDrawingPoints([]);
      } else if (activeTool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(endX - drawingPoints[0], 2) + Math.pow(endY - drawingPoints[1], 2)
        );
        const newShape: Shape = {
          id: `shape-${Date.now()}`,
          type: 'circle',
          points: [drawingPoints[0], drawingPoints[1], radius],
          color: '#ffffff',
          strokeWidth: 2,
        };
        addShape(newShape);
        setIsDrawing(false);
        setDrawingPoints([]);
      } else if (activeTool === 'line' || activeTool === 'arrow') {
        const newShape: Shape = {
          id: `shape-${Date.now()}`,
          type: activeTool as any,
          points: [drawingPoints[0], drawingPoints[1], endX, endY],
          color: activeTool === 'arrow' ? arrowColor : '#ffffff',
          strokeWidth: activeTool === 'arrow' ? arrowStrokeWidth : 2,
          dash: activeTool === 'arrow' && arrowStyle === 'dashed' ? [8, 6] : undefined,
          pointerLength: activeTool === 'arrow' ? arrowPointerLength : undefined,
          pointerWidth: activeTool === 'arrow' ? arrowPointerWidth : undefined,
        };
        addShape(newShape);
        setIsDrawing(false);
        setDrawingPoints([]);
      }
    } else {
      setSelectedObject(null);
    }
  };

  const handleStageMouseMove = (e: any) => {
    if (isDrawing && activeTool) {
      const pos = e.target.getStage().getPointerPosition();
      const nextX = snapValue(pos.x - pan.x, snapToGrid);
      const nextY = snapValue(pos.y - pan.y, snapToGrid);
      setDrawingPoints([
        drawingPoints[0],
        drawingPoints[1],
        nextX,
        nextY,
      ]);
    }
  };

  const handleDoubleClick = () => {
    setIsDrawing(false);
    setDrawingPoints([]);
    useUIStore.getState().setActiveTool(null);
  };

  return (
    <div className="flex-1 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <Stage
          width={CANVAS_WIDTH * zoom}
          height={CANVAS_HEIGHT * zoom}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleStageClick}
          onMouseMove={handleStageMouseMove}
          onDblClick={handleDoubleClick}
        >
          <BackgroundLayer />
          <ShapeLayer drawingPoints={drawingPoints} activeTool={activeTool} />
          <PathLayer />
          <PlayerLayer />
        </Stage>
      </div>
    </div>
  );
}

export default TacticalBoard;
