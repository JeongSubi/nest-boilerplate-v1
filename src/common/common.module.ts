import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomTypeOrmModule } from '@common/custom.typeorm.module';
import { UserRepository } from '@src/users/repositories/user-repository';
import { User }           from '@src/entities/user.entity';
import { CommonService }  from '@common/common.service';

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
