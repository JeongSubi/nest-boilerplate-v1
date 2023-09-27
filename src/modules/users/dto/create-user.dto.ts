import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Matches } from 'class-validator';
import { Builder } from 'builder-pattern';
import { User } from '@entities/user.entity';
import { CoreOutput } from '@common/dtos/output.dto';

@InputType()
export class CreateUserInput {
  @Field((type) => String)
  @IsEmail()
  readonly email: string;

  @Field((type) => String)
  @Matches(/^[가-힣a-zA-Z]{2,20}$/, { message: 'please check your name' })
  readonly name: string;

  @Field((type) => String)
  @Matches(/((?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9가-힣]).{8,16})/, {
    message: '8~16 characters consisting of letters(a-z), numbers, or special characters.',
  })
  readonly password: string;

  @Field((type) => String)
  @IsString()
  readonly nickName: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  readonly phoneNumber?: string;

  toUserEntity(): User {
    return Builder(User)
      .email(this.email)
      .password(this.password)
      .name(this.name)
      .nickName(this.nickName)
      .phoneNumber(this.phoneNumber)
      .build();
  }

  static toDto(input: any): CreateUserInput {
    return Builder(CreateUserInput)
      .email(input.email)
      .name(input.name)
      .nickName(input.nickName)
      .phoneNumber(input.phoneNumber)
      .build();
  }
}

@ObjectType()
export class CreateUserResult {
  @Field((type) => User, { nullable: true })
  readonly user?: User;
}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field((type) => CreateUserResult, { nullable: true })
  readonly results?: CreateUserResult;
}
