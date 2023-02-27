import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import Device from './Device';
import Metric from './Metric';
import Reading from './Reading';

@ObjectType()
@Entity()
export default class Sensor extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => Device)
  @ManyToOne(() => Device, (device) => device.sensors)
  device!: Device;

  @Field(() => Metric)
  @ManyToOne(() => Metric, (metric) => metric.sensors)
  metric!: Metric;

  @Field(() => [Reading], { nullable: true })
  @OneToMany(() => Reading, (reading) => reading.sensor)
  readings?: Reading[];
}
