import { Field, InputType } from 'type-graphql';
import User from '../entity/User';

@InputType({ description: 'Data for new user' })
export class NewUserInput implements Partial<User> {
  @Field()
  nickname!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType({ description: 'Data for editing user' })
export class editUserInput implements Partial<User> {
  @Field()
  id!: number;

  @Field()
  nickname!: string;

  @Field()
  email!: string;
}
