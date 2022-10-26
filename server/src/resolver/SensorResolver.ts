import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';
import Sensor from '../entity/Sensor';
import { AddSensorInput, editSensorInput } from '../input/SensorInput';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';

@Resolver()
export class SensorResolver {
  @Query(() => [Sensor], { description: 'Get all the sensors.' })
  async sensors(): Promise<Sensor[]> {
    return await Sensor.find();
  }

  @Authorized('ADMIN')
  @Query(() => Sensor)
  async getSensor(@Arg('id', () => Int) id: number): Promise<Sensor | null> {
    return Sensor.findOneBy({ id: id });
  }

  @Mutation(() => Sensor)
  async createSensor(
    @Arg('data') newSensorData: AddSensorInput
  ): Promise<Sensor | null> {
    const errors = await validate(newSensorData);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const sensor = AppDataSource.getRepository(Sensor).create(newSensorData);
      const results = await AppDataSource.getRepository(Sensor).save(sensor);
      return results;
    }
  }

  @Mutation(() => Sensor, { nullable: true })
  async updateSensor(
    @Arg('data') editSensorData: editSensorInput
  ): Promise<Sensor | null> {
    if ((await Sensor.findOneBy({ id: editSensorData.id })) === null)
      return null;

    const errors = await validate(editSensorData);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const sensor = AppDataSource.getRepository(Sensor).create(editSensorData);
      const results = await AppDataSource.getRepository(Sensor).save(sensor);
      return results;
    }
  }

  @Mutation(() => Boolean)
  async deleteSensor(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Sensor.delete({ id: id });
    return true;
  }
}
