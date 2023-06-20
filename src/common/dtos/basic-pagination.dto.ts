import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@InputType()
export class BasicPaginationInput {
  @Field((type) => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page: number;

  @Field((type) => Int, { defaultValue: 12 })
  @IsInt()
  @Min(1)
  @Max(15)
  size: number;
}
