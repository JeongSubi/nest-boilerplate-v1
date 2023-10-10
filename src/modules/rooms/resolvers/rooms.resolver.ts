import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Room } from '@entities/room.entity';
import { AuthUser } from '@common/decorators/auth-user.decorator';
import { User } from '@entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@src/auth/guards/gql-auth.guard';
import { RoomsService } from '@modules/rooms/services/rooms.service';
import { RoomsInput, RoomsOutput } from '@modules/rooms/dto/rooms.dto';
import { LikeRoomInput, LikeRoomOutput } from '@modules/rooms/dto/like-room.dto';
import { RoomInput, RoomOutput } from '@modules/rooms/dto/room.dto';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomService: RoomsService) {}

  @Query((returns: void) => RoomsOutput)
  async rooms(
    @Args('input')
    roomsInput: RoomsInput,
  ): Promise<RoomsOutput> {
    return this.roomService.getRoomList(roomsInput);
  }

  @Query((returns: void) => RoomOutput)
  async room(
    @Args('input')
    roomInput: RoomInput,
  ): Promise<RoomOutput> {
    return this.roomService.getRoomById(roomInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns: void) => LikeRoomOutput)
  async likeRoom(
    @AuthUser() authUser: User,
    @Args('input') likeRoomInput: LikeRoomInput,
  ): Promise<LikeRoomOutput> {
    return this.roomService.likeRoom(likeRoomInput, authUser);
  }
}
