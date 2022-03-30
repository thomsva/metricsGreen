import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  type!: string;

  @Field()
  @Column()
  description!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;
}
