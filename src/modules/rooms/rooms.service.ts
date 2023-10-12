import { Injectable } from '@nestjs/common';
import { RoomRepository } from '@repositories/room-repository';
import { ConflictError } from '@error/ConflictError';
import { ErrorCode } from '@enums/ErrorCodeEnum';
import { UserRepository } from '@repositories/user-repository';
import { LikeRoomRepository } from '@repositories/like-room-repository';
import { NotFoundError } from '@error/NotFoundError';
import { LikeRoom } from '@entities/like-room.entity';
import {
  RoomResult,
  RoomResultWithHasNext,
  RoomsInput,
  RoomsOutput,
} from '@modules/rooms/dto/rooms.dto';
import { RoomInput, RoomOutput } from '@modules/rooms/dto/room.dto';
import { LikeRoomInput, LikeRoomOutput, LikeRoomResult } from '@modules/rooms/dto/like-room.dto';
import { SelectQueryBuilder } from 'typeorm';
import { Room } from '@entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
    private readonly likeRoomRepository: LikeRoomRepository,
  ) {}

  async getRoomList(roomsInput: RoomsInput): Promise<RoomsOutput> {
    const builder: SelectQueryBuilder<Room> = this.roomRepository.getRoomBuilder();

    const inputMappedBuilder: SelectQueryBuilder<Room> =
      await this.roomRepository.mappingBuilderByInput(builder, roomsInput);

    const skipAndTakeMappedBuilder: SelectQueryBuilder<Room> =
      this.roomRepository.mappingBuilderBySkipAndTake(
        inputMappedBuilder,
        roomsInput.page,
        roomsInput.size,
      );

    const [rooms, totalCount] = await skipAndTakeMappedBuilder.getManyAndCount();

    if (rooms.length === 0) {
      throw new ConflictError('Room not found', ErrorCode.NOT_FOUND);
    }

    const results: RoomResultWithHasNext = RoomResultWithHasNext.toDto(
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
    const builder: SelectQueryBuilder<Room> = this.roomRepository.getRoomBuilder();

    const inputMappedBuilder: SelectQueryBuilder<Room> =
      await this.roomRepository.mappingBuilderById(builder, roomInput);

    const room: Room = await inputMappedBuilder.getOne();

    if (!room) {
      throw new ConflictError('Room not found by roomId', ErrorCode.NOT_FOUND);
    }

    const results: RoomResult = RoomResult.toDto(room);

    return {
      ok: true,
      results,
    };
  }

  async likeRoom(likeRoomInput: LikeRoomInput, authUser): Promise<LikeRoomOutput> {
    const room: Room = await this.roomRepository.findRoomById(likeRoomInput.roomId);
    if (!room) {
      throw new NotFoundError('room not found', ErrorCode.NOT_FOUND);
    }

    const roomLike: LikeRoom = await this.likeRoomRepository.findLikeRoom(
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

    const roomLikeToChange: LikeRoom = LikeRoom.getInstance(authUser, room);
    await this.likeRoomRepository.save(roomLikeToChange);

    return {
      ok: true,
      results: LikeRoomResult.toDto(true),
    };
  }
}
