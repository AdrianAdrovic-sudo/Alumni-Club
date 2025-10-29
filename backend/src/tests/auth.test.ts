import { hashPassword, comparePasswords } from '../utils/auth';

describe('Auth utils', () => {
  it('should hash and verify password correctly', () => {
    const password = '12345678';
    const hash = hashPassword(password);
    expect(comparePasswords(password, hash)).toBe(true);
  });
});
