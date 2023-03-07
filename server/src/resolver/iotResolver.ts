/* eslint-disable @typescript-eslint/no-misused-promises */
import { Arg, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';
import Device from '../entity/Device';
import { CreateReadingsInput } from '../input/DeviceInput';
import Reading from '../entity/Reading';
import Sensor from '../entity/Sensor';

@Resolver(() => Device)
export class iotResolver {
  @Mutation(() => Boolean)
  async createReadings(
    @Arg('data') input: CreateReadingsInput
  ): Promise<boolean> {
    console.log('CreateReading: ', input);
    const saltRounds = 10;
    const hash = await bcrypt.hash(input.secret, saltRounds);
    const device = await Device.findOneBy({ secret: hash });
    if (device) console.log('Device found');
    const timeStamp = new Date(
      Date.now() + 1000 * 60 * -new Date().getTimezoneOffset()
    );
    input.readings.forEach(async (r) => {
      const s = await Sensor.findOneBy({ id: r.sensorId });
      if (s) {
        await Reading.create({
          timeStamp: timeStamp,
          content: r.content,
          sensor: s
        }).save();
      }
      console.log('one s');
    });

    return true;
  }
}
