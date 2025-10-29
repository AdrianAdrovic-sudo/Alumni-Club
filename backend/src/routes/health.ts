// src/routes/health.ts
import { Router } from "express";

const r = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Proverava da li API radi
 *     responses:
 *       200:
 *         description: Status servera OK
 *         content:
 *           application/json:
 *             example:
 *               status: ok
 */
r.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * @swagger
 * /version:
 *   get:
 *     summary: Vraća verziju API-ja
 *     responses:
 *       200:
 *         description: Trenutna verzija API-ja
 *         content:
 *           application/json:
 *             example:
 *               version: 0.1.0
 */
r.get("/version", (_req, res) => {
  res.json({ version: "0.1.0" }); // kasnije ubacujemo iz env-a/CI-ja
});

export default r;
