import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { ParkingModule } from '../parking/parking.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from '../parking/entities/parking.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ParkingModule,
    UsersModule,
    TypeOrmModule.forFeature([Parking, User]),
  ],
  controllers: [SocketController],
  providers: [SocketService],
})
export class SocketModule {}
