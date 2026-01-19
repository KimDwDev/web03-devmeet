'use client';

import Section from '@/components/whiteboard/sidebar/ui/Section';
import ColorPicker from '@/components/whiteboard/sidebar/ui/ColorPicker';

// 테두리 색상 설정 section
interface StrokeColorSectionProps {
  color: string;
  onChange: (color: string) => void;
  allowTransparent?: boolean;
}

export default function StrokeColorSection({
  color,
  onChange,
  allowTransparent = true,
}: StrokeColorSectionProps) {
  return (
    <Section title="Stroke">
      <ColorPicker
        color={color}
        onChange={onChange}
        allowTransparent={allowTransparent}
      />
    </Section>
  );
}
