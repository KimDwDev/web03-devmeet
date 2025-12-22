import { CreateCardUsecase } from "@/2.application/card/commands/usecase";
import { CreateCardDto } from "@app/card/commands/dto";
import { HttpException, Injectable } from "@nestjs/common";


@Injectable()
export class CardService {
  constructor(
    private readonly createCardUsecase : CreateCardUsecase<any>,
  ) {}

  // card 생성과 관련된 service
  async CreateCardService( dto : CreateCardDto ) {
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

};