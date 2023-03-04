import { sensorResolver } from './resolver/sensorResolver';
import { ApolloServer } from 'apollo-server-express';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import http from 'http';
import { buildSchema } from 'type-graphql';
import { seedDatabase } from './seedDatabase';
import { authChecker } from './authChecker';
import { UserResolver } from './resolver/userResolver';
import { deviceResolver } from './resolver/deviceResolver';
import jwt from 'jsonwebtoken';
import User from './entity/User';
import cors from 'cors';

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
      //await seedDatabase();

      if (process.env.NODE_ENV === 'development') {
        app.use(cors());
        app.get('/seed', (_req, res) => {
          seedDatabase()
            .then(() => res.status(200).send('Reset and seed database OK!'))
            .catch(() => res.status(500).send('Error while seeding database.'));
        });
      }

      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [UserResolver, deviceResolver, sensorResolver],
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
            const u = tokenObject.user as User;
            if (u !== undefined) return { req, res, userLoggedIn: u };
          }
          return { req, res, userLoggedIn: undefined };
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
