//import { Context } from 'apollo-server-core';
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import Sensor from '../entity/Sensor';
import { AddSensorInput, editSensorInput } from '../input/SensorInput';

@Resolver()
export class SensorResolver {
  @Query(() => [Sensor], { description: 'Get all the sensors.' })
  async sensors(): Promise<Sensor[]> {
    return await Sensor.find();
  }

  @Query(() => Sensor)
  async getSensor(@Arg('id', () => Int) id: number): Promise<Sensor | null> {
    return Sensor.findOneBy({ id: id });
  }

  @Mutation(() => Sensor)
  async createSensor(
    @Arg('data') newSensorData: AddSensorInput
  ): Promise<Sensor> {
    const sensor = Sensor.create(newSensorData);
    await sensor.save();
    console.log('sensor saved:', sensor);
    return sensor;
  }

  @Mutation(() => Sensor)
  async updateSensor(
    @Arg('data') editSensorData: editSensorInput
  ): Promise<Sensor | null> {
    const sensor = Sensor.create(editSensorData);
    await sensor.save();
    return sensor;
  }

  @Mutation(() => Boolean)
  async deleteSensor(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Sensor.delete({ id: id });
    return true;
  }
}
