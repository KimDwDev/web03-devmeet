'use client';

import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Transformer } from 'react-konva';
import type { WhiteboardItem } from '@/types/whiteboard';

interface RemoteSelectionIndicatorProps {
  selectedId: string;
  userColor: string;
  items: WhiteboardItem[];
  stageRef: React.RefObject<Konva.Stage | null>;
}

export default function RemoteSelectionIndicator({
  selectedId,
  userColor,
  items,
  stageRef,
}: RemoteSelectionIndicatorProps) {
  const transformerRef = useRef<Konva.Transformer | null>(null);

  const selectedItem = items.find((item) => item.id === selectedId);
  const isArrowOrLineSelected =
    selectedItem?.type === 'arrow' || selectedItem?.type === 'line';

  // Transformer 연결
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const stage = stageRef.current;

      if (selectedId && !isArrowOrLineSelected) {
        const selectedNode = stage.findOne('#' + selectedId);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer()?.batchDraw();
        } else {
          transformerRef.current.nodes([]);
        }
      } else {
        transformerRef.current.nodes([]);
      }
    }
  }, [selectedId, items, stageRef, isArrowOrLineSelected]);

  return (
    <Transformer
      ref={transformerRef}
      // 핸들 없이 테두리만 표시
      enabledAnchors={[]}
      rotateEnabled={false}
      borderStroke={userColor}
      borderStrokeWidth={3}
      padding={2}
    />
  );
}
