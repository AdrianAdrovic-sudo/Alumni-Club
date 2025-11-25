// backend/src/services/post.service.ts
import { pool } from "../db/pool";

export type DbPostRow = {
  id: number;
  user_id: number;
  content: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
  author_username: string;
};

export async function listPosts(): Promise<DbPostRow[]> {
  const result = await pool.query(
    `SELECT 
       p.id,
       p.user_id,
       p.content,
       p.image_url,
       p.created_at,
       p.updated_at,
       u.username AS author_username
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`
  );

  return result.rows;
}

export async function getPostById(id: number): Promise<DbPostRow | null> {
  const result = await pool.query(
    `SELECT 
       p.id,
       p.user_id,
       p.content,
       p.image_url,
       p.created_at,
       p.updated_at,
       u.username AS author_username
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [id]
  );

  return (result.rows[0] as DbPostRow) || null;
}
