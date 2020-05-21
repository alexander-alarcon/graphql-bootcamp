import logger from './utils/logger';
import server from './server';

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
