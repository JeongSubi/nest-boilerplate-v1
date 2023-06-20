import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { UserRepository } from './repositories/user-repository';
import { CustomTypeOrmModule } from '../common/custom.typeorm.module';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';

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
