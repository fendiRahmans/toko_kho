import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { Category } from './category/category.entity';
import { Product } from './product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',      // atau IP server
      port: 3306,
      username: 'root',
      password: '',           // isi sesuai password MySQL kamu
      database: 'toko_kho',
      entities: [User, Category, Product],
      synchronize: true,      // hanya untuk development
    }),
    UsersModule,
    AuthModule,
    CategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
