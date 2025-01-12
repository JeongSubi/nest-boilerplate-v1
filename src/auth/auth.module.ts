import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { CustomTypeOrmModule } from '@common/custom.typeorm.module';
import { UserRepository } from '@repositories/user-repository';
import { User } from '@src/entities/user.entity';
import { UsersModule } from '@modules/users/users.module';
import { AuthResolver } from '@auth/resolver/auth.resolver';
import { AuthService } from '@auth/service/auth.service';
import { JwtStrategy } from '@src/auth/passportStrategy/jwt.strategy';
import { LocalStrategy } from '@src/auth/passportStrategy/local.strategy';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule,
  ],
  providers: [AuthResolver, AuthService, JwtService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
