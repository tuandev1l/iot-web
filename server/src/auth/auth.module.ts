import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
