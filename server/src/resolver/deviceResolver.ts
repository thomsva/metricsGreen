import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import Device from '../entity/Device';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';
import { createDeviceInput, updateDeviceInput } from '../input/DeviceInput';
import { Context } from '..';
import Sensor from '../entity/Sensor';

@Resolver(() => Device)
export class deviceResolver {
  @FieldResolver()
  async sensors(@Root() device: Device) {
    console.log('using  sensors fieldreslover');
    const result = await Sensor.find({
      relations: { device: true, readings: true },
      where: { device: { id: device.id } }
    });
    console.log('result', result);
    return result !== undefined ? result : [];
  }

  // @Authorized()
  @Query(() => [Device], {
    description: 'All devices owned by the user logged in.'
  })
  async myDevices(@Ctx() context: Context): Promise<Device[]> {
    console.log('resolver myDevices');
    const user = context.userLoggedIn;
    return await Device.find({
      relations: { user: true },
      where: { user: { id: user.id } }
    });
  }

  @Authorized('ADMIN')
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
  async deleteDevice(
    @Arg('id', () => Int) id: number,
    @Ctx() context: Context
  ): Promise<boolean> {
    const d = await Device.findOne({
      relations: { user: true },
      where: { id: id }
    });
    if (context.userLoggedIn.id !== d?.user.id) return false;
    await Device.delete({ id: id });
    return true;
  }
}
