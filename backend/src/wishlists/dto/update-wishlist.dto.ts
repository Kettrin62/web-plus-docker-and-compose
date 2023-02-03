import { Length, IsUrl, IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsArray()
  @IsOptional()
  itemsId: number[];
}
