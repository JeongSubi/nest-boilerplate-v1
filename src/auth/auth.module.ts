import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { CustomTypeOrmModule } from '@common/custom.typeorm.module';
import { UserRepository } from '@src/users/repositories/user-repository';
import { User }           from '@src/entities/user.entity';
import { UsersModule }    from '@src/users/users.module';
import { AuthResolver } from '@src/auth/auth.resolver';
import { AuthService } from '@src/auth/auth.service';
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
