import { IdGenerator } from "@domain/shared";
import { Injectable } from "@nestjs/common";
import { v7 as uuidV7 } from "uuid";


@Injectable()
export class CardIdGenerator implements IdGenerator {
  constructor() {}

  generate(): string {
    const user_id: string = uuidV7();
    return user_id;
  };
};