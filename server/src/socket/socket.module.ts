import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { ParkingModule } from '../parking/parking.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from '../parking/entities/parking.entity';

@Module({
  imports: [ParkingModule, TypeOrmModule.forFeature([Parking])],
  controllers: [SocketController],
  providers: [SocketService],
})
export class SocketModule {}
