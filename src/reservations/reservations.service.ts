import { Injectable } from '@nestjs/common';
import {
  CreateReservationInput,
  CreateReservationOutput,
} from './dto/create-reservation.input';
import { NotFoundError } from '../common/error/NotFoundError';
import { ErrorCode } from '../common/error/errorCodeEnum/ErrorCodeEnum';
import { RoomRepository } from '../rooms/repositories/room-repository';
import { Reservation, Status } from './entities/reservation.entity';
import { ReservationRepository } from './repositories/reservation-repository';
import { UtilService } from '../util/util.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly utilService: UtilService,
  ) {}

  async reservationRoom(
    createReservationInput: CreateReservationInput,
    authUser,
  ): Promise<CreateReservationOutput> {
    await this.utilService.setReservationTime(
      createReservationInput.reservationDate,
    );

    const room = await this.roomRepository.findRoomById(
      createReservationInput.roomId,
    );

    if (!room) {
      throw new NotFoundError('room not found', ErrorCode.NOT_FOUND);
    }

    const reservedRoom = await this.roomRepository.findReservedRoomByDate(
      createReservationInput.roomId,
      createReservationInput.reservationDate,
    );

    if (reservedRoom) {
      throw new NotFoundError('Could not reserve room', ErrorCode.NOT_FOUND);
    }

    const reservationNumber = this.utilService.getRandomString();

    const newReservation = Reservation.getInstance(
      authUser,
      room,
      createReservationInput.reservationDate,
      Status.RESERVATION,
      reservationNumber,
    );

    const reservation = await this.reservationRepository.save(newReservation);

    return {
      ok: true,
      results: { reservation },
    };
  }
}
