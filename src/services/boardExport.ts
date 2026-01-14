import Konva from 'konva';

type ImageFormat = 'png' | 'jpg';

let boardStage: Konva.Stage | null = null;

export const setBoardStage = (stage: Konva.Stage | null) => {
  boardStage = stage;
};

const toggleBackgroundLayer = (visible: boolean) => {
  if (!boardStage) {
    return null;
  }

  const layer = boardStage.findOne('#background-layer') as Konva.Layer | null;
  if (!layer) {
    return null;
  }

  const previous = layer.visible();
  layer.visible(visible);
  boardStage.batchDraw();
  return previous;
};

export const exportBoardImage = (options: {
  format: ImageFormat;
  pixelRatio: number;
  includeBackground: boolean;
  quality?: number;
}) => {
  if (!boardStage) {
    return null;
  }

  const { format, pixelRatio, includeBackground, quality } = options;
  const previousVisibility = includeBackground ? null : toggleBackgroundLayer(false);

  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const dataUrl = boardStage.toDataURL({
    mimeType,
    pixelRatio,
    quality: format === 'jpg' ? quality ?? 0.92 : undefined,
  });

  if (!includeBackground && previousVisibility !== null) {
    toggleBackgroundLayer(previousVisibility);
  }

  return dataUrl;
};

export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
};
