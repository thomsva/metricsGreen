import { ApolloServer, gql } from "apollo-server";
import "reflect-metadata";
import { AppDataSource } from "./data-source";

const PORT = process.env.PORT || 4000;

const main = async () =>  {
  await AppDataSource.initialize()
    .then(async () => {
        console.log('Database running');
        
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
          author: 'Kate Chopin',
        },
        {
          title: 'City of Glass',
          author: 'Paul Auster',
        },
      ];

      const resolvers = {
        Query: {
          books: () => books,
        },
      };
    
      const server = new ApolloServer({ typeDefs, resolvers });
      const { url } = await server.listen(PORT);
      console.log('Server is running on', url);
    })
  .catch((e) => console.error(e));
};

main().catch((e) => {
  console.error(e);
});

