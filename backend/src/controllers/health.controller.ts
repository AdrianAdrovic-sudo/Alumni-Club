import { Request, Response } from "express";
import { pingDB } from "../db/pool";

export function health(req: Request, res: Response) {
  res.json({ status: "ok", service: "alumni-backend" });
}

export async function dbCheck(req: Request, res: Response) {
  const ok = await pingDB();
  res.status(ok ? 200 : 500).json({ database: ok ? "connected" : "unreachable" });
}
