import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AuthCredentials } from './dtos/auth-credentials';
import { ConfigService } from '@nestjs/config/dist';
import { Response } from 'express';
import { SignupCredentials } from './dtos/signup.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

export interface Token {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  signToken = (name: string, id: string, expire: string | number) => {
    return this.jwtService.sign(
      { id },
      { privateKey: name, expiresIn: expire },
    );
  };

  returnToken = (id: string, res: Response, user: User) => {
    const accessToken = this.signToken(
      this.configService.get('JWT_SECRET'),
      id,
      this.configService.get('JWT_EXPIRE'),
    );
    const refreshToken = this.signToken(
      this.configService.get('REFRESH_SECRET'),
      id,
      this.configService.get('REFRESH_EXPIRE'),
    );
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    res.status(200).json({
      ...user,
      password: undefined,
    });
  };

  async signup(signupCredentials: SignupCredentials, res: Response) {
    const {
      password,
      username,
      passwordConfirm,
      description,
      fullName,
      car_plate,
    } = signupCredentials;

    if (password !== passwordConfirm)
      throw new BadRequestException(
        'Password and password confirm must be equal',
      );

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      password: hashedPassword,
      username,
      description,
      fullName,
      car_plate,
    });
    await this.userRepository.save(user);

    return this.returnToken(user.id, res, user);
  }

  async login(authCredentials: AuthCredentials, res: Response) {
    const { password, username } = authCredentials;

    const user = await this.userRepository.findOneByOrFail({ username });

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('Wrong password!');

    return this.returnToken(user.id, res, user);
  }
}
