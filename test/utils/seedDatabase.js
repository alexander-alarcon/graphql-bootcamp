import hashPassword from '../../src/utils/hashPassword';
import prisma from '../../src/prisma';

async function seed() {
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
}

export default seed;
