'use client';

// section 컴포넌트 : 제목과 내용을 합친 컴포넌트
interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <div className={`flex flex-col gap-2`}>
      {title && (
        <h3 className="text-xs font-semibold text-black select-none">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
