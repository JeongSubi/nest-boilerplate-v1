import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsResolver } from './reservations.resolver';
import { CustomTypeOrmModule } from '../common/custom.typeorm.module';
import { RoomRepository } from '../rooms/repositories/room-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './repositories/reservation-repository';
import { UtilModule } from '../util/util.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      RoomRepository,
      ReservationRepository,
    ]),
    TypeOrmModule.forFeature([Reservation]),
    UtilModule,
  ],
  providers: [ReservationsResolver, ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
