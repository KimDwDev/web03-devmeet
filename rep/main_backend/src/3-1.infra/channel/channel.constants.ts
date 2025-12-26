

// 퍼블리셔 symbol
export const REDIS_CHANNEL_PUB = Symbol("REDIS_CHANNEL_PUB");

// 구독자 symbol
export const REDIS_CHANNEL_SUB = Symbol("REDIS_CHANNEL_SUB");

export const CHANNEL_SSE_NAME = Object.freeze({
  CARD_ITEMS : "sse:card_items" // card_id, list 이런식으로 채널을 만들어나갈 수 있을 것 같다. ( card_id로만 item들을 모두 볼 수 있게 설정할 예정 ) 
} as const);

export type SsePayload = {
  data : any;
};