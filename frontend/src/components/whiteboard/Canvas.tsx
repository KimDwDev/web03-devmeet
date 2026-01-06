'use client';

import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCanvasStore } from '@/store/useCanvasStore';

// 줌 최소/최대 배율
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export default function Canvas (){
  const stageScale = useCanvasStore((state) => state.stageScale);
  const stagePos = useCanvasStore((state) => state.stagePos);
  const canvasWidth = useCanvasStore((state) => state.canvasWidth);
  const canvasHeight = useCanvasStore((state) => state.canvasHeight);
  const setStageScale = useCanvasStore((state) => state.setStageScale);
  const setStagePos = useCanvasStore((state) => state.setStagePos);

  // 브라우저 창 크기
  const [size, setSize] = useState({ width: 0, height: 0 });

  // 브라우저 창 크기 변경 감지 및 업데이트
  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (size.width === 0 || size.height === 0) return null;

  // stage 위치를 화면 범위 내로 제한
  const constrainStagePosition = (
    pos: { x: number; y: number },
    scale: number,
  ) => {
    const scaledCanvasWidth = canvasWidth * scale;
    const scaledCanvasHeight = canvasHeight * scale;

    let x = pos.x;
    let y = pos.y;

    // 축소시에 canvas가 화면보다 작으면 중앙에 오도록
    if (scaledCanvasWidth <= size.width) {
      x = (size.width - scaledCanvasWidth) / 2;
    } else {
      x = clamp(x, size.width - scaledCanvasWidth, 0);
    }

    if (scaledCanvasHeight <= size.height) {
      y = (size.height - scaledCanvasHeight) / 2;
    } else {
      y = clamp(y, size.height - scaledCanvasHeight, 0);
    }

    return { x, y };
  };

  // 마우스 휠로 줌 인/아웃 
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.1;
    const rawScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, rawScale));

    if (newScale === oldScale) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePos(constrainStagePosition(newPos, newScale));
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    stage.position(constrainStagePosition(stage.position(), stage.scaleX()));
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    setStagePos(stage.position());
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-neutral-100">
      <Stage
        width={size.width}
        height={size.height}
        draggable
        x={stagePos.x}
        y={stagePos.y}
        scaleX={stageScale}
        scaleY={stageScale}
        onWheel={handleWheel}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <Layer
          clipX={0}
          clipY={0}
          clipWidth={canvasWidth}
          clipHeight={canvasHeight}
        >
          {/* Canvas 경계 */}
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill="white"
            stroke="gray"
            strokeWidth={2}
          />

          {/* 테스트용 도형 */}
          <Circle
            x={canvasWidth / 2}
            y={canvasHeight / 2}
            radius={10}
            fill="red"
            draggable
          />

          <Text
            text="중앙"
            x={canvasWidth / 2 + 15}
            y={canvasHeight / 2 - 5}
            fontSize={15}
          />

          <Rect
            x={500}
            y={300}
            width={100}
            height={100}
            fill="skyblue"
            stroke="black"
            draggable
          />

          <Rect
            x={3000}
            y={3000}
            width={100}
            height={100}
            fill="lightgreen"
            stroke="black"
            draggable
          />
        </Layer>
      </Stage>
    </div>
  );
};

