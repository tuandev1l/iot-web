import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../users/get-user.decorator';
import { AddingMoney } from './dtos/addingMoney.dto';
import { CreateParkingDto } from './dtos/create-parking.dto';
import { UpdateParkingDto } from './dtos/update-parking.dto';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  private cnt = 0;

  constructor(private readonly service: ParkingService) {}

  @HttpCode(200)
  @Post('/checking')
  async checkingPlate(@Body() body: { plate: string; isIn: boolean }) {
    return this.service.checkingPlate(body);
  }

  @Get('/paying-money')
  async payingMoney(@GetUser() user: User) {
    return this.service.payingMoney(user);
  }

  @Get('/slots')
  async getAllParkingSlots() {
    return this.service.getAllParkingSlots();
  }

  @Post('/addingMoney')
  async addingMoney(@GetUser() user: User, @Body() amount: AddingMoney) {
    return this.service.addMoney(user, amount);
  }

  @Post('/createStripeSession')
  async createStripeSession(
    @GetUser() user: User,
    @Body() amount: AddingMoney,
  ) {
    return this.service.createStripeSession(user, amount);
  }

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
