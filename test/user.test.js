import { getUsers, createUser, login, getProfile } from './utils/users';
import { getFirstname, isValidPassword } from '../src/utils/user';
import seed, { getUserOne } from './utils/seedDatabase';
import prisma from '../src/prisma';
import store from './utils/store';

describe('User related tests', () => {
  const userOne = JSON.parse(store.getItem('user'));

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
    userOne.jwt = `Bearer ${loginResponse.token}`;
    expect(loginResponse).toHaveProperty('token');
  });

  test('Should expose private author profile', async () => {
    const users = await getUsers(true, userOne.jwt);

    expect(users.length).toBe(2);
    expect(users[0].email).toBe('pepe@example.com');
    expect(users[0].name).toBe('pepe');
    expect(users[1].email).toBeNull();
    expect(users[1].name).toBe('goku');
  });

  /* test('Should show all profile data when auth', async () => {
    const profileData = await getProfile(header);

    expect(profileData.id).toBe(userOne.user.id);
    expect(profileData.name).toBe(userOne.user.name);
    expect(profileData.email).toBe(userOne.user.email);
  });

  test('Should fail if not auth when try to get profile', async () => {
    await expect(getProfile()).rejects.toThrow();
  }); */
});
