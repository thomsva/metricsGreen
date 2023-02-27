import {
  Arg,
  Authorized,
  Ctx,
  Int,
  // Mutation,
  Query,
  Resolver
} from 'type-graphql';
import { Context } from '..';
import Sensor from '../entity/Sensor';
// import { createSensorInput } from '../input/sensorInput';
// import Device from '../entity/Device';

@Resolver()
export class sensorResolver {
  @Authorized()
  @Query(() => [Sensor])
  async sensors(
    @Arg('deviceId', () => Int) deviceId: number,
    @Ctx() context: Context
  ): Promise<Sensor[]> {
    const user = context.userLoggedIn;
    if (user.role === 'ADMIN') {
      return await Sensor.find({ relations: { device: true } });
    } else {
      return await Sensor.find({
        relations: { device: true },
        where: {
          device: {
            id: deviceId,
            user: { id: user.id }
          }
        }
      });
    }
  }

  //   @Mutation(() => Sensor)
  //   async createSensor(
  //     @Arg('data') input: createSensorInput,
  //     @Ctx() context: Context
  //   ): Promise<Sensor | null> {
  //     console.log('Create sensor with this data:: ', input);
  //     const device = await Device.findOneBy({id: input.deviceId})
  //     const sensor = await Sensor.create({ name: input.name, device: device})
  //     return sensor;
  // }

  //   async createDevice(
  //     @Arg('data') input: createDeviceInput,
  //     @Ctx() context: Context
  //   ): Promise<Device | null> {
  //     console.log('Create device with this data:: ', input);
  //     const device = AppDataSource.getRepository(Device).create({
  //       ...input,
  //       user: context.userLoggedIn
  //     });
  //     const results = await AppDataSource.getRepository(Device).save(device);
  //     return results;
}

export default sensorResolver;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6ImRvbiIsImVtYWlsIjoiZG9uQHNjZHAuY29tIiwicGFzc3dvcmQiOiJwd2QiLCJyb2xlIjoiVVNFUiJ9LCJpYXQiOjE2Nzc1MTM3NjZ9.G2Y2MW35F3Z7NT2WM2JSvY8aqvQL-VqOQTyZ9-xnnMk
