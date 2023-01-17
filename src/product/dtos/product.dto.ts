import {
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateProductDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class virtualDeleteProductDto {
  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;
}

export class ProductResponseDto {
  id: string;
  name: string;
  price: number;
  isDeleted: boolean;

  //@Expose({ name: 'createdAt' })
  // transformCreatedAt() {
  //   return this.created_at;
  // }

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
