import getUserId from '../../utils/getUserId';
import logger from '../../utils/logger';

export default {
  Query: {
    async comments(parent, { first, skip, after }, { prisma }, info) {
      try {
        const optionalArgs = {
          first,
          skip,
          after,
        };
        const comments = await prisma.query.comments(optionalArgs, info);
        return comments;
      } catch (error) {
        logger.error(error.message, error);
        throw new Error('Something went wrong reading comments');
      }
    },
  },

  Mutation: {
    async createComment(
      parent,
      { data: { text, post } },
      { prisma, request },
      info
    ) {
      try {
        const userId = await getUserId(request);
        const userExists = await prisma.exists.User({ id: userId });
        const postExists = await prisma.exists.Post({
          id: post,
          isPublished: true,
        });

        if (!userExists || !postExists) {
          throw new Error('Unable to create comment');
        }

        const comment = await prisma.mutation.createComment(
          {
            data: {
              text,
              author: {
                connect: {
                  id: userId,
                },
              },
              post: {
                connect: {
                  id: post,
                },
              },
            },
          },
          info
        );

        return comment;
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },

    async deleteComment(parent, { id }, { prisma, request }, info) {
      try {
        const userId = await getUserId(request);
        const commentExists = await prisma.exists.Comment({
          id,
          author: {
            id: userId,
          },
        });

        if (!commentExists) {
          throw new Error('Unable to delete comment');
        }
        const comment = await prisma.mutation.deleteComment(
          {
            where: {
              id,
            },
          },
          info
        );

        return comment;
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },

    async updateComment(parent, { id, data }, { prisma, request }, info) {
      try {
        const userId = await getUserId(request);
        const commentExists = await prisma.exists.Comment({
          id,
          author: {
            id: userId,
          },
        });
        if (!commentExists) {
          throw new Error('Unable to update comment');
        }
        const comment = await prisma.mutation.updateComment(
          {
            where: {
              id,
            },
            data,
          },
          info
        );

        return comment;
      } catch (error) {
        logger.error(error.message, error);
        throw error;
      }
    },
  },

  Subscription: {
    comment: {
      async subscribe(parent, { postId }, { prisma }, info) {
        try {
          return prisma.subscription.comment(
            {
              where: {
                node: {
                  post: {
                    id: postId,
                  },
                },
              },
            },
            info
          );
        } catch (error) {
          logger.error(error.message, error);
          throw new Error('Something went wrong on comment subscription');
        }
      },
    },
  },
};
