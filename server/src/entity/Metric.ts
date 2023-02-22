import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import Sensor from './Sensor';

@ObjectType()
@Entity()
export default class Metric extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  metricName!: string;

  @Field()
  @Column()
  unit!: string;

  @Field(() => [Sensor], { nullable: true })
  @OneToMany(() => Sensor, (sensor) => sensor.metric)
  sensors?: Sensor[];
}
