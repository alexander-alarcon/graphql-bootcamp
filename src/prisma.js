import { Prisma } from 'prisma-binding';

import { fragmentReplacements } from './graphql/resolvers';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: '2DjHX7EVaHJw*%@$Z!pP',
  fragmentReplacements,
});

export default prisma;
