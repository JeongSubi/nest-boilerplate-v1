import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule }      from '@nestjs/passport';
import { UserRepository }      from '@modules/users/repositories/user-repository';
import { User }                from '@entities/user.entity';
import { UsersResolver }       from '@modules/users/resolvers/users.resolver';
import { UsersService }        from '@modules/users/services/users.service';
import { CustomTypeOrmModule } from '@common/custom.typeorm.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([User]),
    PassportModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
