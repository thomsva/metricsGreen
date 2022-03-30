//import { Context } from 'apollo-server-core';
import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { AppDataSource } from '../data-source';
import Sensor from '../entity/Sensor';
import Book from '../entity/Sensor';

const sensorRepository = AppDataSource.getRepository(Book);

@InputType({ description: 'New sensor data' })
class AddSensorInput implements Partial<Sensor> {
  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field()
  description!: string;

  @Field({ nullable: true })
  location?: string;
}

@Resolver()
export class SensorResolver {
  @Mutation(() => Sensor)
  async addSensor(@Arg('data') newSensorData: AddSensorInput): Promise<Sensor> {
    const sensor = Sensor.create(newSensorData);
    await sensor.save();
    return sensor;
  }

  @Query(() => [Sensor], { description: 'Get all the sensors.' })
  async books(): Promise<Book[]> {
    return await sensorRepository.find();
  }
}
