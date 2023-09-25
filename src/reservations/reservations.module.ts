import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomTypeOrmModule } from '@common/custom.typeorm.module';
import { RoomRepository } from '@src/rooms/repositories/room-repository';
import { ReservationRepository } from '@src/reservations/repositories/reservation-repository';
import { Reservation } from '@src/reservations/entities/reservation.entity';
import { UtilModule } from '@src/util/util.module';
import { ReservationsResolver } from '@src/reservations/reservations.resolver';
import { ReservationsService } from '@src/reservations/reservations.service';

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
