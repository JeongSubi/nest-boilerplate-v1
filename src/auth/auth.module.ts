import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { CustomTypeOrmModule } from '../common/custom.typeorm.module';
import { UserRepository } from '../users/repositories/user-repository';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './passportStrategy/jwt.strategy';
import { LocalStrategy } from './passportStrategy/local.strategy';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
