import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getMoney(user: User) {
    return user.money;
  }

  async onModuleInit(): Promise<boolean> {
    const users = await this.userRepository.find();

    if (!users.length) {
      await this.userRepository.save([
        {
          car_plate: 'aksdnkf',
          description: 'kasdkf',
          fullName: 'tuantm',
          role: 'admin',
          username: 'tuantm',
          password: await bcrypt.hash('123', 12),
        },
        {
          car_plate: '60A55655',
          description: 'pakwe;f',
          fullName: 'tuantm',
          role: 'user',
          username: 'tuantm1',
          password: await bcrypt.hash('123', 12),
        },
        {
          car_plate: '68A08749',
          description: 'pakwe;f',
          fullName: 'tuantm',
          role: 'user',
          username: 'tuantm2',
          password: await bcrypt.hash('123', 12),
        },
        {
          car_plate: '56N5162',
          description: 'pakwe;f',
          fullName: 'tuantm',
          role: 'user',
          username: 'tuantm3',
          password: await bcrypt.hash('123', 12),
        },
        {
          car_plate: '51H59540',
          description: 'pakwe;f',
          fullName: 'tuantm',
          role: 'user',
          username: 'tuantm4',
          password: await bcrypt.hash('123', 12),
        },
      ]);
      return true;
    }
    return false;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ id });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }
}
