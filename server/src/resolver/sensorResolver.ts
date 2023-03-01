import { GraphQLError } from 'graphql';
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { Context } from '..';
import Device from '../entity/Device';
import Sensor from '../entity/Sensor';
import { UpdateSensorInput } from '../input/SensorInput';
import { sensorOwner } from '../middleware/sensorOwner';

@Resolver(() => Sensor)
export class sensorResolver {
  @Authorized()
  @Query(() => [Sensor])
  async sensors(
    @Arg('deviceId') deviceId: string,
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

  @Authorized()
  @UseMiddleware(sensorOwner)
  @Mutation(() => Sensor)
  async createSensor(
    @Arg('deviceId') deviceId: string,
    @Arg('name') name: string
  ): Promise<Sensor | null> {
    const device = await Device.findOneBy({ id: deviceId });
    if (device === null) {
      throw new GraphQLError('Invalid device id');
    }
    return Sensor.create({
      name: name,
      unit: 'celcius',
      device: device
    }).save();
  }

  @Authorized()
  @UseMiddleware(sensorOwner)
  @Mutation(() => Sensor)
  async updateSensor(
    @Arg('data') input: UpdateSensorInput
  ): Promise<Sensor | null> {
    await Sensor.update({ id: input.id }, input);
    return Sensor.findOneBy({ id: input.id });
  }

  @Authorized()
  @UseMiddleware(sensorOwner)
  @Mutation(() => Boolean)
  async deleteSensor(@Arg('id') id: string): Promise<boolean> {
    await Sensor.delete({ id: id });
    return true;
  }
}

export default sensorResolver;
