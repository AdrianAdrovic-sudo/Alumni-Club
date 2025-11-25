import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get About Us information
router.get('/', async (req, res) => {
    try {
        const aboutUsInfo = await prisma.aboutUs.findMany(); // Assuming you have an AboutUs model
        res.json(aboutUsInfo);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching About Us information.' });
    }
});

// Create About Us information
router.post('/', async (req, res) => {
    const { title, content } = req.body; // Adjust according to your model fields
    try {
        const newAboutUs = await prisma.aboutUs.create({
            data: {
                title,
                content,
            },
        });
        res.status(201).json(newAboutUs);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating About Us information.' });
    }
});

// Update About Us information
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body; // Adjust according to your model fields
    try {
        const updatedAboutUs = await prisma.aboutUs.update({
            where: { id: Number(id) },
            data: {
                title,
                content,
            },
        });
        res.json(updatedAboutUs);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating About Us information.' });
    }
});

// Delete About Us information
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.aboutUs.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting About Us information.' });
    }
});

export default router;