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

  @Field()
  @Column()
  unit!: number;

  @Field(() => Device)
  @ManyToOne(() => Device, (device) => device.sensors)
  device!: Device;

  @Field(() => [Reading], { nullable: true })
  @OneToMany(() => Reading, (reading) => reading.sensor)
  readings?: Reading[];
}
