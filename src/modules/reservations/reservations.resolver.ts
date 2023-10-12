import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Reservation } from '@entities/reservation.entity';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { GqlAuthGuard } from '@guards/gql-auth.guard';
import { AuthUser } from '@decorators/auth-user.decorator';
import { User } from '@entities/user.entity';
import {
  CreateReservationDto,
  CreateReservationOutput,
} from '@modules/reservations/dto/create-reservation.dto';

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation((returns: void) => CreateReservationOutput)
  async reservationRoom(
    @AuthUser() authUser: User,
    @Args('input') createReservationInput: CreateReservationDto,
  ): Promise<CreateReservationOutput> {
    return this.reservationsService.reservationRoom(createReservationInput, authUser);
  }
}
