import { Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Strategy } from 'passport-jwt';

const cookieExtractor = (req: Request) => {
  const { refreshToken } = req.cookies;
  return refreshToken;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('REFRESH_SECRET'),
    });
  }

  async validate(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Please login to access it');
    }
    return user;
  }
}
