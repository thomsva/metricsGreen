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
import { EditUserInput, NewUserInput } from '../input/UserInput';
import jwt from 'jsonwebtoken';
import { Context } from '..';
import Login from '../entity/Login';
import Device from '../entity/Device';

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
    return User.create({
      ...newUserData,
      role: 'USER',
      devices: []
    }).save();
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

  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: Context): Promise<User | null> {
    return User.findOne({ where: { id: context.userLoggedIn.id } });
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('data') editUserData: EditUserInput
  ): Promise<User | null> {
    await User.update({ id: editUserData.id }, editUserData);
    return User.findOneBy({ id: editUserData.id });
  }

  @Authorized('ADMIN')
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string): Promise<boolean> {
    await User.delete({ id: id });
    return true;
  }
}
