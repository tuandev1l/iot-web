import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  jwtHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const { refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) return next();

    try {
      const { id } = await this.jwtService.verifyAsync(accessToken, {
        publicKey: this.configService.get('JWT_SECRET'),
      });
      req.user = await this.usersService.findOne(id);
      return next();
    } catch (err) {}

    try {
      const { id } = this.jwtService.verify(refreshToken, {
        publicKey: this.configService.get('REFRESH_SECRET'),
      });
      console.log(this.configService.get('JWT_EXPIRE'));
      req.user = await this.usersService.findOne(id);
      res.cookie(
        'accessToken',
        this.authService.signToken(
          this.configService.get('JWT_SECRET'),
          id,
          this.configService.get('JWT_EXPIRE'),
        ),
      );
      return next();
    } catch (err) {
      console.log(err);
      return next();
    }
  };

  use(req: Request, res: Response, next: NextFunction) {
    return this.jwtHandler(req, res, next);
  }
}
