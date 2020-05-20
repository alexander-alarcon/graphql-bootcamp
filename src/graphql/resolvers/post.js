/* eslint-disable no-unused-vars */
import getUserId from '../../utils/getUserId';
import logger from '../../utils/logger';

export default {
  Query: {
    async posts(parent, { query, first, skip, after }, { prisma }, info) {
      try {
        const optionalArgs = {
          first,
          skip,
          after,
          where: {
            isPublished: true,
          },
        };
        if (query) {
          optionalArgs.where.OR = [
            {
              title_contains: query,
            },
            {
              body_contains: query,
            },
          ];
        }
        return await prisma.query.posts(optionalArgs, info);
      } catch (error) {
        logger.error(error.message, error);
        throw new Error('Something went wrong reading the posts');
      }
    },

    async post(parent, { id }, { prisma, request }, info) {
      const userId = await getUserId(request, false);

      const posts = await prisma.query.posts({
        where: {
          id,
          OR: [
            {
              isPublished: true,
            },
            {
              author: {
                id: userId,
              },
            },
          ],
        },
      });

      if (posts.length === 0) {
        throw new Error('Post not found!');
      }

      return posts[0];
    },

    async myPosts(
      parent,
      { query, first, skip, after },
      { prisma, request },
      info
    ) {
      try {
        const userId = await getUserId(request);
        const userExists = await prisma.exists.User({ id: userId });
        const optionalArgs = {
          first,
          skip,
          after,
          where: {
            author: {
              id: userId,
            },
          },
        };
        if (query) {
          optionalArgs.where.OR = [
            {
              title_contains: query,
            },
            {
              body_contains: query,
            },
          ];
        }
        if (!userExists) {
          throw new Error('unable to find posts');
        }
        const posts = prisma.query.posts(optionalArgs, info);
        return posts;
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },
  },

  Mutation: {
    async createPost(
      parent,
      { data: { title, body, isPublished = false } },
      { prisma, request },
      info
    ) {
      try {
        const userId = await getUserId(request);
        const userExists = await prisma.exists.User({ id: userId });

        if (!userExists) {
          throw new Error('User not found!');
        }

        const post = await prisma.mutation.createPost(
          {
            data: {
              title,
              body,
              isPublished,
              author: {
                connect: { id: userId },
              },
            },
          },
          info
        );

        return post;
      } catch (error) {
        logger.error(error.message, error);
        throw new Error('Something went wrong creating the user');
      }
    },

    async deletePost(parent, { id }, { prisma, request }, info) {
      try {
        const userId = await getUserId(request);
        const postExists = await prisma.exists.Post({
          id,
          author: {
            id: userId,
          },
        });
        if (!postExists) {
          throw new Error('Post not found!');
        }

        const post = await prisma.mutation.deletePost(
          {
            where: {
              id,
            },
          },
          info
        );
        return post;
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },

    async updatePost(parent, { id, data }, { prisma, request }, info) {
      try {
        const userId = await getUserId(request);
        const postExists = await prisma.exists.Post({
          id,
          author: { id: userId },
        });

        const isPublished = await prisma.exists.Post({ id, isPublished: true });

        if (!postExists) {
          throw new Error('Post not found');
        }

        if (isPublished && data.isPublished === false) {
          await prisma.mutation.deleteManyComments({
            where: {
              post: { id },
            },
          });
        }

        const post = await prisma.mutation.updatePost(
          {
            where: {
              id,
            },
            data,
          },
          info
        );
        return post;
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },
  },

  Subscription: {
    post: {
      subscribe(parent, args, { prisma }, info) {
        try {
          return prisma.subscription.post(
            {
              where: {
                node: {
                  isPublished: true,
                },
              },
            },
            info
          );
        } catch (error) {
          logger.error(error.message, error);
          throw new Error('Something went wrong on post subscription');
        }
      },
    },

    myPost: {
      async subscribe(parent, args, { prisma, request }, info) {
        try {
          const userId = await getUserId(request);

          return prisma.subscription.post(
            {
              where: {
                node: {
                  author: {
                    id: userId,
                  },
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
