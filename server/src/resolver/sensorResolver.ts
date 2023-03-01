import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Context } from '..';
import Sensor from '../entity/Sensor';

@Resolver()
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
}

export default sensorResolver;
