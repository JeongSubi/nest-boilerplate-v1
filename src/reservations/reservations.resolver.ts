import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import {
  CreateReservationInput,
  CreateReservationOutput,
} from './dto/create-reservation.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => CreateReservationOutput)
  async reservationRoom(
    @AuthUser() authUser: User,
    @Args('input') createReservationInput: CreateReservationInput,
  ): Promise<CreateReservationOutput> {
    return this.reservationsService.reservationRoom(
      createReservationInput,
      authUser,
    );
  }
}
