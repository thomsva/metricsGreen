import { Field, InputType } from 'type-graphql';
import Device from '../entity/Device';

@InputType({ description: 'Data for new sensor' })
export class AddDeviceInput implements Partial<Device> {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  location?: string;
}

@InputType({ description: 'Data for editing sensor' })
export class editDeviceInput implements Partial<Device> {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field({ nullable: true })
  location?: string;
}
