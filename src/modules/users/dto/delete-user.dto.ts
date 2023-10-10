import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Matches } from 'class-validator';
import { CoreOutput } from '@common/dtos/output.dto';

@InputType()
export class DeleteUserInput {
  @Field((typev) => String)
  @Matches(/((?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9가-힣]).{8,16})/, {
    message: '8~16 characters consisting of letters(a-z), numbers, or special characters.',
  })
  readonly password?: string;
}

@ObjectType()
export class DeleteUserOutput extends CoreOutput {
  @Field((type: void) => String, { nullable: true })
  readonly results?: string;
}
