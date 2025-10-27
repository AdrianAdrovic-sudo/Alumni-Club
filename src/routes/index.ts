// src/routes/index.ts
import { Router } from 'express';
import health from './health';

const router = Router();

router.use(health);
// ovde će ići i ostali moduli kasnije, npr:
// router.use('/auth', authRoutes);

export default router;
