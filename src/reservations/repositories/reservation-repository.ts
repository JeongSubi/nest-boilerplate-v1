import { Repository, SelectQueryBuilder } from 'typeorm';
import { CustomRepository } from '../../common/decorators/typeorm-ex.decorator';

import { Reservation } from '../entities/reservation.entity';

@CustomRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {}
