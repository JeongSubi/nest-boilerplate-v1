import { Module } from '@nestjs/common';
import { TypeOrmModule }         from '@nestjs/typeorm';
import { CustomTypeOrmModule }   from '@common/custom.typeorm.module';
import { RoomRepository }        from '@modules/rooms/repositories/room-repository';
import { ReservationRepository } from '@modules/reservations/repositories/reservation-repository';
import { Reservation }           from '@entities/reservation.entity';
import { UtilModule }            from '@src/util/util.module';
import { ReservationsResolver }  from '@modules/reservations/reservations.resolver';
import { ReservationsService }   from '@modules/reservations/reservations.service';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([RoomRepository, ReservationRepository]),
    TypeOrmModule.forFeature([Reservation]),
    UtilModule,
  ],
  providers: [ReservationsResolver, ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
