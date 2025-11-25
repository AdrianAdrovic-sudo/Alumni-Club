import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProfileController {
    async getProfile(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const profile = await prisma.profile.findUnique({
                where: { id: Number(id) },
            });
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            return res.json(profile);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving profile', error });
        }
    }

    async updateProfile(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, bio } = req.body;
        try {
            const updatedProfile = await prisma.profile.update({
                where: { id: Number(id) },
                data: { name, email, bio },
            });
            return res.json(updatedProfile);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating profile', error });
        }
    }

    async deleteProfile(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.profile.delete({
                where: { id: Number(id) },
            });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting profile', error });
        }
    }
}