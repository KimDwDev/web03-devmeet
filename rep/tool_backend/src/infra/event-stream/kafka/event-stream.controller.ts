import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";
import { EVENT_STREAM_NAME } from "../event-stream.constants";
import { ToolLeftDto } from "./event-stream.type";


@Controller()
export class MainConsumerController {

  private readonly logger = new Logger(MainConsumerController.name);

  constructor(

  ) {}

  @EventPattern(EVENT_STREAM_NAME.TOOL_LEFT)
  async toolLeft(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const value = message as ToolLeftDto; // 
    const topic = context.getTopic();
    const partition = context.getPartition();

    // value 검증
    if (!value?.room_id || !value?.user_id) {
      this.logger.warn(`[${topic}] invalid payload`);
      return;
    }

    // topic을 적는다.
    this.logger.log(
      `[${topic}] room=${value.room_id} user=${value.user_id} socket=${value.socket_id} partition=${partition}`,
    );

    try {

    } catch (err) {
      
    };
  };

};