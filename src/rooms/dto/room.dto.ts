import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';
import { CoreOutput } from '../../common/dtos/output.dto';
import { RoomResult } from './rooms.dto';
import { User } from '../../users/entities/user.entity';

@InputType()
export class RoomInput {
  @Field((type) => Int)
  @IsInt()
  @Min(1)
  roomId: number;
}

@ObjectType()
export class RoomOutput extends CoreOutput {
  @Field((type) => RoomResult)
  results: RoomResult;
}
