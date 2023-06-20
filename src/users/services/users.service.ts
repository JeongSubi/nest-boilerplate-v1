import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { CreateUserInput, CreateUserOutput } from '../dto/create-user.dto';
import { ErrorCode } from '../../common/error/errorCodeEnum/ErrorCodeEnum';
import { ConflictError } from '../../common/error/ConflictError';
import { DeleteUserInput, DeleteUserOutput } from '../dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput | null> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserInput.email,
    });

    if (existingUser) {
      throw new ConflictError(
        'There is a user with that email already',
        ErrorCode.DUPLICATED_EMAIL,
      );
    }

    const newUser = createUserInput.toUserEntity();
    const user = await this.userRepository.save(newUser);

    return { ok: true, results: { user } };
  }

  async deleteUser(
    authUser,
    deleteUserInput: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    const existUser = await this.userRepository.findOne({
      where: { id: authUser.id },
      select: { id: true, email: true, password: true },
    });

    if (existUser) {
      const passwordCorrect = existUser.checkPassword(deleteUserInput.password);

      if (!passwordCorrect) {
        throw new UnauthorizedException(
          'wrong password',
          ErrorCode.INVALID_PASSWORD,
        );
      }
    }

    await this.userRepository.softRemove(existUser);

    return {
      ok: true,
      results: 'user deleted',
    };
  }
}
