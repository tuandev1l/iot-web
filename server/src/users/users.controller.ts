import { Controller, Get, Param, Delete } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersSevice: UsersService) {}

  @Get('')
  async getAllUsers(): Promise<User[]> {
    return this.usersSevice.findAll();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersSevice.findOne(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersSevice.delete(id);
  }
}
