import { GraphQLError } from 'graphql';
import { MiddlewareFn } from 'type-graphql';
import { Context } from '..';
import Device from '../entity/Device';

export const deviceOwner: MiddlewareFn<Context> = async (
  // Throws an error if the action is performed by other than the device owner
  { context, args },
  next
) => {
  if (typeof args.id !== 'string') {
    throw new GraphQLError('Invalid argument: id');
  }

  const d = await Device.findOne({
    relations: { user: true },
    where: { id: args.id }
  });

  if (d === null) {
    throw new GraphQLError('Object not found in database');
  }

  if (context.userLoggedIn.id !== d?.user.id) {
    throw new GraphQLError('Only the authorized owner can perform this action');
  }

  return next();
};
