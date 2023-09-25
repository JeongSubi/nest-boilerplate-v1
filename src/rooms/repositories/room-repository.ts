import { Repository, SelectQueryBuilder } from 'typeorm';
import { CustomRepository } from '../../common/decorators/typeorm-ex.decorator';
import { Room } from '../entities/room.entity';
import { RoomsInput } from '../dto/rooms.dto';
import { RoomInput } from '../dto/room.dto';

@CustomRepository(Room)
export class RoomRepository extends Repository<Room> {
  getRoomBuilder() {
    return this.createQueryBuilder('room').select([
      'room.id',
      'room.createdAt',
      'room.roomName',
      'room.price',
      'room.coverImg',
      'room.streetAddress',
      'room.detailAddress',
      'room.zipCode',
      'room.roomType',
    ]);
  }

  async mappingBuilderById(builder: SelectQueryBuilder<Room>, roomInput: RoomInput) {
    if (roomInput.roomId) {
      builder.andWhere('room.id = :roomId', {
        roomId: roomInput.roomId,
      });
    }
    return builder;
  }

  async mappingBuilderByInput(builder: SelectQueryBuilder<Room>, roomsInput: RoomsInput) {
    if (roomsInput.roomName) {
      builder.andWhere('room.roomName LIKE :roomName', {
        roomName: `%${roomsInput.roomName.trim()}%`,
      });
    }
    return builder;
  }

  mappingBuilderBySkipAndTake(builder: SelectQueryBuilder<Room>, page: number, size: number) {
    return builder.skip((page - 1) * size).take(size);
  }

  async findRoomById(id: number) {
    return await this.createQueryBuilder('room')
      .where('room.id = :id', {
        id,
      })
      .getOne();
  }

  async findReservedRoomByDate(id: number, reservationDate: Date) {
    return await this.createQueryBuilder('room')
      .leftJoin('room.reservation', 'reservation')
      .select(['room.id'])
      .where('room.id = :id', {
        id,
      })
      .andWhere('reservation.reservationDate = :reservationDate', {
        reservationDate,
      })
      .getOne();
  }
}
