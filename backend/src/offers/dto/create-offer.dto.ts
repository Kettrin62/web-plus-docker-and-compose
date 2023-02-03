import { IsNotEmpty, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsInt()
  @IsNotEmpty()
  itemId: number;
}
