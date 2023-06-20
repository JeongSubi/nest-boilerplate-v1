import { Injectable } from '@nestjs/common';
import {
  RoomResult,
  RoomResultWithHasNext,
  RoomsInput,
  RoomsOutput,
} from './dto/rooms.dto';
import { RoomRepository } from './repositories/room-repository';
import { RoomInput, RoomOutput } from './dto/room.dto';
import { ConflictError } from '../common/error/ConflictError';
import { ErrorCode } from '../common/error/errorCodeEnum/ErrorCodeEnum';
import {
  LikeRoomInput,
  LikeRoomOutput,
  LikeRoomResult,
} from './dto/like-room.dto';
import { UserRepository } from '../users/repositories/user-repository';
import { LikeRoomRepository } from './repositories/like-room-repository';
import { NotFoundError } from '../common/error/NotFoundError';
import {LikeRoom} from "./entities/like-room.entity";

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
    private readonly likeRoomRepository: LikeRoomRepository,
  ) {}

  async getRoomList(roomsInput: RoomsInput): Promise<RoomsOutput> {
    const builder = this.roomRepository.getRoomBuilder();

    const inputMappedBuilder = await this.roomRepository.mappingBuilderByInput(
      builder,
      roomsInput,
    );

    const skipAndTakeMappedBuilder =
      this.roomRepository.mappingBuilderBySkipAndTake(
        inputMappedBuilder,
        roomsInput.page,
        roomsInput.size,
      );

    const [rooms, totalCount] =
      await skipAndTakeMappedBuilder.getManyAndCount();

    if (rooms.length === 0) {
      throw new ConflictError('Room not found', ErrorCode.NOT_FOUND);
    }

    const results = RoomResultWithHasNext.toDto(
      rooms,
      roomsInput.page,
      totalCount,
    );

    return {
      ok: true,
      results,
    };
  }

  async getRoomById(roomInput: RoomInput): Promise<RoomOutput> {
    const builder = this.roomRepository.getRoomBuilder();

    const inputMappedBuilder = await this.roomRepository.mappingBuilderById(
      builder,
      roomInput,
    );

    const room = await inputMappedBuilder.getOne();

    if (!room) {
      throw new ConflictError('Room not found by roomId', ErrorCode.NOT_FOUND);
    }

    const results = RoomResult.toDto(room);

    return {
      ok: true,
      results,
    };
  }

  async likeRoom(
    likeRoomInput: LikeRoomInput,
    authUser,
  ): Promise<LikeRoomOutput> {
    const room = await this.roomRepository.findRoomById(likeRoomInput.roomId)
    if (!room) {
      throw new NotFoundError('room not found', ErrorCode.NOT_FOUND);
    }

    const roomLike = await this.likeRoomRepository.findLikeRoom(
      authUser.id,
      likeRoomInput.roomId,
    );

    if (roomLike) {
      await this.likeRoomRepository.deleteLikeRoom(roomLike.id);

      return {
        ok: true,
        results: LikeRoomResult.toDto(false),
      };
    }

    const roomLikeToChange = LikeRoom.getInstance(authUser, room);
    await this.likeRoomRepository.save(roomLikeToChange);

    return {
      ok: true,
      results: LikeRoomResult.toDto(true),
    };
  }
}
