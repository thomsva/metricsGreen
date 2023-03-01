import { IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import Device from '../entity/Device';

@InputType({ description: 'Data for new sensor' })
export class createDeviceInput implements Partial<Device> {
  @Field()
  @IsString()
  @Length(5, 30)
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  location?: string;
}

@InputType({ description: 'Data for editing device' })
export class updateDeviceInput implements Partial<Device> {
  @Field()
  id!: string;

  @Field()
  @IsString()
  @Length(7, 30)
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  location?: string;
}
