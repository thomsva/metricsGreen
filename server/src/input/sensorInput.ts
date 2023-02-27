import { IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import Sensor from '../entity/Sensor';

@InputType({ description: 'Data for editing sensor' })
export class createSensorInput implements Partial<Sensor> {
  @Field()
  id!: number;

  @Field()
  @IsString()
  @Length(3, 30)
  name!: string;

  @Field()
  deviceId!: number;
}
