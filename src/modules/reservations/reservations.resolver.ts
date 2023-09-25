import { Resolver, Query, Mutation, Args }                 from '@nestjs/graphql';
import { CreateReservationInput, CreateReservationOutput } from './dto/create-reservation.input';
import { UseGuards }                                       from '@nestjs/common';
import { Reservation }                                     from '@entities/reservation.entity';
import { ReservationsService }                             from '@modules/reservations/reservations.service';
import { GqlAuthGuard }                                    from '@src/auth/guards/gql-auth.guard';
import { AuthUser }                                        from '@common/decorators/auth-user.decorator';
import { User }                                            from '@entities/user.entity';

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => CreateReservationOutput)
  async reservationRoom(
    @AuthUser() authUser: User,
    @Args('input') createReservationInput: CreateReservationInput,
  ): Promise<CreateReservationOutput> {
    return this.reservationsService.reservationRoom(createReservationInput, authUser);
  }
}
