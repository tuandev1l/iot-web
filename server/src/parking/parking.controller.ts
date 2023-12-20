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
  constructor(private readonly service: ParkingService) {}

  private cnt = 0;
  private imgs = ['MV9tMzZxaHA', 'Ml9yb2F5YjU', 'M195dHc5MnM', 'NF9oNG55ZXI'];
  private res = ['60A55655', '68A08749', '56N5162', '51H59540'];

  @Get('spoof/in')
  async carInSpoof() {
    this.cnt++;

    if (this.cnt > 3) this.cnt = 3;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000);
    });

    return {
      img: `https://res-console.cloudinary.com/dfa7qyx7z/thumbnails/v1/image/upload/v1702904927/${
        this.imgs[this.cnt - 1]
      }=/grid_landscape`,
      res: this.res[this.cnt - 1],
    };
  }

  @HttpCode(200)
  @Post('/checking')
  async checkingPlate(@Body() body: { plate: string }) {
    return this.service.checkingPlate(body);
  }

  @Get('spoof/out')
  async carOutSpoof() {
    this.cnt--;

    if (this.cnt < 0) this.cnt = 0;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000);
    });

    return {
      img: `https://res-console.cloudinary.com/dfa7qyx7z/thumbnails/v1/image/upload/v1702904927/${
        this.imgs[this.cnt + 1]
      }=/grid_landscape`,
      res: this.res[this.cnt + 1],
    };
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
