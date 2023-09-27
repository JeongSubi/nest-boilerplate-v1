import { Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '@entities/core.entity';
import { User } from '@entities/user.entity';
import { Room } from '@entities/room.entity';

@Entity()
export class LikeRoom extends CoreEntity {
  @ManyToOne(() => User, (user) => user.likeRoom)
  user: User;

  @ManyToOne(() => Room, (room) => room.likeRoom)
  room: Room;

  constructor(user: User, room: Room) {
    super();
    this.user = user;
    this.room = room;
  }

  static getInstance(user: User, room: Room) {
    return new LikeRoom(user, room);
  }
}
