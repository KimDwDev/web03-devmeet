'use client';

import { apiWithToken } from '@/utils/apiClient';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  // 이후 전역 변수 등으로 회원 정보 추적 필요
  const [isLoggedIn] = useState(false);

  const logout = async () => {
    const { status } = await apiWithToken.delete<{ status: string }>(
      '/auth/logout',
    );
    if (status === 'ok') {
      window.location.href = '/landing';
    }
  };

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
        <div className="flex gap-2">
          <Link
            href="/login"
            className="flex h-10 items-center rounded-lg border border-sky-600 px-5 text-sm font-bold text-sky-600"
          >
            로그인
          </Link>

          {/* 테스트용 로그아웃 버튼 : /me 개발 후 삭제 */}
          <button
            className="flex h-10 items-center rounded-lg border border-sky-600 px-5 text-sm font-bold text-sky-600"
            onClick={logout}
          >
            로그아웃
          </button>
        </div>
      )}
    </header>
  );
}
