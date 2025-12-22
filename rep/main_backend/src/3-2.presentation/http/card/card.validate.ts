import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, Min } from "class-validator";


export class CreateCardValidate {

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  category_id : number;
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title : string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  workspace_width : number;
  
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  workspace_height : number;
  
  @IsString()
  @IsNotEmpty()
  @Matches(
  /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\))$/)
  background_color : string;
};