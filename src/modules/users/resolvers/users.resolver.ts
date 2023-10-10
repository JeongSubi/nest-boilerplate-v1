import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from '@modules/users/dto/create-user.dto';
import { UsersService } from '@modules/users/services/users.service';
import { User } from '@entities/user.entity';
import { GqlAuthGuard } from '@src/auth/guards/gql-auth.guard';
import { DeleteUserInput, DeleteUserOutput } from '@modules/users/dto/delete-user.dto';
import { AuthUser } from '@common/decorators/auth-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation((returns: void) => CreateUserOutput)
  signUp(@Args('input') createUserInput: CreateUserInput): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns: void) => DeleteUserOutput)
  signOut(
    @AuthUser() authUser: User,
    @Args('input') deleteUserInput: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    return this.userService.deleteUser(authUser, deleteUserInput);
  }
}
