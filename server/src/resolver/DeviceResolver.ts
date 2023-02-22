import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql';
import Device from '../entity/Device';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';
import { AddDeviceInput, editDeviceInput } from '../input/DeviceInput';
import { Context } from '..';

@Resolver()
export class DeviceResolver {
  @Query(() => [Device], { description: 'Get all devices.' })
  async devices(): Promise<Device[]> {
    const devices = await Device.find({ relations: { user: true } });
    return devices;
  }

  @Authorized('ADMIN')
  @Query(() => Device)
  async getDevice(@Arg('id', () => Int) id: number): Promise<Device | null> {
    return Device.findOneBy({ id: id });
  }

  // async me(@Ctx() context: Context): Promise<User | null> {

  @Authorized()
  @Mutation(() => Device)
  async createDevice(
    @Arg('data') input: AddDeviceInput,
    @Ctx() context: Context
  ): Promise<Device | null> {
    console.log('Create device with this data:: ', input);
    const device = AppDataSource.getRepository(Device).create({
      ...input,
      user: context.userLoggedIn
    });
    const results = await AppDataSource.getRepository(Device).save(device);
    return results;
  }

  @Mutation(() => Device, { nullable: true })
  async updateDevice(
    @Arg('data') input: editDeviceInput
  ): Promise<Device | null> {
    if ((await Device.findOneBy({ id: input.id })) === null) return null;

    const errors = await validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const device = AppDataSource.getRepository(Device).create(input);
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
