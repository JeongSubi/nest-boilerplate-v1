import { ObjectType } from '@nestjs/graphql';
import { Entity, Unique, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from '@entities/core.entity';
import { LikeRoom } from '@entities/like-room.entity';
import { Reservation } from '@entities/reservation.entity';

@ObjectType()
@Entity('user')
@Unique('unique_member_email_constraint', ['email'])
export class User extends CoreEntity {
  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column()
  nickName: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({
    type: String,
    nullable: true,
  })
  refreshToken: string | null;

  @OneToMany((type) => LikeRoom, (likeRoom) => likeRoom.user)
  likeRoom: LikeRoom[];

  @OneToMany((type) => Reservation, (reservation) => reservation.user)
  reservation: Reservation[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(inputPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  setRefreshToken(tokenValue: string | null) {
    this.refreshToken = tokenValue;
  }
}
