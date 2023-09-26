import { Injectable } from '@nestjs/common';
import { RoomRepository } from '@repositories/room-repository';
import { ReservationRepository } from '@repositories/reservation-repository';
import { UtilService } from '@src/util/util.service';
import {
  CreateReservationInput,
  CreateReservationOutput,
} from '@modules/reservations/dto/create-reservation.input';
import { ErrorCode } from '@common/error/errorCodeEnum/ErrorCodeEnum';
import { Reservation, Status } from '@entities/reservation.entity';
import { NotFoundError } from '@common/error/NotFoundError';

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
    await this.utilService.setReservationTime(createReservationInput.reservationDate);

    const room = await this.roomRepository.findRoomById(createReservationInput.roomId);

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
