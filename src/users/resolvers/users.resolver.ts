import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { CreateUserInput, CreateUserOutput } from '../dto/create-user.dto';
import { DeleteUserInput, DeleteUserOutput } from '../dto/delete-user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation((returns) => CreateUserOutput)
  signUp(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => DeleteUserOutput)
  signOut(
    @AuthUser() authUser: User,
    @Args('input') deleteUserInput: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    return this.userService.deleteUser(authUser, deleteUserInput);
  }
}
