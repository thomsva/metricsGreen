import { GraphQLError } from 'graphql';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Float,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import { Context } from '..';
import Device from '../entity/Device';
import Reading from '../entity/Reading';
import Sensor from '../entity/Sensor';
import { CreateSensorInput, UpdateSensorInput } from '../input/SensorInput';
import { sensorOwner } from '../middleware/sensorOwner';

@Resolver(() => Sensor)
export class sensorResolver {
  @FieldResolver(() => Int)
  async readingsCount(@Root() sensor: Sensor) {
    const result = await Reading.count({
      relations: { sensor: true },
      where: { sensor: { id: sensor.id } }
    });
    console.log('result', result);
    return result;
  }

  @FieldResolver(() => Float, { nullable: true })
  async maxReading(@Root() sensor: Sensor) {
    const result = await Reading.maximum('content', {
      sensor: { id: sensor.id }
    });
    return result;
  }

  @FieldResolver(() => Float, { nullable: true })
  async minReading(@Root() sensor: Sensor) {
    const result = await Reading.minimum('content', {
      sensor: { id: sensor.id }
    });
    return result;
  }

  @FieldResolver(() => Float, { nullable: true })
  async averageReading(@Root() sensor: Sensor) {
    const result = await Reading.average('content', {
      sensor: { id: sensor.id }
    });
    return result;
  }

  @Authorized()
  @Query(() => [Sensor])
  async mySensors(@Ctx() context: Context): Promise<Sensor[]> {
    const user = context.userLoggedIn;
    if (user.role === 'ADMIN') {
      return await Sensor.find({ relations: { device: true } });
    } else {
      return await Sensor.find({
        relations: { device: true, readings: true },
        where: {
          device: {
            user: { id: user.id }
          }
        },
        order: { readings: { createdAt: 'ASC' } }
      });
    }
  }

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
  @Mutation(() => Sensor)
  async createSensor(
    @Arg('data') input: CreateSensorInput
  ): Promise<Sensor | null> {
    console.log('here');
    const device = await Device.findOneBy({ id: input.deviceId });
    if (device === null) {
      throw new GraphQLError('Invalid device id');
    }
    return Sensor.create({
      name: input.name,
      unit: input.unit,
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
