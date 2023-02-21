import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';
import Device from '../entity/Device';
import { AddSensorInput, editSensorInput } from '../input/SensorInput';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';

@Resolver()
export class DeviceResolver {
  @Query(() => [Device], { description: 'Get all the sensors.' })
  async sensors(): Promise<Device[]> {
    return await Device.find();
  }

  @Authorized('ADMIN')
  @Query(() => Device)
  async getSensor(@Arg('id', () => Int) id: number): Promise<Device | null> {
    return Device.findOneBy({ id: id });
  }

  @Mutation(() => Device)
  async createSensor(
    @Arg('data') newSensorData: AddSensorInput
  ): Promise<Device | null> {
    const errors = await validate(newSensorData);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const sensor = AppDataSource.getRepository(Device).create(newSensorData);
      const results = await AppDataSource.getRepository(Device).save(sensor);
      return results;
    }
  }

  @Mutation(() => Device, { nullable: true })
  async updateSensor(
    @Arg('data') editSensorData: editSensorInput
  ): Promise<Device | null> {
    if ((await Device.findOneBy({ id: editSensorData.id })) === null)
      return null;

    const errors = await validate(editSensorData);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const sensor = AppDataSource.getRepository(Device).create(editSensorData);
      const results = await AppDataSource.getRepository(Device).save(sensor);
      return results;
    }
  }

  @Mutation(() => Boolean)
  async deleteSensor(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Device.delete({ id: id });
    return true;
  }
}
