import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import http from 'http';

const PORT = process.env.PORT || 4000;

const main = async () => {
  await AppDataSource.initialize()
    .then(async () => {
      console.log('The database is running');

      const typeDefs = gql`
        type Book {
          title: String
          author: String
        }

        type Query {
          books: [Book]
        }
      `;

      const books = [
        {
          title: 'The Awakening',
          author: 'Kate Chopin'
        },
        {
          title: 'City of Glass',
          author: 'Paul Auster'
        }
      ];

      const resolvers = {
        Query: {
          books: () => books
        }
      };

      const app = express();
      const httpServer = http.createServer(app);
      const apolloServer = new ApolloServer({ typeDefs, resolvers });
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
