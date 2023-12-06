import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dtos/create-parking.dto';
import { UpdateParkingDto } from './dtos/update-parking.dto';

@Controller('parking')
export class ParkingController {
  constructor(private readonly service: ParkingService) {}

  @Get()
  async getAllParking() {
    return this.service.getAllParking();
  }

  @Post()
  async createParking(@Body() createParkingDto: CreateParkingDto) {
    return this.service.createParking(createParkingDto);
  }

  @Patch('/:id')
  async updateParking(
    @Param('id') id: string,
    @Body() updateParkingDto: UpdateParkingDto,
  ) {
    return this.service.updateParking(id, updateParkingDto);
  }

  @Delete('/:id')
  async deleteParking(@Param('id') id: string) {
    return this.service.deleteParking(id);
  }
}
