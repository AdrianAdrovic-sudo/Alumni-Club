// backend/src/services/auth.service.ts
import * as bcrypt from "bcrypt";
import { sign, type Secret, type SignOptions } from "jsonwebtoken";
import { pool } from "../db/pool";
import { ENV } from "../config/env";
import {
  JwtUserPayload,
  LoginRequestBody,
  LoginResponse,
  UserRole
} from "../types/auth.types";

type DbUserRow = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
};

export async function loginService(
  body: LoginRequestBody
): Promise<LoginResponse> {
  const { username, password } = body;

  // 1) Fetch user
  const userRes = await pool.query(
    `SELECT id, username, email, password_hash, role, is_active
     FROM users
     WHERE username = $1
     LIMIT 1`,
    [username]
  );

  const user = userRes.rows[0] as DbUserRow | undefined;

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!user.is_active) {
    throw new Error("INACTIVE_ACCOUNT");
  }

  // 2) Check password
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // 3) JWT payload
  const payload: JwtUserPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  // 4) JWT options FIXED
  const secret: Secret = ENV.JWT_SECRET;

  // strict TS fix: cast expiresIn to SignOptions["expiresIn"]
  const options: SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  const token = sign(payload, secret, options);

  return { token, user: payload };
}
