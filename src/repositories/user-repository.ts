import { Repository } from 'typeorm';
import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { User } from '@entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async findUserById(id): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', {
        id,
      })
      .getOne();
  }

  async findOneUser(email): Promise<User> {
    const user = await this.findOne({
      where: {
        email,
      },
      select: { id: true, email: true, password: true, deletedAt: true },
    });
    return user;
  }

  async findUserByIdAndRefreshToken(id: number, refreshToken: string): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .andWhere('user.refreshToken = :refreshToken', { refreshToken })
      .getOne();
  }
}
