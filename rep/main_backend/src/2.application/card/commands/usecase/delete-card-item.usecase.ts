// 해당 card_item을 삭제하기 위한 로직
import { DeleteDatasToCache } from "@app/ports/cache/cache.outbound";
import { DeleteValuesToDb } from "@app/ports/db/db.outbound";
import { Injectable } from "@nestjs/common";
import { DeleteCardItemDtos } from "../dto";


type DeleteCardItemsUsecaseValues = {
  cardAssetNamespace : string; // card_asset용 namespace
};

type DeleteCardItemsUsecaseProps<T, CT> = {
  usecaseValues : DeleteCardItemsUsecaseValues;
  deleteCardItemAndAssetToDb : DeleteValuesToDb<T>; // db에서 card_item이랑 card_asset을 삭제하는 역할을 하고 
  deleteCardAssetToCache : DeleteDatasToCache<CT>; // cache에서 card_asset을 삭제하는 역할을 한다. 
};

@Injectable()
export class DeleteCardItemsUsecase<T, CT> {

  private readonly usecaseValues : DeleteCardItemsUsecaseProps<T, CT>["usecaseValues"]
  private readonly deleteCardItemAndAssetToDb : DeleteCardItemsUsecaseProps<T, CT>["deleteCardItemAndAssetToDb"];
  private readonly deleteCardAssetToCache : DeleteCardItemsUsecaseProps<T, CT>["deleteCardAssetToCache"];

  constructor({
    usecaseValues, deleteCardItemAndAssetToDb, deleteCardAssetToCache
  } : DeleteCardItemsUsecaseProps<T, CT>) {
    this.usecaseValues = usecaseValues;
    this.deleteCardItemAndAssetToDb = deleteCardItemAndAssetToDb;
    this.deleteCardAssetToCache = deleteCardAssetToCache;
  }

  async execute( dtos : DeleteCardItemDtos ) : Promise<void> {

    // 1. db에서 card_item, card_assets 삭제
    const namespaces : Array<string> = [];
    const inputs = dtos.item_ids.map((item_ids) => {
      const item_id : string = item_ids.item_id;
      namespaces.push(`${this.usecaseValues.cardAssetNamespace}:${dtos.card_id}:${item_id}`.trim());
      return { uniqueValue : item_id, addOption : undefined }
    });
    await this.deleteCardItemAndAssetToDb.deletes(inputs);

    // 2. cache에서 card_assets 정보 삭제
    await this.deleteCardAssetToCache.deleteNamespaces(namespaces);

  }

};