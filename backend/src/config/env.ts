import * as dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  DATABASE_URL: process.env.DATABASE_URL || ""
};

if (!ENV.DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1);
}
