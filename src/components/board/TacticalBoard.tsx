import { useRef, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useTacticalBoardStore } from '@/store/tacticalBoardStore';
import { useUIStore } from '@/store/uiStore';
import BackgroundLayer from './layers/BackgroundLayer';
import PlayerLayer from './layers/PlayerLayer';
import ShapeLayer from './layers/ShapeLayer';
import PathLayer from './layers/PathLayer';
import BallLayer from './layers/BallLayer';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/field';
import { Shape } from '@/types/shape';
import { snapValue } from '@/utils/grid';

function TacticalBoard() {
  const {
    zoom,
    pan,
    players,
    selectedPlayerIds,
    setSelectedPlayers,
    addShape,
    snapToGrid,
    clearSelection,
  } = useTacticalBoardStore();
  const {
    activeTool,
    arrowColor,
    arrowStrokeWidth,
    arrowStyle,
    arrowPointerLength,
    arrowPointerWidth,
    boardOrientation,
    freehandColor,
    freehandStrokeWidth,
    freehandOpacity,
    freehandHasArrow,
  } = useUIStore();
  const homeCount = players.filter((player) => player.team === 'home').length;
  const awayCount = players.filter((player) => player.team === 'away').length;

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<number[]>([]);
  const [selectionBox, setSelectionBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const selectionStart = useRef<{ x: number; y: number } | null>(null);
  const selectionActive = useRef(false);
  const selectionDragged = useRef(false);
  const isPortrait = boardOrientation === 'portrait';
  const stageWidth = (isPortrait ? CANVAS_HEIGHT : CANVAS_WIDTH) * zoom;
  const stageHeight = (isPortrait ? CANVAS_WIDTH : CANVAS_HEIGHT) * zoom;

  const handleStageClick = (e: any) => {
    if (selectionDragged.current) {
      selectionDragged.current = false;
      return;
    }

    if (!activeTool && e.target === e.target.getStage()) {
      clearSelection();
    }
  };

  const handleStageMouseDown = (e: any) => {
    if (activeTool && !isDrawing) {
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) {
        return;
      }
      const startX = snapValue(pos.x - pan.x, snapToGrid);
      const startY = snapValue(pos.y - pan.y, snapToGrid);
      setIsDrawing(true);
      if (activeTool === 'freehand') {
        setDrawingPoints([startX, startY]);
      } else {
        setDrawingPoints([startX, startY]);
      }
      return;
    }

    if (isDrawing || e.target !== e.target.getStage()) {
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) {
      return;
    }

    const startX = pos.x / zoom;
    const startY = pos.y / zoom;
    selectionStart.current = { x: startX, y: startY };
    selectionActive.current = true;
    selectionDragged.current = false;
    setSelectionBox({ x: startX, y: startY, width: 0, height: 0 });
  };

  const handleStageMouseMove = (e: any) => {
    if (isDrawing && activeTool) {
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) {
        return;
      }
      const nextX = snapValue(pos.x - pan.x, snapToGrid);
      const nextY = snapValue(pos.y - pan.y, snapToGrid);
      if (activeTool === 'freehand') {
        const lastIndex = drawingPoints.length - 2;
        const lastX = drawingPoints[lastIndex];
        const lastY = drawingPoints[lastIndex + 1];
        const distance = Math.hypot(nextX - lastX, nextY - lastY);
        if (distance > 2) {
          setDrawingPoints([...drawingPoints, nextX, nextY]);
        }
      } else {
        setDrawingPoints([drawingPoints[0], drawingPoints[1], nextX, nextY]);
      }
      return;
    }

    if (selectionActive.current) {
      const pos = e.target.getStage().getPointerPosition();
      if (!pos || !selectionStart.current) {
        return;
      }

      const endX = pos.x / zoom;
      const endY = pos.y / zoom;
      const start = selectionStart.current;
      const x = Math.min(start.x, endX);
      const y = Math.min(start.y, endY);
      const width = Math.abs(endX - start.x);
      const height = Math.abs(endY - start.y);
      if (width > 2 || height > 2) {
        selectionDragged.current = true;
      }
      setSelectionBox({ x, y, width, height });
    }
  };

  const handleStageMouseUp = (e: any) => {
    if (isDrawing && activeTool && drawingPoints.length >= 2) {
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) {
        return;
      }
      const endX = snapValue(pos.x - pan.x, snapToGrid);
      const endY = snapValue(pos.y - pan.y, snapToGrid);

      if (activeTool === 'freehand') {
        const newShape: Shape = {
          id: `shape-${Date.now()}`,
          type: 'freehand',
          points: [...drawingPoints, endX, endY],
          color: freehandColor,
          strokeWidth: freehandStrokeWidth,
          opacity: freehandOpacity,
          pointerLength: freehandHasArrow ? arrowPointerLength : undefined,
          pointerWidth: freehandHasArrow ? arrowPointerWidth : undefined,
          hasArrow: freehandHasArrow,
        };
        addShape(newShape);
      } else if (activeTool === 'text') {
        const textValue = window.prompt('텍스트를 입력하세요', '텍스트');
        if (textValue) {
          const newShape: Shape = {
            id: `shape-${Date.now()}`,
            type: 'text',
            points: [endX, endY],
            color: '#ffffff',
            strokeWidth: 1,
            text: textValue,
            fontSize: 16,
          };
          addShape(newShape);
        }
      } else if (activeTool === 'rect') {
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
      }

      setIsDrawing(false);
      setDrawingPoints([]);
      return;
    }

    if (!selectionActive.current) {
      return;
    }

    selectionActive.current = false;
    const currentBox = selectionBox;
    setSelectionBox(null);

    if (!currentBox || currentBox.width < 4 || currentBox.height < 4) {
      selectionStart.current = null;
      return;
    }

    const selected = players.filter((player) => {
      const withinX = player.x >= currentBox.x && player.x <= currentBox.x + currentBox.width;
      const withinY = player.y >= currentBox.y && player.y <= currentBox.y + currentBox.height;
      return withinX && withinY;
    });

    const ids = selected.map((player) => player.id);
    const isMulti = e?.evt?.shiftKey;
    if (isMulti) {
      const merged = Array.from(new Set([...selectedPlayerIds, ...ids]));
      setSelectedPlayers(merged);
    } else {
      setSelectedPlayers(ids);
    }

    selectionStart.current = null;
  };

  const handleDoubleClick = () => {
    setIsDrawing(false);
    setDrawingPoints([]);
    useUIStore.getState().setActiveTool(null);
  };

  return (
    <div className="flex-1 bg-gray-900 relative overflow-hidden">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-3 text-xs text-gray-200 bg-gray-800/80 px-3 py-1 rounded">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          홈 {homeCount}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          어웨이 {awayCount}
        </span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Stage
          width={stageWidth}
          height={stageHeight}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleStageClick}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onDblClick={handleDoubleClick}
        >
          <BackgroundLayer />
          <ShapeLayer drawingPoints={drawingPoints} activeTool={activeTool} />
          <PathLayer />
          <BallLayer />
          <PlayerLayer />
          {selectionBox && (
            <Layer>
              <Rect
                x={selectionBox.x}
                y={selectionBox.y}
                width={selectionBox.width}
                height={selectionBox.height}
                fill="rgba(59, 130, 246, 0.15)"
                stroke="#3b82f6"
                dash={[6, 4]}
              />
            </Layer>
          )}
        </Stage>
      </div>
    </div>
  );
}

export default TacticalBoard;
