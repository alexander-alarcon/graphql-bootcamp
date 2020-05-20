/* eslint-disable no-unused-vars */
import { hash, compare } from 'bcrypt';

import generateToken from '../../utils/generateToken';
import hashPassword from '../../utils/hashPassword';
import getUserId from '../../utils/getUserId';
import logger from '../../utils/logger';

export default {
  Query: {
    async users(
      parent,
      { query, first = 10, skip = 0, after, orderBy },
      { prisma },
      info
    ) {
      try {
        const optionalArgs = {
          first,
          skip,
          after,
          orderBy,
        };

        if (query) {
          optionalArgs.where = {
            OR: [
              {
                name_contains: query,
              },
            ],
          };
        }
        return await prisma.query.users(optionalArgs, info);
      } catch (error) {
        logger.log(error.message, error);
        throw new Error('Oops Something went wring reading the users data');
      }
    },

    async me(parent, args, { prisma, request }, info) {
      try {
        const userId = await getUserId(request);
        const user = await prisma.query.user(
          {
            where: {
              id: userId,
            },
          },
          info
        );

        if (!user) {
          throw new Error('User not found!');
        }

        return user;
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },
  },

  Mutation: {
    async createUser(
      parent,
      { data: { name, email, password } },
      { prisma },
      info
    ) {
      try {
        const emailTaken = await prisma.exists.User({ email });

        if (emailTaken) {
          throw new Error('Email already taken');
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.mutation.createUser({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });

        return {
          user,
          token: generateToken(user.id),
        };
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },

    async login(parent, { data: { email, password } }, { prisma }, info) {
      try {
        const user = await prisma.query.user({
          where: {
            email,
          },
        });
        if (!user) {
          throw new Error('Email or password invalid');
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new Error('Email or password invalid');
        }

        return {
          user,
          token: generateToken(user.id),
        };
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },

    async deleteUser(parent, args, { prisma, request }, info) {
      try {
        const userId = await getUserId(request);
        const userExists = await prisma.exists.User({ id: userId });

        if (!userExists) {
          throw new Error('User not found!');
        }
        const user = await prisma.mutation.deleteUser(
          {
            where: {
              id: userId,
            },
          },
          info
        );
        return user;
      } catch (error) {
        logger.error(error.message, error);
        throw new Error(error.message);
      }
    },

    async updateUser(parent, { data }, { prisma, request }, info) {
      try {
        const userId = await getUserId(request);

        if (typeof data.password === 'string') {
          data.password = await hashPassword(data.password);
        }
        const user = await prisma.mutation.updateUser(
          { where: { id: userId }, data },
          info
        );
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },
  },

  User: {
    email: {
      fragment: 'fragment userId on User { id }',
      async resolve(parent, args, { request }, info) {
        const userId = await getUserId(request, false);
        if (userId && parent.id === userId) {
          return parent.email;
        }
        return null;
      },
    },

    posts: {
      fragment: 'fragment userId on User { id }',
      async resolve(parent, args, { prisma, request }, info) {
        try {
          const userId = await getUserId(request, false);
          return prisma.query.posts(
            {
              where: {
                isPublished: true,
                author: {
                  id: parent.id,
                },
              },
            },
            info
          );
        } catch (error) {
          logger.error(error.message, error);
          throw error;
        }
      },
    },
  },
};
