import { CamOffIcon, MicOffIcon } from '@/assets/icons/meeting';
import Button from '@/components/common/button';
import VideoView from './VideoView';
import { useMediaPreview } from '@/hooks/useMediaPreview';

export function MediaPreview() {
  const { media, stream, canRenderVideo, toggleAudio, toggleVideo } =
    useMediaPreview();

  return (
    <div
      className={`relative box-border h-90 w-160 overflow-hidden rounded-2xl bg-neutral-700 ${!canRenderVideo && 'p-4'}`}
    >
      {/* Video Layer */}
      {canRenderVideo && stream && <VideoView stream={stream} />}

      {/* Placeholder Layer */}
      {!canRenderVideo && (
        <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
          <p className="text-sm font-bold text-white">
            마이크와 카메라를 사용하려면
            <br />
            접근 권한이 필요해요
          </p>

          {media.cameraPermission !== 'granted' && (
            <Button size="sm" shape="square" className="px-3 py-2 text-sm">
              마이크 및 카메라 접근 허용
            </Button>
          )}
        </div>
      )}

      {/* Control Layer */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-6">
        <button onClick={toggleVideo}>
          <CamOffIcon className="h-12 w-12 rounded-full bg-white p-4 text-neutral-700 shadow-lg" />
        </button>

        <button onClick={toggleAudio}>
          <MicOffIcon className="h-12 w-12 rounded-full bg-white p-4 text-neutral-700 shadow-lg" />
        </button>
      </div>
    </div>
  );
}
