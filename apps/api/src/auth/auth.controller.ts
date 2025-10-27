import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User berhasil registrasi' })
  @ApiResponse({ status: 400, description: 'Email sudah terdaftar' })
  async register(@Body() body: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(body.email);
    if (existingUser) throw new BadRequestException('Email sudah terdaftar');

    const user = await this.usersService.create(body.email, body.password);
    return { message: 'Registrasi berhasil', user: { id: user.id, email: user.email } };
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login berhasil, token dikembalikan' })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
}
