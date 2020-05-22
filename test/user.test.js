import { getFirstname, isValidPassword } from '../src/utils/user';
import server from '../src/server';

import { getUsers } from './utils/users';

const PORT = process.env.PORT || 4001;

beforeAll(async () => {
  global.__SERVER__ = await server.start(
    {
      port: PORT,
      endpoint: '/gql',
    },
    ({ port }) => {
      console.log('Server is running ' + port);
    }
  );
});

afterAll(async () => {
  if (global.__SERVER__.close) {
    global.__SERVER__.close();
  }
});

describe('User related tests', () => {
  test('Should get users', async () => {
    const expected = { data: { users: [] } };
    const users = await getUsers();
    console.log(users);
    expect(users).toMatchObject(expected);
  });
});
