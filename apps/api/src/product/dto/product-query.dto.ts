import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'iPhone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 2 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({ example: 1000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ example: 20000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxPrice?: number;
}
