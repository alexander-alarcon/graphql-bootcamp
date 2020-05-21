import { getFirstname, isValidPassword } from '../src/utils/user';

describe('User related tests', () => {
  test('should return first name given full name', () => {
    const firstName = getFirstname('Son Goku');

    expect(firstName).toBe('Son');
  });

  test('Should return firts name given first name', () => {
    const firstName = getFirstname('Vegeta');

    expect(firstName).toBe('Vegeta');
  });

  test('should reject password if it is weak', () => {
    const password = 'password123';

    expect(isValidPassword(password)).toBe(false);
  });

  test('should accept password if it is strong', () => {
    const password = 'B474010a@';

    expect(isValidPassword(password)).toBe(true);
  });
});
