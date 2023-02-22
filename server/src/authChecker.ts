import { AuthChecker } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { Context } from './index';

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  console.log('Authorization is being checked');

  const token = context.req.headers.bearer as string;

  
  if (token !== undefined) {
    const currentUser = jwt.verify(token, 'SECRET') as jwt.JwtPayload;

    if (roles.length === 0) {
      // No roles required but user has to exist
      return currentUser !== null;
    }

    if (!currentUser) {
      // Roles required, used does not exist
      return false;
    }

    if (typeof currentUser.role !== undefined) {
      if (currentUser.role === null) {
        // Roles required, user has no roles
        return false;
      }

      if (roles.filter((x) => x === currentUser.role).length !== 0) {
        // Required roles overlap users roles
        console.log('authChecker role ok: ', currentUser.role);
        return true;
      }
      // Required roles does not overlap with user roles
      return false;
    }
  }
  return false;
};
