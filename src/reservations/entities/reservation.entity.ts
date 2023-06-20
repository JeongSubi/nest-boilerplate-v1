import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

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

  constructor(
    user: User,
    room: Room,
    reservationDate: Date,
    status,
    reservationNumber: string,
  ) {
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
    return new Reservation(
      user,
      room,
      reservationDate,
      status,
      reservationNumber,
    );
  }
}