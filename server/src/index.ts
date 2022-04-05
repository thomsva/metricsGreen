import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import http from 'http';
import { HelloResolver } from './resolver/Hello';
import { buildSchema } from 'type-graphql';
import { SensorResolver } from './resolver/SensorResolver';
import User from './entity/User';
import { seedDatabase } from './seedDatabase';
import { authChecker } from './authChecker';
import { UserResolver } from './resolver/userResolver';

const PORT = process.env.PORT || 4000;

export type Context = {
  user?: User;
};

const main = async () => {
  await AppDataSource.initialize()
    .then(async () => {
      console.log('The database is running');

      const app = express();
      const user = await seedDatabase();
      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [HelloResolver, SensorResolver, UserResolver],
          authChecker,
          validate: false
        }),
        context: ({ req, res }) => ({
          req,
          res,
          user
        })
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
