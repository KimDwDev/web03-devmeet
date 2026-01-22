import {
  ConsumerInfo,
  MeetingMemberInfo,
  MemberConsumer,
} from '@/types/meeting';
import { Transport } from 'mediasoup-client/types';

export const getVideoConsumerIds = (
  members: Record<string, MeetingMemberInfo>,
  visibleMembers: MeetingMemberInfo[],
  consumers: Record<string, MemberConsumer>,
) => {
  const allMembers = Object.values(members);
  const visibleIdsSet = new Set(visibleMembers.map((member) => member.user_id));

  const newVideoConsumers: string[] = [];
  const visibleVideoIds: string[] = [];
  const hiddenVideoIds: string[] = [];

  allMembers.forEach((member) => {
    const producerId = member.cam?.provider_id;
    if (!producerId) return;

    if (visibleIdsSet.has(member.user_id)) {
      // 현재 화면에 보이는 비디오 ID들 (Resume 대상)
      visibleVideoIds.push(producerId);

      // 신규 Consume 대상 추출
      if (!consumers[member.user_id]?.video) {
        newVideoConsumers.push(producerId);
      }
    } else {
      // 다른 페이지의 비디오 ID들 (Pause 대상)
      hiddenVideoIds.push(producerId);
    }
  });

  return { newVideoConsumers, visibleVideoIds, hiddenVideoIds };
};

export const getConsumerInstances = async (
  recvTransport: Transport,
  newConsumersData: ConsumerInfo[],
) => {
  const consumerInstances = await Promise.all(
    newConsumersData.map(async (data) => {
      const { consumer_id, producer_id, kind, rtpParameters } = data;
      // 실제 Consumer 인스턴스 생성
      const consumer = await recvTransport.consume({
        id: consumer_id,
        producerId: producer_id,
        kind,
        rtpParameters,
        appData: {
          user_id: producer_id,
          type: kind === 'audio' ? 'mic' : kind === 'video' ? 'cam' : undefined,
          status: 'user',
        },
      });

      return {
        userId: producer_id,
        kind: data.kind,
        consumer: consumer,
      };
    }),
  );

  return consumerInstances;
};
