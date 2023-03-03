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
    console.log('result', result);
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
    console.log('secret for device: ', d);
    const pwd = generator.generate({
      length: 10,
      numbers: true
    });
    console.log('generated pwd', pwd);
    const saltRounds = 10;
    const hash = await bcrypt.hash(pwd, saltRounds);
    console.log('hashed pwd', hash);
    await Device.save({ ...d, secret: hash });
    return pwd;
  }
}
