// src/controllers/users.controller.ts
import { Request, Response } from "express";
import prisma from "../prisma";

export async function searchUsers(req: Request, res: Response) {
  const query = String(req.query.query || "").trim();

  if (!query || query.length < 2) {
    return res.json({ users: [] });
  }

  const users = await prisma.users.findMany({
    where: {
      is_active: true,
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { first_name: { contains: query, mode: "insensitive" } },
        { last_name: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      username: true,
      first_name: true,
      last_name: true,
    },
    take: 10,
    orderBy: { username: "asc" },
  });

  return res.json({ users });
}
