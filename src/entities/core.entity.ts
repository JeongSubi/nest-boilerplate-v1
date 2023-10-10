import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field((type: void) => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field((type: void) => Date)
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  @Field((type: void) => Date, { nullable: true })
  deletedAt: Date | null;
}
