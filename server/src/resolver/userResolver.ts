import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import User from '../entity/User';
import { editUserInput, NewUserInput } from '../input/UserInput';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';
import { Context } from '..';
import Login from '../entity/Login';
import Device from '../entity/Device';
// import Device from '../entity/Device';

@Resolver(() => User)
export class UserResolver {
  @FieldResolver()
  async devices(@Root() user: User) {
    console.log('using fieldreslover');
    const result = await Device.find({
      relations: { sensors: true, user: true },
      where: { user: { id: user.id } }
    });
    console.log('result', result);
    return result !== undefined ? result : [];
  }

  @FieldResolver(() => Int)
  async devicesCount(@Root() user: User) {
    console.log('using fieldreslover');
    const result = await Device.count({
      relations: { sensors: true, user: true },
      where: { user: { id: user.id } }
    });
    console.log('result', result);
    return result;
  }

  @Authorized('ADMIN')
  @Query(() => [User], { description: 'Get all users.' })
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Mutation(() => User)
  async register(@Arg('data') newUserData: NewUserInput): Promise<User | null> {
    console.log('new user data', newUserData);
    const user = AppDataSource.getRepository(User).create({
      ...newUserData,
      role: 'USER',
      devices: []
    });
    const results = await AppDataSource.getRepository(User).save(user);
    return results;
  }

  @Mutation(() => Login, { nullable: true })
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string
  ): Promise<Login | null> {
    const user = await User.findOneBy({ username: username });
    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ user }, 'SECRET');
        console.log('Login ok. Token = ', token);
        return { user, token: token };
      }
    }
    console.log('Failed login attempt');
    return null;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: Context): Promise<User | null> {
    if (context.userLoggedIn) {
      console.log('meee');
      try {
        return AppDataSource.getRepository(User).findOneBy({
          username: parseString(context.userLoggedIn.username)
        });
      } catch (e) {
        console.log('error', e);
        return null;
      }
    }
    console.log('nothing to return');
    // throw new GraphQLError('Current user error. No valid token supplied');
    return null;
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('data') editUserData: editUserInput
  ): Promise<User | null> {
    if ((await User.findOneBy({ id: editUserData.id })) === null) return null;
    const errors = await validate(editUserData);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const user = AppDataSource.getRepository(User).create(editUserData);
      const results = await AppDataSource.getRepository(User).save(user);
      return results;
    }
  }

  @Authorized('ADMIN')
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => Int) id: number): Promise<boolean> {
    await User.delete({ id: id });
    return true;
  }
}

const parseString = (input: unknown): string => {
  if (!input || !isString(input)) {
    throw new Error('Invalid string input: ' + input);
  }
  return input;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};
