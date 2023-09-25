import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UserRepository } from '@src/users/repositories/user-repository';
import { LoginInput, LoginOutput, TokenInfo } from '@src/auth/dto/login.dto';
import { TOKEN_ISSUER } from '@common/common.constants';
import { TokenType } from '@common/enums/common.enums';
import { ErrorCode } from '@common/error/errorCodeEnum/ErrorCodeEnum';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
    private userRepository: UserRepository,
  ) {}

  // async login(loginInput: LoginInput): Promise<LoginOutput> {
  //   const user = await this.userRepository.findOneUser(loginInput.email);
  //
  //   if (!user) {
  //     throw new ConflictError('User not found', ErrorCode.USER_NOT_FOUND);
  //   }
  //
  //   const passwordCorrect = await user.checkPassword(loginInput.password);
  //
  //   if (!passwordCorrect) {
  //     throw new ConflictError('Invalid password', ErrorCode.INVALID_PASSWORD);
  //   }
  //
  //   const accessTokenInfo = await this.createAccessToken(user.id);
  //   const refreshTokenInfo = await this.createRefreshToken(user.id);
  //
  //   return {
  //     accessToken: accessTokenInfo.value,
  //     refreshToken: refreshTokenInfo.value,
  //   };
  // }

  async login(userId: number): Promise<LoginOutput> {
    const accessTokenInfo = this.createAccessToken(userId);
    const refreshTokenInfo = await this.createRefreshToken(userId);

    return {
      accessToken: accessTokenInfo.value,
      refreshToken: refreshTokenInfo.value,
    };
  }

  createAccessToken(userId: number): TokenInfo {
    const payload: JwtPayload = { userId, issuer: TOKEN_ISSUER };
    const maxAgeByMs = this.getMaxAge(TokenType.access);
    const maxAgeBySeconds = maxAgeByMs / 1000;
    // 액세스 토큰 발급
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: maxAgeBySeconds,
    });
    return {
      name: TokenType.access,
      value: token,
      maxAge: maxAgeByMs,
    };
  }

  async createRefreshToken(userId: number): Promise<TokenInfo> {
    const payload: JwtPayload = { userId, issuer: TOKEN_ISSUER };
    const maxAgeByMs = this.getMaxAge(TokenType.refresh);
    const maxAgeBySeconds = maxAgeByMs / 1000;
    // 리프레시 토큰 발급
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: maxAgeBySeconds,
    });
    // 리프레시 토큰은 DB에 저장
    await this.saveRefreshToken(userId, token);
    return {
      name: TokenType.refresh,
      value: token,
      maxAge: maxAgeByMs,
    };
  }

  getMaxAge(type: TokenType): number {
    switch (type) {
      case TokenType.access:
        const oneHour = 1 * 60 * 60 * 1000;
        return oneHour;
      case TokenType.refresh:
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        return oneMonth;
    }
  }

  async saveRefreshToken(userId: number, tokenValue: string): Promise<void> {
    return this.dataSource.manager
      .transaction(async (manager) => {
        const userRepository = await manager.withRepository(this.userRepository);
        const existUser = await userRepository.findUserById(userId);
        existUser.setRefreshToken(tokenValue);
        await userRepository.save(existUser);
      })
      .catch((error) => {
        console.error(error);
        throw new InternalServerErrorException();
      });
  }

  validateAccessToken(token: string): JwtDecodeWithExpired {
    const secretKey = process.env.JWT_ACCESS_SECRET ? process.env.JWT_ACCESS_SECRET : 'dev';

    try {
      const payload = this.jwtService.verify(token, { secret: secretKey });
      return { ...payload, isTokenExpired: false };
    } catch (err) {
      if (err instanceof TokenExpiredError) return { isTokenExpired: true };
      else if (err instanceof JsonWebTokenError)
        throw new UnauthorizedException('Invalid Token', ErrorCode.INVALID_TOKEN);
      else throw new InternalServerErrorException();
    }
  }

  validateRefreshToken(token: string): JwtDecodeWithExpired {
    const secretKey = process.env.JWT_REFRESH_SECRET ? process.env.JWT_REFRESH_SECRET : 'dev';

    try {
      const payload = this.jwtService.verify(token, { secret: secretKey });
      return { ...payload, isTokenExpired: false };
    } catch (err) {
      if (err instanceof TokenExpiredError) return { isTokenExpired: true };
      else if (err instanceof JsonWebTokenError)
        throw new UnauthorizedException('Invalid Token', ErrorCode.INVALID_TOKEN);
      else throw new InternalServerErrorException();
    }
  }

  validateTokenExpiredInMinutes = (decodedToken, minutes: number) => {
    // token 기간 체크
    const tokenExp = new Date(decodedToken['exp'] * 1000);
    const now = new Date();

    // 남은시간 (분)
    const betweenTime = Math.floor((tokenExp.getTime() - now.getTime()) / 1000 / 60);

    if (betweenTime < minutes) return true;
    return false;
  };

  async validateUser(loginInput: LoginInput) {
    console.log('-----------AuthService.login()------------');

    const result = await this.userRepository.findOneUser(loginInput.email);

    if (!result) {
      throw new NotFoundException('user not found', ErrorCode.USER_NOT_FOUND);
    }

    const payload: JwtPayload = { userId: result.id, issuer: 'JEONGSUBI' };
    const maxAgeByMs = this.getMaxAge(TokenType.access);
    const maxAgeBySeconds = maxAgeByMs / 1000;

    const passwordCorrect = await result.checkPassword(loginInput.password);

    if (!passwordCorrect) {
      throw new UnauthorizedException('wrong password', ErrorCode.INVALID_PASSWORD);
    }

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: maxAgeBySeconds,
      }),
    };
  }
}
