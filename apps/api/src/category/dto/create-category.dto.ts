import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Elektronik' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Produk elektronik seperti TV, HP', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
