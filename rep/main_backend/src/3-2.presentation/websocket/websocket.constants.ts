

// websocket 연결할때 사용하는 namespace
export const WEBSOCKET_NAMESPACE = Object.freeze({
  SIGNALING : "/api/ws/signal"
} as const);

export const WEBSOCKET_AUTH_CLIENT_EVENT_NAME = Object.freeze({
  ACCESS_TOKEN : "auth:ws:access_token",
  ERROR : "auth:ws:error"
} as const);

// 
export const WEBSOCKET_SIGNALING_CLIENT_EVENT_NAME = Object.freeze({

} as const);