// backend/src/config/env.ts
import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS
    ? Number(process.env.BCRYPT_ROUNDS)
    : 10
};

if (!ENV.DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1);
}

if (!ENV.JWT_SECRET) {
  console.error("JWT_SECRET is missing in .env");
  process.exit(1);
}
