import { Transport } from 'mediasoup-client/types';

// track을 produce하는 헬퍼 함수들을 반환합니다.
export function createProduceHelper(sendTransport: Transport) {
  // 2) 실제 track produce 함수들
  const produceMic = (track: MediaStreamTrack) =>
    sendTransport.produce({
      track,
      appData: { type: 'mic' },
    });
  
  // can을 보낼때 VP8 or VP9일때 나누어서 처리하는 것이 좋다. 
  const produceCam = (track: MediaStreamTrack) =>
    sendTransport.produce({
      track,
      appData: { type: 'cam' },
      // simulcast 방식 ( 아래로 갈수록 고화질 )
      encodings: [
        { rid: 'r0', scaleResolutionDownBy: 4, maxBitrate: 150_000 },
        { rid: 'r1', scaleResolutionDownBy: 2, maxBitrate: 500_000 },
        { rid: 'r2', scaleResolutionDownBy: 1, maxBitrate: 1_200_000 },
      ],
      codecOptions: {
        videoGoogleStartBitrate: 600,
      },
    });

  const produceScreenVideo = (track: MediaStreamTrack) =>
    sendTransport.produce({
      track,
      appData: { type: 'screen_video' },
      encodings: [
        {
          maxBitrate: 1_500_000, // safari 같은 경우 VP9이 오류가 많아서 vp8로 할때는 좋은 화질로
        },
      ],
      codecOptions: {
        videoGoogleStartBitrate: 400,  // 화면공유에 시작 비트레이트는 낮게 
      },
    });

  const produceScreenAudio = (track: MediaStreamTrack) =>
    sendTransport.produce({
      track,
      appData: { type: 'screen_audio' },
    });

  return {
    produceMic,
    produceCam,
    produceScreenVideo,
    produceScreenAudio,
  };
}
