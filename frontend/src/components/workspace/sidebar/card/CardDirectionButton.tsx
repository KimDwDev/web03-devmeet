'use client';

import React from 'react';

interface CardDirectionButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function CardDirectionButton({
  label,
  isActive,
  onClick,
}: CardDirectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-md font-md flex-1 rounded-md border py-2 transition ${
        isActive
          ? 'border-green-500 bg-[#EBFDB6] text-green-900'
          : 'border-gray-500 bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
