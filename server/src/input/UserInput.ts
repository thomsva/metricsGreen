import { IsEmail, IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import User from '../entity/User';

@InputType({ description: 'Data for new user' })
export class NewUserInput implements Partial<User> {
  @Field()
  @IsString()
  @Length(5, 30)
  username!: string;

  @Field()
  @IsString()
  @Length(5, 100)
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  password!: string;
}

@InputType({ description: 'Data for editing user' })
export class editUserInput implements Partial<User> {
  @Field()
  id!: number;

  @Field()
  @IsString()
  @Length(5, 30)
  username!: string;

  @Field()
  @IsString()
  @Length(5, 100)
  @IsEmail()
  email!: string;
}
