import { pool } from "../db/pool";

export async function getAllAlumni(search?: string){
    if (search) {
    const keyword = `%${search}%`;

    const result = await pool.query(
      `SELECT 
        id, first_name, last_name, occupation, profile_picture
       FROM users
       WHERE role = 'alumni'
         AND (first_name ILIKE $1 OR last_name ILIKE $1 OR occupation ILIKE $1)
       ORDER BY last_name ASC`,
      [keyword]
    );

    return result.rows;
}

const result = await pool.query(
    `SELECT 
      id, first_name, last_name, occupation, profile_picture
     FROM users
     WHERE role = 'alumni'
     ORDER BY last_name ASC`
  );

  return result.rows;

}

export async function getAlumniById(id: number) {
  const result = await pool.query(
    `SELECT 
      id, first_name, last_name, email, occupation, profile_picture, enrollment_year
     FROM users
     WHERE id = $1 AND role = 'alumni'`,
    [id]
  );

  return result.rows[0] || null;
}