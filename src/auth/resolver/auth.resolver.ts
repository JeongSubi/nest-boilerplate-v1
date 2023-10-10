import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Auth } from '@entities/auth.entity';
import { AuthService } from '@auth/service/auth.service';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { Input } from '@args/input.args';
import { LoginInput, LoginOutput } from '@auth/dto/login.dto';
import { LoginUser } from '@decorators/login-user.decorator';
import { User } from '@entities/user.entity';
import { GqlJwtAuthGuard } from '@guards/gql-jwt-auth.guard';
import { AuthUser } from '@decorators/auth-user.decorator';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation((type: void) => LoginOutput)
  async login(@Input() loginInput: LoginInput, @LoginUser() user: User): Promise<LoginOutput> {
    return this.authService.login(user.id);
  }

  @Query((returns: void) => {
    return User;
  })
  @UseGuards(GqlJwtAuthGuard)
  me(@AuthUser() authUser: User): User {
    return authUser;
  }
}
