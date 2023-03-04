import { deviceOwner } from './../middleware/deviceOwner';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import Device from '../entity/Device';
// import { AppDataSource } from '../data-source';
import {
  CreateDeviceInput,
  DeleteDeviceInput,
  GenerateDeviceSecretInput,
  UpdateDeviceInput
} from '../input/DeviceInput';
import { Context } from '..';
import Sensor from '../entity/Sensor';
import generator from 'generate-password';
import bcrypt from 'bcrypt';

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

  @FieldResolver(() => Int)
  async sensorsCount(@Root() device: Device) {
    const result = await Sensor.count({
      relations: { device: true },
      where: { device: { id: device.id } }
    });
    return result;
  }

  @FieldResolver(() => Boolean)
  key(@Root() device: Device) {
    return device.secret !== null;
  }

  @Authorized()
  @Query(() => [Device], {
    description: 'All devices owned by the user logged in.'
  })
  async myDevices(@Ctx() context: Context): Promise<Device[]> {
    const user = context.userLoggedIn;
    return await Device.find({
      relations: { user: true },
      where: { user: { id: user.id } },
      order: { createdDate: 'ASC', id: 'ASC' }
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
  async deleteDevice(@Arg('data') input: DeleteDeviceInput): Promise<boolean> {
    await Device.delete({ id: input.id });
    return true;
  }

  @Authorized()
  @UseMiddleware(deviceOwner)
  @Mutation(() => String)
  async generateDeviceSecret(
    @Arg('data') input: GenerateDeviceSecretInput
  ): Promise<string> {
    const d = await Device.findOneBy({ id: input.id });
    const secret = generator.generate({
      length: 10,
      numbers: true
    });
    const saltRounds = 10;
    const hash = await bcrypt.hash(secret, saltRounds);
    const timeStamp = new Date(
      Date.now() + 1000 * 60 * -new Date().getTimezoneOffset()
    )
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');
    await Device.save({ ...d, secret: hash, secretTimeStamp: timeStamp });

    return secret;
  }
}
