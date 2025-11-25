import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await prisma.profile.findMany();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching profiles.' });
    }
});

// Get a single profile by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await prisma.profile.findUnique({
            where: { id: Number(id) },
        });
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ error: 'Profile not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the profile.' });
    }
});

// Create a new profile
router.post('/', async (req, res) => {
    const { name, email, bio } = req.body;
    try {
        const newProfile = await prisma.profile.create({
            data: { name, email, bio },
        });
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the profile.' });
    }
});

// Update a profile by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, bio } = req.body;
    try {
        const updatedProfile = await prisma.profile.update({
            where: { id: Number(id) },
            data: { name, email, bio },
        });
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the profile.' });
    }
});

// Delete a profile by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.profile.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the profile.' });
    }
});

export default router;