import { deviceOwner } from './../middleware/deviceOwner';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import Device from '../entity/Device';
// import { AppDataSource } from '../data-source';
import { CreateDeviceInput, UpdateDeviceInput } from '../input/DeviceInput';
import { Context } from '..';
import Sensor from '../entity/Sensor';

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

  @Authorized()
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

  // TODO: same as myDevices for other than admin users
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
    @Arg('data') input: CreateDeviceInput,
    @Ctx() context: Context
  ): Promise<Device | null> {
    return Device.create({ ...input, user: context.userLoggedIn }).save();
  }

  @Authorized()
  @UseMiddleware(deviceOwner)
  @Mutation(() => Device)
  async updateDevice(
    @Arg('data') input: UpdateDeviceInput
  ): Promise<Device | null> {
    await Device.update({ id: input.id }, input);
    return Device.findOneBy({ id: input.id });
  }

  @Authorized()
  @UseMiddleware(deviceOwner)
  @Mutation(() => Boolean)
  async deleteDevice(@Arg('id') id: string): Promise<boolean> {
    await Device.delete({ id: id });
    return true;
  }
}
