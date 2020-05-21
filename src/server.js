import { GraphQLServer } from 'graphql-yoga';

import resolvers, { fragmentReplacements } from './graphql/resolvers';
import typeDefs from './graphql/types';
import prisma from './prisma';

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context(request) {
    return {
      prisma,
      request,
    };
  },
  fragmentReplacements,
});

export default server;
