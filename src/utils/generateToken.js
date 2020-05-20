import { sign } from 'jsonwebtoken';

function generateToken(userId) {
  return sign({ userId }, 'SuperSecret', {
    expiresIn: '7d',
  });
}

export { generateToken as default };
