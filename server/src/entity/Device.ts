import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import Sensor from './Sensor';
import User from './User';

@ObjectType()
@Entity()
export default class Device extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  type!: string;

  @Field()
  @Column()
  description!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.devices)
  user!: User;

  @Field(() => [Sensor], { nullable: true })
  @OneToMany(() => Sensor, (sensor) => sensor.device)
  sensors?: Sensor[];
}
