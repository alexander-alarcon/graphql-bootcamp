import { sign } from 'jsonwebtoken';

function generateToken(userId) {
  return sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export { generateToken as default };
