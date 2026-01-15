'use client';

import { DUMMY_MEETING_INFO } from '@/app/[meetingId]/dummy';
import Modal from '@/components/common/Modal';
import MeetingLobby from '@/components/meeting/MeetingLobby';
import MeetingRoom from '@/components/meeting/MeetingRoom';
import { useMeetingSocket } from '@/hooks/useMeetingSocket';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

export default function MeetingPage() {
  const { socket } = useMeetingSocket();

  // 이후 실제 회의 정보 API 호출로 수정 필요
  const { password } = DUMMY_MEETING_INFO;

  const params = useParams<{ meetingId: string }>();
  const meetingId = params.meetingId;

  const passwordRef = useRef<HTMLInputElement>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  // 회의실 비밀번호 유무로 분기 처리
  const validateJoin = () => {
    if (password) {
      setIsPasswordModalOpen(true);
    } else {
      handleJoin();
    }
  };

  // 비밀번호 검증
  const onPasswordConfirm = () => {
    const value = passwordRef.current?.value;

    // 비밀번호 검증 API 호출 필요
    if (value === password) {
      setIsPasswordModalOpen(true);
      handleJoin();
    } else {
      setIsPasswordModalOpen(false);
      setIsPasswordError(true);
    }
  };

  // 회의실 참여 로직
  const handleJoin = () => {
    setIsJoined(true);
  };

  if (!meetingId) {
    return <div>잘못된 회의 접근입니다. 다시 시도해주세요.</div>;
  }

  return (
    <main className="min-h-screen">
      {!isJoined ? (
        <>
          <MeetingLobby meetingId={meetingId} onJoin={validateJoin} />
          {isPasswordModalOpen && (
            <Modal
              title="비밀번호 입력"
              cancelText="취소"
              onCancel={() => setIsPasswordModalOpen(false)}
              confirmText="확인"
              onConfirm={onPasswordConfirm}
              isLightMode
            >
              <input ref={passwordRef} className="input-sm input-light" />
            </Modal>
          )}
          {isPasswordError && (
            <Modal
              title="입장 실패"
              cancelText="확인"
              onCancel={() => {
                setIsPasswordError(false);
                setIsPasswordModalOpen(true);
              }}
              isLightMode
            >
              비밀번호를 확인해주세요
            </Modal>
          )}
        </>
      ) : (
        <MeetingRoom meetingId={meetingId} />
      )}
    </main>
  );
}
