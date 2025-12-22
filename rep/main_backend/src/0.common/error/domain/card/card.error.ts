import { BaseError } from "../../error";


export class NotAllowStatusValue extends BaseError {
  constructor() {
    super({
      message: '카드에 상태를 다시 확인해주세요',
      status: 500,
    });
  };
};

export class NotAllowBackgroundColor extends BaseError {
  constructor() {
    super({
      message : "배경 색깔의 형식을 다시 확인해 주세요.",
      status : 500
    })
  };
};  