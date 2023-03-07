import { IsNumber, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateReadingInput {
  @Field()
  @IsString()
  sensorId!: string;

  @Field()
  @IsNumber()
  content!: number;
}
