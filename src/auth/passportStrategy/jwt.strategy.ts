import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@repositories/user-repository';
import { ErrorCode } from '@common/enums/ErrorCodeEnum';
import { JwtPayload } from '@common/types/auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('------------------------------');
    console.log('jwt strategy, validate()');
    const user = await this.userRepository.findUserById(payload.userId);

    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('User Not Found', ErrorCode.USER_NOT_FOUND);
    }

    console.log('------------------------------');
  }
}
