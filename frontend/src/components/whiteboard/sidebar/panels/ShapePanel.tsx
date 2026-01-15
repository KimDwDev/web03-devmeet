'use client';

import StrokeColorSection from '@/components/whiteboard/sidebar/sections/StrokeColorSection';
import BackgroundColorSection from '@/components/whiteboard/sidebar/sections/BackgroundColorSection';
import StrokeWidthSection from '@/components/whiteboard/sidebar/sections/StrokeWidthSection'; // 임포트 추가

// ShapePanel 컴포넌트
interface ShapePanelProps {
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  onChangeStrokeColor: (color: string) => void;
  onChangeBackgroundColor: (color: string) => void;
  onChangeStrokeWidth: (width: number) => void;
}

export default function ShapePanel({
  strokeColor,
  backgroundColor,
  strokeWidth,
  onChangeStrokeColor,
  onChangeBackgroundColor,
  onChangeStrokeWidth,
}: ShapePanelProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* 도형 테두리 색상 설정 섹션 */}
      <StrokeColorSection color={strokeColor} onChange={onChangeStrokeColor} />

      <div className="h-px w-full bg-neutral-100" />

      {/* 배경 색상 설정 섹션 */}
      <BackgroundColorSection
        color={backgroundColor}
        onChange={onChangeBackgroundColor}
      />

      <div className="h-px w-full bg-neutral-100" />

      {/* 두께 설정 섹션 */}
      <StrokeWidthSection
        strokeWidth={strokeWidth}
        onChange={onChangeStrokeWidth}
      />
    </div>
  );
}
