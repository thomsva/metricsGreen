import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import Device from './Device';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column()
  password!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  role?: string;

  @Field(() => [Device], { nullable: true })
  @OneToMany(() => Device, (device) => device.user)
  devices?: Device[];
}
