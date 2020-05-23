import { join } from 'path';

import seed from '../utils/seedDatabase';
import { PORT } from '../utils/constants';
import server from '../../src/server';

module.exports = async () => {
  global.__SERVER__ = await server.start(
    {
      port: PORT,
      endpoint: '/gql',
    },
    ({ port }) => {
      console.log('Server is running ' + port);
    }
  );
  await seed();
};
