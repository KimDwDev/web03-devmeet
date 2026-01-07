import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class JoinRoomValidate {

  @IsNotEmpty()
  @IsString()
  @MinLength(32)
  @MaxLength(32)
  code : string;

  @IsOptional()
  @IsString()
  @MaxLength(16) // 16글자로 정리 가능
  password? : string;
}