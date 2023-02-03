import { Length, IsUrl, IsInt, IsString, IsOptional } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsInt()
  @IsOptional()
  price: number;

  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description: string;
}
