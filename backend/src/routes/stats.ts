import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/stats/mock:
 *   get:
 *     summary: Returns mock statistics for analytics
 *     responses:
 *       200:
 *         description: Mock stats
 *         content:
 *           application/json:
 *             example:
 *               totalUsers: 120
 *               verifiedUsers: 95
 *               blogs: 25
 *               news: 6
 */
router.get('/mock', (req: Request, res: Response) => {
  res.json({
    totalUsers: 120,
    verifiedUsers: 95,
    blogs: 25,
    news: 6
  });
});

export default router;
