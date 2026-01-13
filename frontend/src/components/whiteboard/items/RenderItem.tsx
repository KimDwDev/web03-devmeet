'use client';

import { Text, Arrow, Line } from 'react-konva';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useCursorStyle } from '@/hooks/useCursorStyle';
import { useItemInteraction } from '@/hooks/useItemInteraction';
import type {
  TextItem,
  ArrowItem,
  WhiteboardItem,
  DrawingItem,
} from '@/types/whiteboard';

interface RenderItemProps {
  item: WhiteboardItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (newAttributes: Partial<WhiteboardItem>) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onArrowDblClick?: (id: string) => void;
}

export default function RenderItem({
  item,
  onSelect,
  onChange,
  onDragStart,
  onDragEnd,
  onArrowDblClick,
}: RenderItemProps) {
  const setEditingTextId = useCanvasStore((state) => state.setEditingTextId);

  // 아이템 인터랙션 상태
  const { isInteractive, isEraserMode, isDraggable, isListening } =
    useItemInteraction();

  // 커서 스타일 훅
  const { handleMouseEnter, handleMouseLeave } = useCursorStyle('move');

  // 텍스트 렌더링
  if (item.type === 'text') {
    const textItem = item as TextItem;
    return (
      <Text
        {...textItem}
        id={item.id}
        draggable={isDraggable}
        listening={isListening}
        onMouseDown={() => isInteractive && !isEraserMode && onSelect(item.id)}
        onTouchStart={() => isInteractive && !isEraserMode && onSelect(item.id)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDblClick={() => {
          if (!isInteractive || isEraserMode) return;
          setEditingTextId(item.id);
          onSelect(item.id);
        }}
        onDragEnd={(e) => {
          if (!isInteractive || isEraserMode) return;
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          if (!isInteractive || isEraserMode) return;
          const node = e.target;
          const scaleX = node.scaleX();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            rotation: node.rotation(),
          });
        }}
      />
    );
  }

  // 화살표 렌더링
  if (item.type === 'arrow') {
    const arrowItem = item as ArrowItem;
    return (
      <Arrow
        {...arrowItem}
        id={item.id}
        draggable={isDraggable}
        listening={isListening}
        hitStrokeWidth={30}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        onMouseDown={() => isInteractive && !isEraserMode && onSelect(item.id)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDblClick={() => {
          if (!isInteractive || isEraserMode) return;
          onArrowDblClick?.(item.id);
        }}
        onDragStart={() => {
          if (!isInteractive || isEraserMode) return;
          onDragStart?.();
        }}
        onDragEnd={(e) => {
          if (!isInteractive || isEraserMode) return;
          const pos = e.target.position();
          const newPoints = arrowItem.points.map((p, i) =>
            i % 2 === 0 ? p + pos.x : p + pos.y,
          );

          e.target.position({ x: 0, y: 0 });

          onChange({
            points: newPoints,
          });

          onDragEnd?.();
        }}
      />
    );
  }

  // 그리기 렌더링
  if (item.type === 'drawing') {
    const drawingItem = item as DrawingItem;
    return (
      <Line
        {...drawingItem}
        id={item.id}
        draggable={isDraggable}
        listening={isListening}
        hitStrokeWidth={30}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        onMouseDown={() => isInteractive && !isEraserMode && onSelect(item.id)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDragEnd={(e) => {
          if (!isInteractive || isEraserMode) return;
          const pos = e.target.position();
          const newPoints = drawingItem.points.map((p, i) =>
            i % 2 === 0 ? p + pos.x : p + pos.y,
          );

          e.target.position({ x: 0, y: 0 });

          onChange({
            points: newPoints,
          });
        }}
      />
    );
  }

  return null;
}
