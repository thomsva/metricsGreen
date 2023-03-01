import { IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import Sensor from '../entity/Sensor';

@InputType({ description: 'Data for editing sensor' })
export class CreateSensorInput implements Partial<Sensor> {
  @Field()
  @IsString()
  @Length(3, 30)
  name!: string;

  @Field()
  deviceId!: number;
}

@InputType({ description: 'Data for editing sensor' })
export class UpdateSensorInput implements Partial<Sensor> {
  @Field()
  id!: string;

  @Field()
  @IsString()
  @Length(3, 30)
  name!: string;

  @Field()
  deviceId!: number;
}
