import { DeleteResult, Repository } from 'typeorm';
import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { LikeRoom } from '@entities/like-room.entity';

@CustomRepository(LikeRoom)
export class LikeRoomRepository extends Repository<LikeRoom> {
  findLikeRoom(userId: number, likeRoomId: number): Promise<LikeRoom> {
    return this.createQueryBuilder('likeRooms')
      .innerJoinAndSelect('likeRooms.user', 'user')
      .innerJoinAndSelect('likeRooms.room', 'room')
      .where('user.id = :userId', { userId: userId })
      .andWhere('room.id = :roomId', {
        roomId: likeRoomId,
      })
      .getOne();
  }

  deleteLikeRoom(likeRoomId: number): Promise<DeleteResult> {
    return this.createQueryBuilder('likeRoom')
      .delete()
      .from(LikeRoom)
      .where('id = :id', { id: likeRoomId })
      .execute();
  }
}
