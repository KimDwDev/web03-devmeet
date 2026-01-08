import { Global, Module } from "@nestjs/common";
import { MediasoupService } from "./mediasoup/media";


@Global()
@Module({
  providers : [
    MediasoupService,
  ],
  exports : [
    MediasoupService,
  ]
})
export class MediaModule {};