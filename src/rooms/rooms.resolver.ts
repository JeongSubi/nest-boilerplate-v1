import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { RoomsInput, RoomsOutput } from './dto/rooms.dto';
import { RoomInput, RoomOutput } from './dto/room.dto';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { LikeRoomInput, LikeRoomOutput } from './dto/like-room.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomService: RoomsService) {}

  @Query((returns) => RoomsOutput)
  async rooms(
    @Args('input')
    roomsInput: RoomsInput,
  ): Promise<RoomsOutput> {
    return this.roomService.getRoomList(roomsInput);
  }

  @Query((returns) => RoomOutput)
  async room(
    @Args('input')
    roomInput: RoomInput,
  ): Promise<RoomOutput> {
    return this.roomService.getRoomById(roomInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => LikeRoomOutput)
  async likeRoom(
    @AuthUser() authUser: User,
    @Args('input') likeRoomInput: LikeRoomInput,
  ): Promise<LikeRoomOutput> {
    return this.roomService.likeRoom(likeRoomInput, authUser);
  }
}
