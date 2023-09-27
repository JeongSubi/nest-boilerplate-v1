import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '@entities/user.entity';
import { Room } from '@entities/room.entity';
import { CoreEntity } from '@entities/core.entity';

export enum Status {
  RESERVATION = 'RESERVATION',
  REFUND = 'REFUND',
  USED = 'USED',
}

registerEnumType(Status, { name: 'Status' });

@ObjectType()
@Entity('reservation')
export class Reservation extends CoreEntity {
  @Column()
  reservationNumber: string;

  @Column({ type: 'timestamptz', primary: true })
  reservationDate: Date;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.reservation)
  user: User;

  @ManyToOne(() => Room, (room) => room.reservation)
  room: Room;

  constructor(user: User, room: Room, reservationDate: Date, status, reservationNumber: string) {
    super();
    this.user = user;
    this.room = room;
    this.reservationDate = reservationDate;
    this.status = status;
    this.reservationNumber = reservationNumber;
  }

  static getInstance(
    user: User,
    room: Room,
    reservationDate: Date,
    status: Status,
    reservationNumber: string,
  ) {
    return new Reservation(user, room, reservationDate, status, reservationNumber);
  }
}
