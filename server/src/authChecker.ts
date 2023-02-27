import { AuthChecker } from 'type-graphql';
import { Context } from './index';

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  const user = context.userLoggedIn;
  console.log('auth: ', user);
  if (user !== undefined) {
    if (roles.length === 0) {
      // No roles required but user has to exist
      return true;
    }
    if (typeof user.role !== undefined) {
      if (user.role === null) {
        // Roles required, user has no roles
        return false;
      }

      if (roles.filter((x) => x === user.role).length !== 0) {
        // Required roles overlap users roles
        return true;
      }
      // Required roles do not overlap with user roles
      return false;
    }
  } else {
    if (roles.length === 0) {
      // No roles required but user has to exist
      console.log('hello');
      return false;
    }
  }
  return false;
};
