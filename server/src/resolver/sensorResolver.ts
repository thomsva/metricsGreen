import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql';
import { Context } from '..';
import Sensor from '../entity/Sensor';

@Resolver()
export class sensorResolver {
  @Query(() => [Sensor])
  async sensors(
    @Arg('deviceId', () => Int) deviceId: number,
    @Ctx() context: Context
  ): Promise<Sensor[]> {
    const user = context.userLoggedIn;
    user !== undefined && console.log(user.role);
    const x = 'ADMIN';
    if (x === 'ADMIN') {
      return await Sensor.find({ relations: { device: true } });
    } else {
      return await Sensor.find({
        relations: { device: true },
        where: { device: { id: deviceId } }
      });
    }
  }
}

export default sensorResolver;
