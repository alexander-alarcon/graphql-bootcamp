import { getFirstname, isValidPassword } from '../src/utils/user';
import seed from './utils/seedDatabase';
import prisma from '../src/prisma';

import { getUsers, createUser, login } from './utils/users';

beforeAll(async () => {
  await seed();
});

describe('User related tests', () => {
  test('Should create user', async () => {
    const user = {
      name: 'goku',
      email: 'goku@example.com',
      password: '123456789',
    };

    const newUser = await createUser(user.name, user.email, user.password);
    expect(newUser.user.name).toBe(user.name);
    expect(newUser.user.email).toBeNull();

    const userExists = await prisma.exists.User({
      id: newUser.user.id,
    });

    expect(userExists).toBe(true);
  });

  test('Should not create user', async () => {
    const user = {
      name: 'goku',
      email: 'goku@example.com',
      password: '123456789',
    };

    await expect(
      createUser(user.name, user.email, user.password)
    ).rejects.toThrow();
  });

  test('Should expose public author profiles', async () => {
    const users = await getUsers();
    expect(users.length).toBe(2);
    expect(users[0].email).toBeNull();
    expect(users[0].name).toBe('pepe');
  });

  test('Should not login with bad credentials', async () => {
    const badCredentials = {
      email: 'pepe@example.com',
      password: '987654321',
    };

    await expect(
      login(badCredentials.email, badCredentials.password)
    ).rejects.toThrow();
  });

  test('Should login conrrectly', async () => {
    const credentials = {
      email: 'pepe@example.com',
      password: '123456789',
    };

    const loginResponse = await login(credentials.email, credentials.password);

    expect(loginResponse).toHaveProperty('token');
  });
});
