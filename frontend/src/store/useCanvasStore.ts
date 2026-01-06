import { create } from 'zustand';

export const CANVAS_WIDTH = 12000;
export const CANVAS_HEIGHT = 7000;

interface CanvasState {
  stageScale: number;
  stagePos: { x: number; y: number };
  canvasWidth: number;
  canvasHeight: number;

  setStageScale: (scale: number) => void;
  setStagePos: (pos: { x: number; y: number }) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  stageScale: 1,
  stagePos:
    typeof window !== 'undefined'
      ? {
          x: (window.innerWidth - CANVAS_WIDTH) / 2,
          y: (window.innerHeight - CANVAS_HEIGHT) / 2,
        }
      : { x: 0, y: 0 },
  canvasWidth: CANVAS_WIDTH,
  canvasHeight: CANVAS_HEIGHT,

  setStageScale: (scale) => set({ stageScale: scale }),
  setStagePos: (pos) => set({ stagePos: pos }),
}));
