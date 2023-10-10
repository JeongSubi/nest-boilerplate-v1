import { Injectable } from '@nestjs/common';
import { RoomRepository } from '@repositories/room-repository';
import { ReservationRepository } from '@repositories/reservation-repository';
import { UtilService } from '@src/util/util.service';
import {
  CreateReservationDto,
  CreateReservationOutput,
} from '@modules/reservations/dto/create-reservation.dto';
import { ErrorCode } from '@common/enums/ErrorCodeEnum';
import { Reservation, Status } from '@entities/reservation.entity';
import { NotFoundError } from '@common/error/NotFoundError';
import { Room } from '@entities/room.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly utilService: UtilService,
  ) {}

  async reservationRoom(
    createReservationInput: CreateReservationDto,
    authUser,
  ): Promise<CreateReservationOutput> {
    const room: Room = await this.roomRepository.findRoomById(createReservationInput.roomId);

    if (!room) {
      throw new NotFoundError('room not found', ErrorCode.NOT_FOUND);
    }

    const setTimeReservationDate: Date = await this.utilService.setReservationTime(
      createReservationInput.reservationDate,
    );

    const reservedRoom: Room = await this.roomRepository.findReservedRoomByDate(
      createReservationInput.roomId,
      setTimeReservationDate,
    );

    if (reservedRoom) {
      throw new NotFoundError('Could not reserve room', ErrorCode.NOT_FOUND);
    }

    const reservationNumber: string = this.utilService.getRandomString();

    const newReservation: Reservation = Reservation.getInstance(
      authUser,
      room,
      createReservationInput.reservationDate,
      Status.RESERVATION,
      reservationNumber,
    );

    const reservation: Reservation = await this.reservationRepository.save(newReservation);

    return {
      ok: true,
      results: { reservation },
    };
  }
}
