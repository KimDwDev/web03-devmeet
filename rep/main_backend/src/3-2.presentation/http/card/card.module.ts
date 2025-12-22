import { Module } from "@nestjs/common";
import { CardController } from "./card.controller";
import { AuthModule } from "../auth/auth.module";
import { CardService } from "./card.service";
import { CreateCardUsecase } from "@app/card/commands/usecase";
import { CardIdGenerator } from "./card.interface";
import { InsertCardAndCardStateDataToMysql } from "@infra/db/mysql/card/card.outbound";


@Module({
  imports : [
    AuthModule
  ],
  controllers : [
    CardController
  ],
  providers : [
    CardService,
    CardIdGenerator,

    // card를 생성할때 사용하는 모듈
    InsertCardAndCardStateDataToMysql,
    {
      provide : CreateCardUsecase,
      useFactory : (
        cardIdGenrator : CardIdGenerator,
        insertCardAndCardStateToDb : InsertCardAndCardStateDataToMysql
      ) => {  
        return new CreateCardUsecase({
          cardIdGenrator, insertCardAndCardStateToDb
        });
      },
      inject : [
        CardIdGenerator, InsertCardAndCardStateDataToMysql
      ]
    }
  ],
})
export class CardModule{};