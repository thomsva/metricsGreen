import { Field, ObjectType } from 'type-graphql';
import User from './User';

@ObjectType()
export default class Login {
  @Field()
  user!: User;

  @Field()
  token!: string;
}
