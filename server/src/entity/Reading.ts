import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import Sensor from './Sensor';

@ObjectType()
@Entity()
export default class Reading extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  // @Column({ type: 'timestamptz', nullable: true })
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @Column('decimal', { precision: 6, scale: 2 })
  content!: number;

  @Field(() => Sensor)
  @ManyToOne(() => Sensor, (sensor) => sensor.readings)
  sensor!: Sensor;
}
