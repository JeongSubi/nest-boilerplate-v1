import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '@entities/core.entity';
import { Reservation } from '@entities/reservation.entity';
import { LikeRoom } from '@entities/like-room.entity';

export enum RoomType {
  HOTEL = 'HOTEL',
  RESORT = 'RESORT',
  MOTEL = 'MOTEL',
  PENSION = 'PENSION',
  CAMPING = 'CAMPING',
}

registerEnumType(RoomType, { name: 'RoomType' });

@ObjectType()
@Entity('room')
export class Room extends CoreEntity {
  @Column({ name: 'room_name' })
  roomName: string;

  @Column()
  price: number;

  @Column()
  coverImg: string;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @Column({ name: 'detail_address' })
  detailAddress: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  roomType: RoomType;

  @OneToMany((type) => LikeRoom, (likeRoom) => likeRoom.room)
  likeRoom: LikeRoom[];

  @OneToMany((type) => Reservation, (reservation) => reservation.room)
  reservation: Reservation[];
}
