import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateReservationDto, CreateReservationOutput } from './dto/create-reservation.dto';
import { UseGuards } from '@nestjs/common';
import { Reservation } from '@entities/reservation.entity';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { GqlAuthGuard } from '@src/auth/guards/gql-auth.guard';
import { AuthUser } from '@common/decorators/auth-user.decorator';
import { User } from '@entities/user.entity';

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
