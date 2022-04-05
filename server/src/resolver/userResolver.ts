import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql';
import { Context } from '../index';
import User from '../entity/User';
import { editUserInput, NewUserInput } from '../input/UserInput';

@Resolver()
export class UserResolver {
  @Authorized('ADMIN')
  @Query(() => [User], { description: 'Get all users.' })
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => User)
  async me(@Ctx() ctx: Context): Promise<User | null> {
    if (ctx.user) {
      return User.findOneBy({ id: ctx.user.id });
    }
    return null;
  }

  @Mutation(() => User)
  async register(@Arg('data') newUserData: NewUserInput): Promise<User | null> {
    console.log(newUserData);
    const user = User.create(newUserData);
    user.role = 'USER';
    await user.save();
    console.log('User saved:', user);
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('data') editUserData: editUserInput
  ): Promise<User | null> {
    if ((await User.findOneBy({ id: editUserData.id })) === null) return null;
    const user = User.create(editUserData);
    await user.save();
    return user;
  }

  @Authorized('ADMIN')
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => Int) id: number): Promise<boolean> {
    await User.delete({ id: id });
    return true;
  }

  @Mutation(() => User)
  async login(
    @Arg('nickname') nickname: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context
  ): Promise<User | null> {
    console.log(nickname);
    const user = await User.findOneBy({ nickname });
    console.log(user);
    if (user) {
      if (user.password === password) {
        ctx.user = user;
        return user;
      }
    }
    console.log('oh no');
    return null;
  }
}
