'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  // 이후 전역 변수 등으로 회원 정보 추적 필요
  const [isLoggedIn] = useState(false);

  return (
    <header className="fixed flex h-16 w-screen items-center justify-between border-b border-neutral-200 px-6">
      <Link href="/landing">로고</Link>

      {isLoggedIn ? (
        <button className="h-10 w-10 rounded-full bg-neutral-200">
          <Image
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            src="https://picsum.photos/id/237/200/100"
            alt="프로필 사진"
          />
        </button>
      ) : (
        <Link
          href="/login"
          className="flex h-10 items-center rounded-lg border border-sky-600 px-5 text-sm font-bold text-sky-600"
        >
          로그인
        </Link>
      )}
    </header>
  );
}
