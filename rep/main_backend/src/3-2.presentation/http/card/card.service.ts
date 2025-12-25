import { CreateCardUsecase, UploadingCardItemUsecase } from "@app/card/commands/usecase";
import { MultiPartResponseDataDto, UploadMultipartDataDto } from "@app/card/queries/dto";
import { AfterCreateCardItemDataInfo, CreateCardDto, CreateCardItemDataDto } from "@app/card/commands/dto";
import { HttpException, Injectable } from "@nestjs/common";
import { GetMultipartDataUrlUsecase } from "@app/card/queries/usecase";


@Injectable()
export class CardService {
  constructor(
    private readonly createCardUsecase : CreateCardUsecase<any>,
    private readonly createCardItemUsecase : UploadingCardItemUsecase<any, any, any>,
    private readonly getMultiPartDataUrlusecase : GetMultipartDataUrlUsecase<any, any, any>
  ) {}

  // card 생성과 관련된 service
  async createCardService( dto : CreateCardDto ) {
    try {
      const card_id : string = await this.createCardUsecase.execute(dto);
      return card_id;
    } catch (err) {
      throw new HttpException(
        {
          message: err.message || err,
          status: err.status || 500,
        },
        err.status || 500,
        {
          cause: err,
        },
      );
    };
  };

  // card_item 생성과 관련된 service
  async createCardItemService( dto : CreateCardItemDataDto ) : Promise<AfterCreateCardItemDataInfo> {
    try {
      const afterCardItemDto : AfterCreateCardItemDataInfo = await this.createCardItemUsecase.execute(dto);
      return afterCardItemDto
    } catch (err) {
      throw new HttpException(
        {
          message: err.message || err,
          status: err.status || 500,
        },
        err.status || 500,
        {
          cause: err,
        },
      );     
    };
  };

  async getPresignedUrlsService( dto : UploadMultipartDataDto ) : Promise<MultiPartResponseDataDto> {
    try {
      const presigend_urls : MultiPartResponseDataDto = await this.getMultiPartDataUrlusecase.execute(dto);
      return presigend_urls
    } catch (err) {
      throw new HttpException(
        {
          message: err.message || err,
          status: err.status || 500,
        },
        err.status || 500,
        {
          cause: err,
        },
      );     
    };
  };

};