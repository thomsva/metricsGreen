import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import Device from '../entity/Device';
// import { AppDataSource } from '../data-source';
import { createDeviceInput, updateDeviceInput } from '../input/DeviceInput';
import { Context } from '..';
import Sensor from '../entity/Sensor';
import { GraphQLError } from 'graphql';

@Resolver(() => Device)
export class deviceResolver {
  @FieldResolver()
  async sensors(@Root() device: Device) {
    const result = await Sensor.find({
      relations: { device: true, readings: true },
      where: { device: { id: device.id } }
    });
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
  // TODO: same as myDevices for other than admin users
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
    return Device.create({ ...input, user: context.userLoggedIn }).save();
  }

  @Authorized()
  @Mutation(() => Device)
  async updateDevice(
    @Arg('data') input: updateDeviceInput,
    @Ctx() context: Context
  ): Promise<Device | null> {
    const d = await Device.findOne({
      relations: { user: true },
      where: { id: input.id }
    });
    if (context.userLoggedIn.id !== d?.user.id && d?.user.role !== 'ADMIN')
      throw new GraphQLError('Not authorized');
    await Device.update({ id: input.id }, input);
    return Device.findOneBy({ id: input.id });
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteDevice(
    @Arg('id') id: string,
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
