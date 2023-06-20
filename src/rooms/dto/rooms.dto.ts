import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Builder } from 'builder-pattern';
import { BasicPaginationInput } from '../../common/dtos/basic-pagination.dto';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Room, RoomType } from '../entities/room.entity';
import { Column } from 'typeorm';

@InputType()
export class RoomsInput extends BasicPaginationInput {
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  roomName?: string;
}

@ObjectType()
export class RoomResult {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  roomName: string;

  @Field((type) => Int)
  price: number;

  @Field((type) => String)
  coverImg: string;

  @Field((type) => String)
  streetAddress: string;

  @Field((type) => String)
  detailAddress: string;

  @Field((type) => String)
  zipCode: string;

  @Field((type) => RoomType)
  roomType: RoomType;

  static toDto(room: Room): RoomResult {
    return Builder(RoomResult)
      .id(room.id)
      .roomName(room.roomName)
      .price(room.price)
      .coverImg(room.coverImg)
      .streetAddress(room.streetAddress)
      .detailAddress(room.detailAddress)
      .zipCode(room.zipCode)
      .roomType(room.roomType)
      .build();
  }
}

@ObjectType()
export class RoomResultWithHasNext {
  @Field((type) => [RoomResult])
  rooms: RoomResult[];

  @Field((type) => Boolean)
  hasNext: boolean;

  @Field((type) => Int)
  totalCount: number;

  static toDto(
    rooms: Room[],
    inputPage: number,
    totalCount: number,
  ): RoomResultWithHasNext {
    const results = rooms.map((el) => RoomResult.toDto(el));

    const pageCount = Math.ceil(
      totalCount / (rooms.length === 0 ? totalCount : rooms.length),
    );

    return Builder(RoomResultWithHasNext)
      .rooms(results)
      .hasNext(inputPage < pageCount)
      .totalCount(totalCount)
      .build();
  }
}

@ObjectType()
export class RoomsOutput extends CoreOutput {
  @Field((type) => RoomResultWithHasNext)
  results?: RoomResultWithHasNext;
}
