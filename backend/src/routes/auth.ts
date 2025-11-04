import { Router } from 'express';
import { registerUser, loginUser } from '../repositories/authRepo';
import { requireAuth } from '../middlewares/authMiddleware';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registracija novog korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Filip
 *               email:
 *                 type: string
 *                 example: filip@alumni.com
 *               password:
 *                 type: string
 *                 example: filip123
 *     responses:
 *       201:
 *         description: Uspešna registracija
 *       400:
 *         description: Greška prilikom registracije
 */
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = registerUser(name, email, password);
    res.status(201).json({ message: '✅ Registracija uspešna', user });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Greška prilikom registracije.' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     description: Dozvoljeno maksimalno 5 pokušaja prijave u minuti po IP adresi.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@alumni.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Uspešna prijava (vraća JWT token)
 *       400:
 *         description: Nedostaju podaci
 *       401:
 *         description: Pogrešan email ili lozinka
 *       429:
 *         description: Previše pokušaja prijave
 */
router.post('/login', authRateLimiter, (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email i lozinka su obavezni.' });
    }

    const result = loginUser(email, password);
    res.json({
      message: '✅ Login uspešan',
      token: result.token,
      user: result.user,
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Pogrešan email ili lozinka.' });
  }
});

// GET /api/auth/me (zaštićeno)
router.get('/me', requireAuth, (req, res) => {
  res.json({ message: '✅ Token validan', user: (req as any).user });
});

export default router;
