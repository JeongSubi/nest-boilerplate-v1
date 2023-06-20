import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsInt, Min } from 'class-validator';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Reservation } from '../entities/reservation.entity';

@InputType()
export class CreateReservationInput {
  @Field((type) => Int)
  @IsInt()
  @Min(1)
  roomId: number;

  @Field((type) => Date)
  @IsDate()
  reservationDate: Date;
}

@ObjectType()
export class CreateReservationResult {
  @Field((type) => Reservation, { nullable: true })
  readonly reservation?: Reservation;
}

@ObjectType()
export class CreateReservationOutput extends CoreOutput {
  @Field((type) => CreateReservationResult, { nullable: true })
  readonly results?: CreateReservationResult;
}
