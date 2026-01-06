import Button from '../common/button';
import { MediaPreview } from './media/MediaPreview';

export default function MeetingLobby({
  meetingId,
  onJoin,
}: {
  meetingId: string;
  onJoin: () => void;
}) {
  const meetingLeader = 'Tony';
  const meetingMemberCnt = 9;

  return (
    <main className="box-border flex min-h-screen items-center justify-center gap-20 px-6 py-4">
      {/* 영상, 마이크 설정 부분 */}
      <section className="flex w-full max-w-160 flex-col gap-6">
        <MediaPreview />

        {/* TODO: control button */}
        <div className="flex w-full items-center gap-4 text-sm">
          <button className="w-full rounded-sm border px-3 py-2">
            sample button1
          </button>

          <button className="w-full rounded-sm border px-3 py-2">
            sample button1
          </button>

          <button className="w-full rounded-sm border px-3 py-2">
            sample button1
          </button>
        </div>
      </section>

      {/* 회의 참여 부분 */}
      <section className="flex w-full max-w-60 flex-col items-center justify-center">
        <h1 className="mb-2 text-2xl text-neutral-900">
          <b>{meetingLeader}</b> 님의 회의실
        </h1>
        <span className="text-base text-neutral-600">
          현재 참여자: {meetingMemberCnt}명
        </span>

        <Button className="mt-6" onClick={onJoin}>
          회의 참여하기
        </Button>
      </section>
    </main>
  );
}
