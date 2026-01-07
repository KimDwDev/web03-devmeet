'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type MediaPermission = 'unknown' | 'granted' | 'denied';

export interface MediaState {
  videoOn: boolean;
  audioOn: boolean;
  cameraPermission: MediaPermission;
  micPermission: MediaPermission;
}

export const useMediaPreview = (micId?: string, cameraId?: string) => {
  const [media, setMedia] = useState<MediaState>({
    videoOn: false,
    audioOn: false,
    cameraPermission: 'unknown',
    micPermission: 'unknown',
  });

  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let audioTrack: MediaStreamTrack | null = null;
      let videoTrack: MediaStreamTrack | null = null;

      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: micId ? { deviceId: micId } : true,
          video: false,
        });
        audioTrack = audioStream.getAudioTracks()[0];

        if (cancelled) return;
        setMedia((prev) => ({
          ...prev,
          micPermission: 'granted',
          audioOn: audioTrack!.enabled,
        }));
      } catch {
        if (cancelled) return;
        setMedia((prev) => ({
          ...prev,
          micPermission: 'denied',
          audioOn: false,
        }));
      }

      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: cameraId ? { deviceId: cameraId } : true,
        });
        videoTrack = videoStream.getVideoTracks()[0];

        if (cancelled) return;
        setMedia((prev) => ({
          ...prev,
          cameraPermission: 'granted',
          videoOn: videoTrack!.enabled,
        }));
      } catch {
        if (cancelled) return;
        setMedia((prev) => ({
          ...prev,
          cameraPermission: 'denied',
          videoOn: false,
        }));
      }

      if (cancelled) return;

      // stream 합치기
      const tracks = [
        ...(audioTrack ? [audioTrack] : []),
        ...(videoTrack ? [videoTrack] : []),
      ];

      if (tracks.length > 0) {
        const combinedStream = new MediaStream(tracks);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = combinedStream;
        setStream(combinedStream);
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [micId, cameraId]);

  const toggleVideo = useCallback(() => {
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMedia((prev) => ({ ...prev, videoOn: track.enabled }));
    });
  }, []);

  const toggleAudio = useCallback(() => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMedia((prev) => ({ ...prev, audioOn: track.enabled }));
    });
  }, []);

  const canRenderVideo = useMemo(() => {
    return (
      media.videoOn && media.cameraPermission === 'granted' && stream !== null
    );
  }, [media.videoOn, media.cameraPermission, stream]);

  return {
    media,
    stream,
    canRenderVideo,
    toggleVideo,
    toggleAudio,
  };
};
