import {
  Length,
  IsUrl,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsArray()
  @IsNotEmpty()
  itemsId: number[];
}
