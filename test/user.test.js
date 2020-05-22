import { getFirstname, isValidPassword } from '../src/utils/user';
import hashPassword from '../src/utils/hashPassword';
import { PORT } from './utils/constants';
import prisma from '../src/prisma';
import server from '../src/server';

import { getUsers, createUser } from './utils/users';
import { getPosts } from './utils/posts';

beforeEach(async () => {
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  const user = await prisma.mutation.createUser({
    data: {
      name: 'pepe',
      email: 'pepe@example.com',
      password: await hashPassword('123456789'),
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: 'Post 1',
      body: 'Lorem Post',
      isPublished: true,
      author: {
        connect: { id: user.id },
      },
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: 'Post 2',
      body: 'Lorem Post',
      isPublished: false,
      author: {
        connect: { id: user.id },
      },
    },
  });
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

  test('Should expose public author profiles', async () => {
    const users = await getUsers();
    expect(users.length).toBe(1);
    expect(users[0].email).toBeNull();
    expect(users[0].name).toBe('pepe');
  });

  test('Should not login with bad credentials', async () => {});
});

describe('Post related tests', () => {
  test('Should expose just published posts', async () => {
    const posts = await getPosts();
    expect(posts.length).toBe(1);
    expect(posts[0].isPublished).toBe(true);
    expect(posts[0].author.name).toBe('pepe');
    expect(posts[0].author.email).toBeNull();
  });
});
