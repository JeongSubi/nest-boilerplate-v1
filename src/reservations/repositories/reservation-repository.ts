import { Repository } from 'typeorm';
import { Reservation } from '@src/reservations/entities/reservation.entity';
import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';

@CustomRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {}
