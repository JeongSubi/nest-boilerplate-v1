import { Module }              from '@nestjs/common';
import { RoomsService }        from './rooms.service';
import { RoomsResolver }       from './rooms.resolver';
import { CustomTypeOrmModule } from '@common/custom.typeorm.module';
import { TypeOrmModule }       from '@nestjs/typeorm';
import { RoomRepository }      from './repositories/room-repository';
import { Room }                from '@entities/room.entity';
import { UserRepository }      from '@modules/users/repositories/user-repository';
import { LikeRoomRepository }  from './repositories/like-room-repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([RoomRepository, UserRepository, LikeRoomRepository]),
    TypeOrmModule.forFeature([Room]),
  ],
  providers: [RoomsResolver, RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
