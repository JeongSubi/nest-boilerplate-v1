import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy }       from 'passport-local';
import { UserRepository } from '@modules/users/repositories/user-repository';
import { User }           from '@src/entities/user.entity';
import { ErrorCode }      from '@common/error/errorCodeEnum/ErrorCodeEnum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    // usernameField 키 이름 변경 : email로 요청
    // passwordField 키 이름 변경 : password로 요청
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneUser(email);
    if (!user) {
      throw new NotFoundException('user not found', ErrorCode.USER_NOT_FOUND);
    }

    const passwordCorrect = await user.checkPassword(password);
    if (!passwordCorrect) {
      throw new UnauthorizedException('wrong password', ErrorCode.INVALID_PASSWORD);
    }

    return user;
  }
}
