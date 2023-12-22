import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parking, User]), UsersModule],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService, ParkingModule],
})
export class ParkingModule {}
