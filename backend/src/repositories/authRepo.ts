import { hashPassword, comparePasswords, generateToken } from '../utils/auth';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // hashed
  role: 'admin' | 'member';
}

let users: User[] = [];

export function registerUser(name: string, email: string, password: string) {
  if (!name || !email || !password) throw new Error('Missing fields');

  const existing = users.find((u) => u.email === email);
  if (existing) throw new Error('User already exists');

  const hashed = hashPassword(password);
  const newUser: User = {
    id: users.length + 1,
    name,
    email,
    password: hashed,
    role: 'member',
  };
  users.push(newUser);

  // nikad ne vraćamo password ka klijentu
  const { password: _hidden, ...safe } = newUser;
  return safe;
}

export function loginUser(email: string, password: string) {
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('Invalid credentials');

  const ok = comparePasswords(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const { password: _hidden, ...safe } = user;
  return { token, user: safe };
}
