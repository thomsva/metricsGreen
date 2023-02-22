import { AuthChecker } from 'type-graphql';
import { Context } from './index';

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  console.log('Authorization is being checked');

  // const token = context.req.headers.bearer as string;

  const user = context.userLoggedIn
  
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
        console.log('authChecker role ok: ', user.role);
        return true;
      }
      // Required roles do not overlap with user roles
      return false;
    }
  } else {

    if (roles.length === 0) {
      // No roles required but user has to exist
      return false;
    }
  }
  return false;
};
