import { SelectDataFromCache } from "@app/ports/cache/cache.inbound";
import { Inject, Injectable } from "@nestjs/common";
import { type RedisClientType } from "redis";
import { CACHE_CARD_ITEM_ASSET_KEY_NAME, REDIS_SERVER } from "../../cache.constants";
import { CardItemAssetProps, cardItemAssetStatusList, CardItemAssetStatusProps } from "@domain/card/vo";


@Injectable()
export class SelectCardItemAssetFromRedis extends SelectDataFromCache<RedisClientType<any, any>> {

  constructor(
    @Inject(REDIS_SERVER) cache : RedisClientType<any, any>
  ) { super(cache); };

  private isStatusValue(value : unknown) : value is CardItemAssetStatusProps {
    return (
      typeof value === "string" && 
      ( cardItemAssetStatusList as readonly string[] ).includes(value)
    )
  }

  async select({ namespace, keyName }: { namespace: string; keyName: string; }): Promise<Required<CardItemAssetProps> | undefined> {
    
    const cache = this.cache;

    const cardItemAsset = await cache.hGetAll(namespace);

    if ( !cardItemAsset || Object.keys(cardItemAsset).length === 0 ) return undefined;

    const card_id = cardItemAsset[CACHE_CARD_ITEM_ASSET_KEY_NAME.CARD_ID];
    const item_id = cardItemAsset[CACHE_CARD_ITEM_ASSET_KEY_NAME.ITEM_ID];
    const key_name = cardItemAsset[CACHE_CARD_ITEM_ASSET_KEY_NAME.KEY_NAME];
    const mime_type = cardItemAsset[CACHE_CARD_ITEM_ASSET_KEY_NAME.MIME_TYPE];
    const size = Number(cardItemAsset[CACHE_CARD_ITEM_ASSET_KEY_NAME.SIZE]);

    // 값이 없다면 undefined를 반환한다.
    if (!card_id || !item_id || !key_name || !mime_type || size === undefined)
      return undefined;

    const status = cardItemAsset[CACHE_CARD_ITEM_ASSET_KEY_NAME.STATUS];
    if ( !this.isStatusValue(status) ) return undefined;

    const now = new Date();
    return {
      card_id, item_id, key_name, mime_type, size, status, created_at : now, updated_at : now
    };
  };

};