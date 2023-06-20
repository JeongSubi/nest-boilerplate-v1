import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, Matches } from 'class-validator';

@InputType()
export class LoginInput {
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Matches(/((?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9가-힣]).{8,16})/, {
    message:
      '8~16 characters consisting of letters(a-z), numbers, or special characters.',
  })
  password?: string;
}

@ObjectType()
export class TokenInfo {
  @Field((type) => String)
  name: string;
  @Field((type) => String)
  value: string;
  @Field((type) => Number)
  maxAge: number;
}

@ObjectType()
export class LoginOutput {
  @Field((type) => String)
  accessToken: string;
  @Field((type) => String)
  refreshToken?: string;
}
