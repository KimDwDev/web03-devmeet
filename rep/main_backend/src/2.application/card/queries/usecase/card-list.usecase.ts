// 실시간 카드 리스트 생성과 관련해서 가져오기 
import { SelectDataFromDb } from "@app/ports/db/db.inbound";
import { Injectable } from "@nestjs/common";
import { CardListDataProps } from "../dto";
import { SelectDatasFromCache } from "@app/ports/cache/cache.inbound";
import { InsertDataToCache } from "@app/ports/cache/cache.outbound";


type GetCardListUsecaseProps<T, CT> = {
  selectCardDataFromCache : SelectDatasFromCache<CT>; // cache에서 데이터를 찾도록 할 수 있다. 
  selectCardDataFromDb : SelectDataFromDb<T>; // 나중에 infra만 바꿀수 있고 이를 수정할 수도 있을것 같다. 
  insertCardDataToCache : InsertDataToCache<CT>; // card에 대한 데이터를 cache로 저장
};

@Injectable()
export class GetCardListUsecase<T, CT> {
  
  private readonly selectCardDataFromCache : GetCardListUsecaseProps<T, CT>["selectCardDataFromCache"];
  private readonly selectCardDataFromDb : GetCardListUsecaseProps<T, CT>["selectCardDataFromDb"];
  private readonly insertCardDataToCache : GetCardListUsecaseProps<T, CT>["insertCardDataToCache"];

  constructor({
    selectCardDataFromDb
  } : GetCardListUsecaseProps<T, CT>) {
    this.selectCardDataFromDb = selectCardDataFromDb;
  }

  async execute(keys : Array<string>) : Promise<CardListDataProps> {

    // 1. 먼저 cache에 저장된 데이터가 실제로 존재하는지 확인한다
    const cacheData : CardListDataProps = await this.selectCardDataFromCache.selects({ namespaces : [] });

    // 내가 정한 keys값만큼 모두 있는지 확인
    const checkCacheMissing = keys.filter((k) => !cacheData?.[k]);
    if ( checkCacheMissing.length === 0 ) return cacheData;

    // 2. 없다면 db에서 확인 -> 모두 빈 값이다 ( infra에서 custom 진행 )
    const dbData : CardListDataProps = await this.selectCardDataFromDb.select({ attributeName : "", attributeValue : "" });
    
    // 3. 없는 경우에 cache에 저장해서 다음에 들어오는 유저에게 좀더 좋은 경험을 선사한다. 
    await this.insertCardDataToCache.insert(dbData);

    return dbData;
  } 

};