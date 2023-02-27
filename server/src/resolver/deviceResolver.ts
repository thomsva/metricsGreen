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
import { createDeviceInput, updateDeviceInput } from '../input/DeviceInput';
import { Context } from '..';

@Resolver()
export class deviceResolver {
  @Authorized()
  @Query(() => [Device], { description: 'Get all devices.' })
  async devices(@Ctx() context: Context): Promise<Device[]> {
    const user = context.userLoggedIn;
    if (user.role === 'ADMIN') {
      return await Device.find({ relations: { user: true } });
    } else {
      return await Device.find({
        relations: { user: true },
        where: { user: { id: user.id } }
      });
    }
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
    @Arg('data') input: createDeviceInput,
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

  @Mutation(() => Device)
  async updateDevice(
    @Arg('data') input: updateDeviceInput
  ): Promise<Device | null> {
    console.log('herehere');
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
