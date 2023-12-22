import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { Repository } from 'typeorm';
import { CreateParkingDto } from './dtos/create-parking.dto';
import { UpdateParkingDto } from './dtos/update-parking.dto';
import { AddingMoney } from './dtos/addingMoney.dto';
import * as Stripe from 'stripe';
import * as process from 'process';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ParkingService implements OnModuleInit {
  // @ts-ignore
  private stripe = new Stripe(process.env.STRIPE_SECRET);

  constructor(
    @InjectRepository(Parking) private repository: Repository<Parking>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<boolean> {
    const parkings = await this.repository.find();

    if (!parkings.length) {
      for (let i = 1; i <= 3; i++) {
        await this.repository.save({
          isParked: false,
          number: i,
        });
      }
      return true;
    }
    return false;
  }

  async checkingPlate(body: { plate: string }) {
    const user = await this.userRepository.findOneBy({ car_plate: body.plate });
    if (!user) throw new NotFoundException();
    return user;
  }

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
    return this.repository.save({ number, isParked: false });
  }

  async updateParking(id: string, updateParkingDto: UpdateParkingDto) {
    const parking = await this.getParking(id);
    parking.isParked = updateParkingDto.isParked;
    return this.repository.save(parking);
  }

  async deleteParking(id: string): Promise<void> {
    const _ = await this.getParking(id);
    void this.repository.delete({ id });
  }

  async addMoney(user: User, amount: AddingMoney) {
    if (amount.id && user.id === amount.id) {
      user.money += amount.amount;
      return this.userRepository.save(user);
    }
    return user;
  }

  async createStripeSession(user: User, amount: AddingMoney) {
    const lineItems = [
      {
        price_data: {
          currency: 'vnd',
          product_data: { name: 'Thanh toán phí gửi xe' },
          unit_amount: amount.amount,
        },
        quantity: 1,
      },
    ];
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:5173/success?id=${user.id}&amount=${amount.amount}`,
      cancel_url: 'http://localhost:5173/error',
    });

    return { id: session.id };
  }

  async getParkingSlot() {
    return this.repository.findOneBy({
      isParked: false,
    });
  }

  async getAllParkingSlots() {
    const parkingSlots = await this.repository.find();
    return parkingSlots.reverse();
  }
}
