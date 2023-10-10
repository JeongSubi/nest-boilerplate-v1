import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ErrorCode } from '@common/enums/ErrorCodeEnum';
import { UserRepository } from '@repositories/user-repository';
import { GqlAuthGuard } from '@src/auth/guards/gql-auth.guard';
import { AuthService } from '@src/auth/auth.service';
import { JwtDecodeWithExpired } from '@common/types/auth.type';
import { User } from '@entities/user.entity';

@Injectable()
export class GqlJwtAuthGuard extends GqlAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  private getTokenValueFromAuthorization(value: string) {
    if (!value) return null;
    return value.split('Bearer ')[1];
  }

  private async validateRefreshToken(refreshToken: string) {
    // 리프레시 토큰 검증
    const payload: JwtDecodeWithExpired = this.authService.validateRefreshToken(refreshToken);
    const isTokenExpired: boolean = payload.isTokenExpired
      ? payload.isTokenExpired
      : this.authService.validateTokenExpiredInMinutes(payload, 3);
    if (isTokenExpired) {
      throw new UnauthorizedException('Refresh Token Expired', ErrorCode.EXPIRED_TOKEN);
    }

    const user: User = await this.userRepository.findUserByIdAndRefreshToken(
      payload.userId,
      refreshToken,
    );
    if (!user) throw new UnauthorizedException('User Not Found', ErrorCode.USER_NOT_FOUND);

    return { payload, isTokenExpired };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const { authorization, refreshtoken } = gqlContext.req.headers;
    const refreshTokenValidateResult = await this.validateRefreshToken(refreshtoken);

    const accessToken: string = this.getTokenValueFromAuthorization(authorization);
    const accessTokenNotExist: boolean = !accessToken || accessToken === '';
    let payload: any;

    /**
     * 액세스 토큰이 없는 경우 리프레시 토큰 검증한 후 액세스 토큰 재발급
     */
    if (accessTokenNotExist) {
      if (refreshTokenValidateResult.payload === null) {
        throw new UnauthorizedException('Refresh Token Required', ErrorCode.REFRESH_TOKEN_REQUIRED);
      }
      payload = refreshTokenValidateResult.payload;
      /**
       *  액세스 토큰 재발급
       */
      const { value } = this.authService.createAccessToken(payload.userId);
      gqlContext.res.setHeader('New-Access-Token', value);
    } else {
      /**
       *  액세스 토큰이 존재하는 경우 액세스 토큰 만료 여부 확인 후 액세스 토큰 재발급
       */
      payload = this.authService.validateAccessToken(accessToken);
      const isAccessTokenExpired = payload.isTokenExpired
        ? payload.isTokenExpired
        : this.authService.validateTokenExpiredInMinutes(payload, 3);

      if (isAccessTokenExpired) {
        /**
         * 액세스 토큰 재발급
         */
        const { value } = this.authService.createAccessToken(payload.userId);
        gqlContext.res.setHeader('New-Access-Token', value);
      }
    }

    const user: User = await this.userRepository.findUserById(payload.userId);

    if (user) {
      gqlContext.req.user = user;
      return true;
    } else {
      throw new UnauthorizedException('User Not Found', ErrorCode.USER_NOT_FOUND);
    }
  }
}
