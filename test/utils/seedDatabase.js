import { hashSync } from 'bcrypt';

import generateToken from '../../src/utils/generateToken';
import prisma from '../../src/prisma';
import store from './store';

let user = {
  input: {
    name: 'pepe',
    email: 'pepe@example.com',
    password: hashSync('123456789', 10),
  },
  user: undefined,
  jwt: undefined,
};

const post = {
  input: {
    title: 'Post 1',
    body: 'Lorem Post',
    isPublished: true,
  },
  post: undefined,
};

const post2 = {
  input: {
    title: 'Post 2',
    body: 'Lorem Post',
    isPublished: false,
  },
  post: undefined,
};

async function seed() {
  const newUser = { ...user };
  const newPost = { ...post };
  const newPost2 = { ...post2 };
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  newUser.user = await prisma.mutation.createUser({
    data: user.input,
  });
  newUser.jwt = await generateToken(newUser.user.id);

  store.setItem('user', JSON.stringify(newUser));

  newPost.post = await prisma.mutation.createPost({
    data: {
      ...post.input,
      author: {
        connect: { id: newUser.user.id },
      },
    },
  });
  newPost2.post = await prisma.mutation.createPost({
    data: {
      ...post2.input,
      author: {
        connect: { id: newUser.user.id },
      },
    },
  });

  store.setItem('post', JSON.stringify(newPost));
  store.setItem('post2', JSON.stringify(newPost2));
}

export { seed as default };
