// card 자체를 수정하기 위한 usecase 라고 할 수 있다. 
import { UpdateDataToCache } from "@app/ports/cache/cache.outbound";
import { UpdateValueToDb } from "@app/ports/db/db.outbound";
import { Injectable } from "@nestjs/common";
import { UpdateCardInputDto } from "../dto";


type UpdateCardUsecaseValues = {
  cardNamespace : string;
};

type UpdateCardUsecaseProps<T, CT> = {
  usecaseValues : UpdateCardUsecaseValues;
  updateCardToDb : UpdateValueToDb<T>; // db에서 card에 정보를 수정할때 사용한다. 
  updateCardToCache : UpdateDataToCache<CT>; // cache에서 card에 정보를 수정할때 사용한다. ( 없으면 그냥 스킵 -> 하나만 있으면 안되기 때문이다. )
};

@Injectable()
export class UpdateCardUsecase<T, CT> {

  private readonly usecaseValues : UpdateCardUsecaseProps<T, CT>["usecaseValues"];
  private readonly updateCardToDb : UpdateCardUsecaseProps<T, CT>["updateCardToDb"];
  private readonly updateCardToCache : UpdateCardUsecaseProps<T, CT>["updateCardToCache"];

  constructor({
    usecaseValues, updateCardToDb, updateCardToCache
  } : UpdateCardUsecaseProps<T, CT>) {
    this.usecaseValues = usecaseValues;
    this.updateCardToDb = updateCardToDb;
    this.updateCardToCache = updateCardToCache;
  }

  async execute(dto : UpdateCardInputDto) : Promise<void> {

    // 1. db에 있는 데이터를 수정한다. -> card_id에 해당하는 dto에 값을 수정해야 한다. 
    await this.updateCardToDb.update({
      uniqueValue : dto.card_id,
      updateColName : "",
      updateValue : dto
    });
    
    // 2. cache에 있는 데이터를 수정한다. -> 하나만 바꾸는게 아니라 전체 변경
    const namespace : string = `${this.usecaseValues.cardNamespace}:${dto.card_id}`.trim();
    await this.updateCardToCache.updateKey({
      namespace, keyName : "", updateValue : dto
    });
  }

};