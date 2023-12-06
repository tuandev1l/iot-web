import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parking])],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
