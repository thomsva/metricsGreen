import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';
import Device from '../entity/Device';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';
import { AddDeviceInput, editDeviceInput } from '../input/DeviceInput';

@Resolver()
export class DeviceResolver {
  @Query(() => [Device], { description: 'Get all devices.' })
  async devices(): Promise<Device[]> {
    return await Device.find();
  }

  @Authorized('ADMIN')
  @Query(() => Device)
  async getDevice(@Arg('id', () => Int) id: number): Promise<Device | null> {
    return Device.findOneBy({ id: id });
  }

  @Mutation(() => Device)
  async createDevice(
    @Arg('data') newDeviceData: AddDeviceInput
  ): Promise<Device | null> {
    const errors = await validate(newDeviceData);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const device = AppDataSource.getRepository(Device).create(newDeviceData);
      const results = await AppDataSource.getRepository(Device).save(device);
      return results;
    }
  }

  @Mutation(() => Device, { nullable: true })
  async updateDevice(
    @Arg('data') editDeviceData: editDeviceInput
  ): Promise<Device | null> {
    if ((await Device.findOneBy({ id: editDeviceData.id })) === null)
      return null;

    const errors = await validate(editDeviceData);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const device = AppDataSource.getRepository(Device).create(editDeviceData);
      const results = await AppDataSource.getRepository(Device).save(device);
      return results;
    }
  }

  @Mutation(() => Boolean)
  async deleteDevice(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Device.delete({ id: id });
    return true;
  }
}
