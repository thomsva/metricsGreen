//import { Context } from 'apollo-server-core';
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql';
import Sensor from '../entity/Sensor';

@InputType({ description: 'Data for new sensor' })
class AddSensorInput implements Partial<Sensor> {
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
class editSensorInput implements Partial<Sensor> {
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

@Resolver()
export class SensorResolver {
  @Mutation(() => Sensor)
  async addSensor(@Arg('data') newSensorData: AddSensorInput): Promise<Sensor> {
    const sensor = Sensor.create(newSensorData);
    await sensor.save();
    console.log('sensor saved:', sensor);
    return sensor;
  }

  @Mutation(() => Sensor)
  async editSensor(
    @Arg('data') editSensorData: editSensorInput
  ): Promise<Sensor | null> {
    const sensor = Sensor.create(editSensorData);
    await sensor.save();
    return sensor;
  }

  @Query(() => [Sensor], { description: 'Get all the sensors.' })
  async GetSensors(): Promise<Sensor[]> {
    return await Sensor.find();
  }

  @Query(() => Sensor)
  async getSensor(@Arg('id', () => Int) id: number): Promise<Sensor | null> {
    return Sensor.findOneBy({ id: id });
  }

  @Mutation(() => Boolean)
  async deleteSensor(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Sensor.delete({ id: id });
    return true;
  }
}
