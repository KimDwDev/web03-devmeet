'use client';

import StrokeColorSection from '@/components/whiteboard/sidebar/sections/StrokeColorSection';

// DrawingPanel 컴포넌트
interface DrawingPanelProps {
  stroke: string;
  onChangeStroke: (color: string) => void;
}

export default function DrawingPanel({
  stroke,
  onChangeStroke,
}: DrawingPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* 그리기 색상 설정 섹션 */}
      <StrokeColorSection
        color={stroke}
        onChange={onChangeStroke}
        allowTransparent={false}
      />
    </div>
  );
}
