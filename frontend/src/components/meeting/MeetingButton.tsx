import { ButtonHTMLAttributes, ReactNode } from 'react';

interface MeetingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  text: string;
}

export default function MeetingButton({
  icon,
  text,
  ...props
}: MeetingButtonProps) {
  return (
    <button
      {...props}
      className="flex h-16 w-22 flex-col items-center justify-center gap-0.5 rounded-lg text-neutral-200 hover:bg-neutral-700"
    >
      {icon}
      <span className="text-xs font-bold">{text}</span>
    </button>
  );
}
