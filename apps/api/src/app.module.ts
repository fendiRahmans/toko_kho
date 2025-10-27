import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',      // atau IP server
      port: 3306,
      username: 'root',
      password: '',           // isi sesuai password MySQL kamu
      database: 'toko_kho',
      entities: [User],
      synchronize: true,      // hanya untuk development
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
