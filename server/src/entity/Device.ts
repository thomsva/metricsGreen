import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import Sensor from './Sensor';
import User from './User';

@ObjectType()
@Entity()
export default class Device extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  description!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  secret?: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  secretTimeStamp!: Date;

  @Field()
  @CreateDateColumn()
  createdDate!: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate!: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.devices)
  user!: User;

  @Field(() => [Sensor], { nullable: true })
  @OneToMany(() => Sensor, (sensor) => sensor.device)
  sensors?: Sensor[];
}
