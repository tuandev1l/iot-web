import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Parking } from './parking/entities/parking.entity';
import { User } from './users/entities/user.entity';
import { ParkingModule } from './parking/parking.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/jwt-middleware.middleware';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          synchronize: configService.get('DB_SYNCHRONIZE'),
          autoLoadEntities: process.env.NODE_ENV === 'dev',
          entities: [Parking, User],
        };
      },
    }),
    ParkingModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [JwtService, SocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
