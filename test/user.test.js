import { getFirstname, isValidPassword } from '../src/utils/user';
import prisma from '../src/prisma';
import server from '../src/server';

import { getUsers, createUser } from './utils/users';

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
    expect(users).toMatchObject(expected);
  });

  test('Should create user', async () => {
    const user = {
      name: 'goku',
      email: 'goku@example.com',
      password: '123456789',
    };

    const newUser = await createUser(user.name, user.email, user.password);
    expect(newUser).toHaveProperty('data');
    expect(newUser.data).toHaveProperty('createUser');
    expect(newUser.data.createUser).toHaveProperty('user');
    expect(newUser.data.createUser).toHaveProperty('token');
    expect(newUser.data.createUser.user.name).toBe(user.name);
    expect(newUser.data.createUser.user.email).toBeNull();

    const userExists = await prisma.exists.User({
      id: newUser.data.createUser.user.id,
    });

    expect(userExists).toBe(true);
  });
});
