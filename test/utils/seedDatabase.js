import { hashSync } from 'bcrypt';

import generateToken from '../../src/utils/generateToken';
import prisma from '../../src/prisma';
import store from './store';

let userOne = {
  input: {
    name: 'pepe',
    email: 'pepe@example.com',
    password: hashSync('123456789', 10),
  },
  user: undefined,
  jwt: undefined,
};

async function seed() {
  const newUser = { ...userOne };
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  newUser.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  newUser.jwt = await generateToken(newUser.user.id);

  store.setItem('user', JSON.stringify(newUser));

  await prisma.mutation.createPost({
    data: {
      title: 'Post 1',
      body: 'Lorem Post',
      isPublished: true,
      author: {
        connect: { id: newUser.user.id },
      },
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: 'Post 2',
      body: 'Lorem Post',
      isPublished: false,
      author: {
        connect: { id: newUser.user.id },
      },
    },
  });
}

export { seed as default };
