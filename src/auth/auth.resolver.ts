import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { Input } from 'src/common/args/input.args';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUser } from './decorators/login-user.decorator';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation((type) => LoginOutput)
  async login(@Input() loginInput: LoginInput, @LoginUser() user: User) {
    return this.authService.login(user.id);
  }

  @Query((returns) => User)
  @UseGuards(GqlJwtAuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }
}
