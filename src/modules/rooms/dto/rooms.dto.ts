import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Builder } from 'builder-pattern';
import { BasicPaginationInput } from '@common/dtos/basic-pagination.dto';
import { CoreOutput } from '@common/dtos/output.dto';
import { Room, RoomType } from '@entities/room.entity';

@InputType()
export class RoomsInput extends BasicPaginationInput {
  @Field((type: void) => String, { nullable: true })
  @IsString()
  @IsOptional()
  roomName?: string;
}

@ObjectType()
export class RoomResult {
  @Field((type: void) => Int)
  id: number;

  @Field((type: void) => String)
  roomName: string;

  @Field((type: void) => Int)
  price: number;

  @Field((type: void) => String)
  coverImg: string;

  @Field((type: void) => String)
  streetAddress: string;

  @Field((type: void) => String)
  detailAddress: string;

  @Field((type: void) => String)
  zipCode: string;

  @Field((type: void) => RoomType)
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
  @Field((type: void) => [RoomResult])
  rooms: RoomResult[];

  @Field((type: void) => Boolean)
  hasNext: boolean;

  @Field((type: void) => Int)
  totalCount: number;

  static toDto(rooms: Room[], inputPage: number, totalCount: number): RoomResultWithHasNext {
    const results: RoomResult[] = rooms.map((el: Room) => RoomResult.toDto(el));

    const pageCount: number = Math.ceil(
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
  @Field((type: void) => RoomResultWithHasNext)
  results?: RoomResultWithHasNext;
}
