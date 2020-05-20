import { verify } from 'jsonwebtoken';

import logger from './logger';

async function getUserId(request, requiredAuth = true) {
  try {
    let header;

    if (request.request) {
      header = request.request.headers.authorization;
    } else {
      header = request.connection.context.Authorization;
    }

    if (header) {
      const token = header.replace('Bearer ', '');
      const { userId } = await verify(token, 'SuperSecret');
      return userId;
    }

    if (requiredAuth) {
      throw new Error('Authorization required');
    }

    return null;
  } catch (error) {
    logger.error(error.message, error);
    throw new Error('Invalid token');
  }
}

export { getUserId as default };
