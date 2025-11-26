import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all alumni (users)
router.get('/', async (req, res) => {
  try {
    const alumni = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        enrollment_year: true,
        occupation: true,
        role: true
      }
    });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alumni' });
  }
});

// Get specific alumni by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const alumni = await prisma.users.findUnique({
      where: { 
        id: Number(id) 
      },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        enrollment_year: true,
        occupation: true,
        role: true,
        profile_picture: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alumni' });
  }
});

router.get('/alumni', async (req, res) => {
  try {
    const { year, company, field } = req.query;

    const filters: any = {};

    if (year) filters.gradYear = Number(year);
    if (company) filters.company = { contains: String(company), mode: "insensitive" };
    if (field) filters.field = { contains: String(field), mode: "insensitive" };

    const alumni = await prisma.users.findMany({
      where: filters,
      orderBy: { first_name: 'asc' }
    });

    res.json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;