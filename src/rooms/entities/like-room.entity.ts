import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Room } from './room.entity';

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
