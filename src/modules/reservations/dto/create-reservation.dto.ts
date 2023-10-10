import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsInt, Min } from 'class-validator';
import { Reservation } from '@entities/reservation.entity';
import { CoreOutput } from '@common/dtos/output.dto';

@InputType()
export class CreateReservationDto {
  @Field((type: void) => Int)
  @IsInt()
  @Min(1)
  roomId: number;

  @Field((type: void) => Date)
  @IsDate()
  reservationDate: Date;
}

@ObjectType()
export class CreateReservationResult {
  @Field((type: void) => Reservation, { nullable: true })
  readonly reservation?: Reservation;
}

@ObjectType()
export class CreateReservationOutput extends CoreOutput {
  @Field((type: void) => CreateReservationResult, { nullable: true })
  readonly results?: CreateReservationResult;
}
