import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '@common/dtos/output.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Builder } from 'builder-pattern';

@InputType()
export class LikeRoomInput {
  @Field((type) => Int)
  @IsInt()
  @IsOptional()
  roomId: number;
}

@ObjectType()
export class LikeRoomResult {
  @Field((type) => Boolean)
  isLike: boolean;

  static toDto(isLike: boolean): LikeRoomResult {
    return Builder(LikeRoomResult).isLike(isLike).build();
  }
}

@ObjectType()
export class LikeRoomOutput extends CoreOutput {
  @Field((type) => LikeRoomResult)
  results?: LikeRoomResult;
}
