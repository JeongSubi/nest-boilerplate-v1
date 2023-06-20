import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CustomTypeOrmModule } from './custom.typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/repositories/user-repository';
import { User } from '../users/entities/user.entity';

@Global()
@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
