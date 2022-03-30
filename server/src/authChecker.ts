import { AuthChecker } from 'type-graphql';
import { Context } from './index';

export const authChecker: AuthChecker<Context> = (
  { context: { user } },
  roles
) => {
  if (roles.length === 0) {
    // No roles required but user has to exist
    return user !== null;
  }

  if (!user) {
    // Roles required, used does not exist
    return false;
  }

  if (user.role === null) {
    // Roles required, user has no roles
    return false;
  }

  if (roles.filter((x) => x === user.role).length !== 0) {
    // Required roles overlap users roles
    console.log('auth-----------------');
    return true;
  }

  // Required roles does not overlap with user roles
  return false;
};
