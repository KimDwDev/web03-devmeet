// card_item의 요소만 변경하고 싶을때 사용하는 usecase이다. 

import { Injectable } from "@nestjs/common";
import { UpdateCardItemDto } from "../dto";
import { UpdateValuesToDb } from "@app/ports/db/db.outbound";


export type UpdateCardItemsUsecaseProps<T> = {
  updateCardItems : UpdateValuesToDb<T>
};

@Injectable()
export class UpdateCardItemsUsecase<T> {

  private readonly updateCardItems : UpdateCardItemsUsecaseProps<T>["updateCardItems"];

  constructor({
    updateCardItems
  } : UpdateCardItemsUsecaseProps<T>) {
    this.updateCardItems = updateCardItems;
  }

  async execute( dtos : Array<UpdateCardItemDto> ) : Promise<void> {

    // 1. 수정하려는 card_item 정보를 입력해서 수정을 한다. 
    await this.updateCardItems.updates(dtos);

    // 나중에 추가할 거 더 없으려나?
  }

};