export const REDIS_SERVER = Symbol('REDIS_SERVER');

export class InboundCache<T> {
  protected cache : T;
  constructor( cache : T ) {
    this.cache = cache;
  };
};

export class OutbouncCache<T> {
  protected cache : T;
  constructor( cache : T ) {
    this.cache = cache;
  };
};

export const streamKey = (roomId: string) => `cache:codeeditor:${roomId}:updates`;
export const encodeUpdate = (buf: Buffer) => buf.toString('base64'); // 기존 update를 문자열로 바꾼다. 
export const decodeUpdate = (b64: string) => Buffer.from(b64, 'base64'); // 문자열을 buffer 캐시로 바꾼다. 