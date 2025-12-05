import { Router } from 'express';
import { loginUser } from '../services/auth.service'; // existing
import prisma from '../prisma';                        // NEW
import bcrypt from 'bcryptjs';                         // NEW

const router = Router();

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

/**
 * STEP 1: provjera korisničkog imena i emaila
 * POST /api/auth/reset-check
 * body: { username, email }
 */
router.post('/reset-check', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ message: 'Korisničko ime i email su obavezni.' });
    }

    const user = await prisma.users.findFirst({
      where: { username, email },
      select: { id: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Nije pronađen korisnik sa datim podacima.' });
    }

    return res.json({ message: 'Korisnik pronađen.', userId: user.id });
  } catch (error) {
    console.error('reset-check error:', error);
    return res
      .status(500)
      .json({ message: 'Došlo je do greške. Pokušajte ponovo.' });
  }
});

/**
 * STEP 2: potvrda nove šifre
 * POST /api/auth/reset-confirm
 * body: { username, email, newPassword }
 */
router.post('/reset-confirm', async (req, res) => {
  try {
    const { username, email, newPassword } = req.body;

    if (!username || !email || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Sva polja su obavezna.' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'Šifra mora imati najmanje 6 karaktera.' });
    }

    const user = await prisma.users.findFirst({
      where: { username, email },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Nije pronađen korisnik sa datim podacima.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: hashed },
    });

    return res.json({ message: 'Šifra je uspješno promijenjena.' });
  } catch (error) {
    console.error('reset-confirm error:', error);
    return res
      .status(500)
      .json({ message: 'Došlo je do greške. Pokušajte ponovo.' });
  }
});

export default router;
