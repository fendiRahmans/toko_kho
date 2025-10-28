import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 14' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Smartphone terbaru dari Apple', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 19999.99 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1, description: 'ID dari kategori produk' })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
