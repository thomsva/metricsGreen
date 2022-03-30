import { Field, InputType } from 'type-graphql';
import Sensor from '../entity/Sensor';

@InputType({ description: 'Data for new sensor' })
export class AddSensorInput implements Partial<Sensor> {
  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field()
  description!: string;

  @Field({ nullable: true })
  location?: string;
}

@InputType({ description: 'Data for editing sensor' })
export class editSensorInput implements Partial<Sensor> {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field()
  description!: string;

  @Field({ nullable: true })
  location?: string;
}
