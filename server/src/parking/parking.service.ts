import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { Repository } from 'typeorm';
import { CreateParkingDto } from './dtos/create-parking.dto';
import { ParkingStatus } from '../lib/enum/parking-status.enum';
import { UpdateParkingDto } from './dtos/update-parking.dto';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking) private repository: Repository<Parking>,
  ) {}

  async getAllParking(): Promise<Parking[]> {
    return this.repository.find();
  }

  async getParking(id: string): Promise<Parking> {
    const parking = await this.repository.findOneBy({ id });
    if (!parking) throw new Error('There is no parking with this ID');
    return parking;
  }

  async createParking(createParkingDto: CreateParkingDto): Promise<Parking> {
    const { number } = createParkingDto;
    return this.repository.save({ number, status: ParkingStatus.Empty });
  }

  async updateParking(id: string, updateParkingDto: UpdateParkingDto) {
    const parking = await this.getParking(id);
    parking.status = updateParkingDto.status;
    return this.repository.save(parking);
  }

  async deleteParking(id: string): Promise<void> {
    const _ = await this.getParking(id);
    void this.repository.delete({ id });
  }
}
