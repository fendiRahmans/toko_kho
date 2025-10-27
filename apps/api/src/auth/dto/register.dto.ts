import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'newuser@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
