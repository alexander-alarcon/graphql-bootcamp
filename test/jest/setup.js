import server from '../../src/server';
import { PORT } from '../utils/constants';

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
};
