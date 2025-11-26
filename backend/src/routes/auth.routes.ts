import { Router } from 'express';
import { loginUser } from '../services/auth.service'; // Make sure this path is correct

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

export default router;