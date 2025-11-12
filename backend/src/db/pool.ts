// src/db/pool.ts
import { Pool } from "pg";
import { ENV } from "../config/env";

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL
});

export async function pingDB(): Promise<boolean> {
  try {
    const res = await pool.query("SELECT 1 as ok");
    return Number(res.rows[0]?.ok) === 1;
  } catch {
    return false;
  }
}
