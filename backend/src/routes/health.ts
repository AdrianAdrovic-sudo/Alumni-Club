// src/routes/health.ts
import { Router } from 'express';

const r = Router();

// GET /api/health
r.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/version
r.get('/version', (_req, res) => {
  res.json({ version: '0.1.0' }); // kasnije ubacujemo iz env-a/CI-ja
});

export default r;
