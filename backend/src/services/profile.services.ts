// backend/src/services/profile.service.ts
import { pool } from "../db/pool";

export async function getProfileById(userId: number) {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, username,
            profile_picture, enrollment_year, occupation, role
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return result.rows[0] || null;
}

export async function updateProfileById(
  userId: number,
  data: {
    first_name?: string;
    last_name?: string;
    username?: string;
    profile_picture?: string | null;
    enrollment_year?: number;
    occupation?: string | null;
  }
) {
  const result = await pool.query(
    `UPDATE users
     SET
       first_name = COALESCE($2, first_name),
       last_name = COALESCE($3, last_name),
       username = COALESCE($4, username),
       profile_picture = COALESCE($5, profile_picture),
       enrollment_year = COALESCE($6, enrollment_year),
       occupation = COALESCE($7, occupation),
       updated_at = now()
     WHERE id = $1
     RETURNING id, first_name, last_name, email, username,
               profile_picture, enrollment_year, occupation, role`,
    [
      userId,
      data.first_name ?? null,
      data.last_name ?? null,
      data.username ?? null,
      data.profile_picture ?? null,
      data.enrollment_year ?? null,
      data.occupation ?? null,
    ]
  );

  return result.rows[0] || null;
}
