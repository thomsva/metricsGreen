import { Arg, Authorized, Query, Resolver } from 'type-graphql';
import Reading from '../entity/Reading';

@Resolver(() => Reading)
export class sensorResolver {
  @Authorized()
  @Query(() => [Reading])
  async sensors(@Arg('sensorId') sensorId: string): Promise<Reading[]> {
    return await Reading.find({
      relations: { sensor: true },
      where: {
        sensor: {
          id: sensorId
        }
      }
    });
  }
}

export default sensorResolver;
