import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '@common/dtos/output.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Builder } from 'builder-pattern';

@InputType()
export class LikeRoomInput {
  @Field((type: void) => Int)
  @IsInt()
  @IsOptional()
  roomId: number;
}

@ObjectType()
export class LikeRoomResult {
  @Field((type: void) => Boolean)
  isLike: boolean;

  static toDto(isLike: boolean): LikeRoomResult {
    return Builder(LikeRoomResult).isLike(isLike).build();
  }
}

@ObjectType()
export class LikeRoomOutput extends CoreOutput {
  @Field((type: void) => LikeRoomResult)
  results?: LikeRoomResult;
}
