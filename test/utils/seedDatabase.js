import generateToken from '../../src/utils/generateToken';
import prisma from '../../src/prisma';
import { hashSync } from 'bcrypt';

const userOne = {
  input: {
    name: 'pepe',
    email: 'pepe@example.com',
    password: hashSync('123456789', 10),
  },
  user: undefined,
  jwt: undefined,
};

async function seed() {
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  userOne.jwt = await generateToken(userOne.user.id);
  await prisma.mutation.createPost({
    data: {
      title: 'Post 1',
      body: 'Lorem Post',
      isPublished: true,
      author: {
        connect: { id: userOne.user.id },
      },
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: 'Post 2',
      body: 'Lorem Post',
      isPublished: false,
      author: {
        connect: { id: userOne.user.id },
      },
    },
  });
}

export { seed as default, userOne };
