import { hash } from 'bcrypt';

import logger from './logger';

async function hashPassword(password) {
  try {
    if (password.length < 8) {
      throw new Error('Password must be 8 characters long');
    }

    const hashedPassword = await hash(password, 10);

    return hashedPassword;
  } catch (error) {
    logger.error(error.message, error);
    throw error;
  }
}

export { hashPassword as default };
