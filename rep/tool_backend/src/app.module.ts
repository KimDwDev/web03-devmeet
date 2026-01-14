import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { RedisCacheModule } from '@infra/cache/redis/cache';
import { RedisChannelModule } from '@infra/channel/redis/channel';
import { MysqlModule } from '@infra/db/mysql/db';
import CookieParser from "cookie-parser";


@Module({
  imports: [
    ConfigModule.forRoot({}),

    // infra 모듈
    RedisCacheModule,
    RedisChannelModule,
    MysqlModule,

    // 추가 모듈
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(CookieParser())
    .forRoutes({ path : "*", method : RequestMethod.ALL })
  }
}
