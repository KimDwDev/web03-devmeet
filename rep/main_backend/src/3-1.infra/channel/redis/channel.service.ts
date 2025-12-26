import { Inject, Injectable } from "@nestjs/common";
import {  type RedisClientType } from "redis";
import { REDIS_CHANNEL_PUB, REDIS_CHANNEL_SUB, SsePayload } from "../channel.constants";
import { Subject } from "rxjs";
import { ChannelError } from "@error/infra/infra.error";


// sse와 관련된 service 
@Injectable()
export class RedisSseBrokerService {

  // observable로 가져오고 next로 밀어넣을 수 있다.  
  private readonly subject = new Subject<{ channel : string, payload : SsePayload }>();

  constructor(
    @Inject(REDIS_CHANNEL_PUB) private readonly pub : RedisClientType,
    @Inject(REDIS_CHANNEL_SUB) private readonly sub : RedisClientType
  ) {}

  // 구독을 했을때 발생하는 시나리오 
  async subscribe(channel : string) {
    await this.sub.subscribe(channel, (message) => {
      try {
        // message가 SsePayload 규격에 맞는지 검사하는 로직이 필요해 보인다. -> 일단은 publish로 구독하게 하는 구조라서 아직까지 괜찮기는 하다. 

        //1. subscribe에 해당 channel에서 받은 message를 밀어 넣는다. 
        this.subject.next({
          channel,
          payload : JSON.parse(message)
        });
      } catch (err) {
        throw new ChannelError(err);
      }
    });
  };

  // 구독 채널에 전송
  async publish(channel : string, payload : SsePayload) {
    await this.pub.publish(channel, JSON.stringify(payload));
  };

  // 해당 subject를 받을 수 있다. 
  onEvents() {
    return this.subject.asObservable();
  };
};

// 나중에 websocket과 관련된 서비스도 있을 수 있다. 