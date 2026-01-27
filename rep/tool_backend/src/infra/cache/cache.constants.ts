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