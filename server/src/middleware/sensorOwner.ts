import { GraphQLError } from 'graphql';
import { MiddlewareFn } from 'type-graphql';
import { Context } from '..';
import Device from '../entity/Device';

/**
 * Guard middleware for resolvers. Makes sure that the user requesting
 * the operation is the owner of the object. Otherwise throws error.
 *
 * @param context - Contains the current user
 * @param args - The arguments sent with the request
 * @returns next() moves to the next middleware
 *
 */
export const sensorOwner: MiddlewareFn<Context> = async (
  { context, args },
  next
) => {
  const deviceId = args.data.deviceId as string;

  const d = await Device.findOne({
    relations: { user: true },
    where: { id: deviceId }
  });

  if (d === null) {
    throw new GraphQLError('Object not found in database');
  }

  if (context.userLoggedIn.id !== d?.user.id) {
    throw new GraphQLError('Only the authorized owner can perform this action');
  }

  return next();
};
