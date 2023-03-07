import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
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
  @Column({ type: 'timestamptz', nullable: true })
  timeStamp!: Date;

  @Field()
  @Column()
  content!: number;

  @Field(() => Sensor)
  @ManyToOne(() => Sensor, (sensor) => sensor.readings)
  sensor!: Sensor;
}
