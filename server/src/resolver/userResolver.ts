import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql';
import User from '../entity/User';
import { editUserInput, NewUserInput } from '../input/UserInput';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';
import { Context } from '..';

@Resolver()
export class UserResolver {
  @Query(() => [User], { description: 'Get all users.' })
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => User)
  async me(@Ctx() context: Context): Promise<User | null> {
    const token = context.req.headers.bearer as string;
    if (token !== undefined) {
      const tokenUser = jwt.verify(token, 'SECRET') as jwt.JwtPayload;
      console.log('tokenUser: ', tokenUser.user);
      try {
        return AppDataSource.getRepository(User).findOneBy({
          nickname: parseString(tokenUser.user.nickname)
        });
      } catch (e) {
        console.log('error', e);
        return null;
      }
    }
    return null;
  }

  @Mutation(() => User)
  async register(@Arg('data') newUserData: NewUserInput): Promise<User | null> {
    console.log(newUserData);
    const errors = await validate(newUserData);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      const user = AppDataSource.getRepository(User).create(newUserData);
      const results = await AppDataSource.getRepository(User).save(user);
      console.log('the nwe user: ', user);
      return results;
    }
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

  @Mutation(() => String)
  async login(
    @Arg('nickname') nickname: string,
    @Arg('password') password: string
  ): Promise<string | null> {
    console.log('nickname ', nickname);
    const user = await User.findOneBy({ nickname });
    console.log('user ', user);
    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ user }, 'SECRET');
        console.log('Login ok. Token = ', token);
        return token;
      }
    }
    console.log('Failed login attempt');
    return null;
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
