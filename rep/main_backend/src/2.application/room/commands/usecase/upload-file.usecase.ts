import { Injectable } from "@nestjs/common";


type UploadFileUsecaseProps<T> = {

};

@Injectable()
export class UploadFileUsecase<T> {

  constructor({

  } : UploadFileUsecaseProps<T>) {}

  async execute() {

    // 1. 이 유저가 방에 있는게 맞는지 확인
 
    // 2. upload용 url을 받아야 함 

    // 3. 전달 ( 저장을 할지 말지 고민이다. - 이건 만료를 하는게 맞긴하다. ) 

  };

};