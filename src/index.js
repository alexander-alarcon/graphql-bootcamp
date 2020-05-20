import { GraphQLServer } from 'graphql-yoga';

import resolvers, { fragmentReplacements } from './graphql/resolvers';
import typeDefs from './graphql/types';
import logger from './utils/logger';
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

server.start(
  {
    playground: '/playground',
    endpoint: '/gql',
    port: process.env.PORT || 4000,
  },
  () => {
    logger.info('Server is running');
  }
);
