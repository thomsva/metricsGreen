import { ApolloServer } from 'apollo-server-express';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import http from 'http';
import { HelloResolver } from './resolver/Hello';
import { buildSchema } from 'type-graphql';
import { seedDatabase } from './seedDatabase';
import { authChecker } from './authChecker';
import { UserResolver } from './resolver/userResolver';
import { DeviceResolver } from './resolver/DeviceResolver';
import jwt from 'jsonwebtoken';
import User from './entity/User';

const PORT = process.env.PORT || 4000;

export type Context = {
  req: Request;
  res: Response;
  userLoggedIn: User;
};

const main = async () => {
  await AppDataSource.initialize()
    .then(async () => {
      console.log('The database is running');

      const app = express();
      await seedDatabase();

      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [HelloResolver, UserResolver, DeviceResolver],
          authChecker,
          validate: true
        }),
        context: ({ req, res }) => {
          const authorization = req.headers.authorization as string;
          if (
            authorization &&
            authorization.toLowerCase().startsWith('bearer ')
          ) {
            const token = authorization.substring(7);
            const tokenObject = jwt.verify(token, 'SECRET') as jwt.JwtPayload;
            if (tokenObject.user instanceof User)
              return { req, res, userLoggedIn: tokenObject.user };
          }
          return { req, res, userLoggedIn: false };
        }
      });

      const httpServer = http.createServer(app);
      await apolloServer.start();

      apolloServer.applyMiddleware({ app });

      await new Promise<void>((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
      );
      console.log(
        `GraphQl is running on 
        http://localhost:${PORT}${apolloServer.graphqlPath}`
      );
    })
    .catch((e) => console.error(e));
};

main().catch((e) => {
  console.error(e);
});
