import { useMeetingSocketStore } from '@/store/useMeetingSocketStore';
import { useMeetingStore } from '@/store/useMeetingStore';
import { createProduceHelper } from '@/utils/createProduceHelpers';
import { useMemo } from 'react';

export const useProduce = () => {
  const { sendTransport, setProducer, setIsProducing } =
    useMeetingSocketStore();
  const { setMedia } = useMeetingStore();

  // sendTransport가 초기화 된 이후 createProduceHelper 선언
  const helpers = useMemo(() => {
    if (!sendTransport) return null;
    return createProduceHelper(sendTransport);
  }, [sendTransport]);

  const startAudioProduce = async () => {
    // 함수가 호출되었을 시점의 값을 위해 getState() 사용
    const { producers, isProducing } = useMeetingSocketStore.getState();

    // 이미 Producer가 있거나, 현재 생성 중이라면(strictMode로 인한 2번 호출 방지) 리턴
    if (!helpers || producers.audioProducer || isProducing.audio) {
      return;
    }

    try {
      // audio produce에 대한 락 설정
      setIsProducing('audio', true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = stream.getAudioTracks()[0];

      const audioProducer = await helpers.produceMic(audioTrack);
      setProducer('audioProducer', audioProducer);
      setMedia({ audioOn: true });

      // 중간에 연결이 끊겼을 때의 핸들링
      audioProducer.on('trackended', () => {
        stopAudioProduce();
      });
    } catch (error) {
      console.error('마이크 시작 실패:', error);
    } finally {
      // 락 해제
      setIsProducing('audio', false);
    }
  };

  const stopAudioProduce = () => {
    const { audioProducer } = useMeetingSocketStore.getState().producers;

    if (audioProducer) {
      // Mediasoup 전송 중단
      audioProducer.close();
      // 실제 하드웨어 정지
      audioProducer.track?.stop();

      setProducer('audioProducer', null);
      setMedia({ audioOn: false });
    }
  };

  const startVideoProduce = () => {};

  const stopVideoProduce = () => {};

  const startScreenProduce = () => {};

  const stopScreenProduce = () => {};

  return {
    startAudioProduce,
    stopAudioProduce,
    startVideoProduce,
    stopVideoProduce,
    startScreenProduce,
    stopScreenProduce,
    isReady: !!helpers,
  };
};
