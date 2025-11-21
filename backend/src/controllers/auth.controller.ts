// backend/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { loginService } from "../services/auth.service";
import { LoginRequestBody } from "../types/auth.types";

export async function loginController(req: Request, res: Response) {
  try {
    const { username, password } = req.body as LoginRequestBody;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    const result = await loginService({ username, password });
    return res.status(200).json(result);
  } catch (err: unknown) {
  if (err instanceof Error) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res
        .status(401)
        .json({ message: "Invalid username or password" });
    }

    if (err.message === "INACTIVE_ACCOUNT") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    console.error("loginController error:", err);
    return res.status(500).json({ message: "Server error" });
  }

  // fallback for non-Error throws
  console.error("loginController error:", err);
  return res.status(500).json({ message: "Server error" });
}

}
