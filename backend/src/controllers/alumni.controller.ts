import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AlumniController {
    async getAllAlumni(req: Request, res: Response) {
        try {
            const alumni = await prisma.alumni.findMany();
            res.json(alumni);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch alumni' });
        }
    }

    async getAlumniById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const alumni = await prisma.alumni.findUnique({
                where: { id: Number(id) },
            });
            if (!alumni) {
                return res.status(404).json({ error: 'Alumni not found' });
            }
            res.json(alumni);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch alumni' });
        }
    }

    async createAlumni(req: Request, res: Response) {
        const { name, graduationYear } = req.body;
        try {
            const newAlumni = await prisma.alumni.create({
                data: {
                    name,
                    graduationYear,
                },
            });
            res.status(201).json(newAlumni);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create alumni' });
        }
    }

    async updateAlumni(req: Request, res: Response) {
        const { id } = req.params;
        const { name, graduationYear } = req.body;
        try {
            const updatedAlumni = await prisma.alumni.update({
                where: { id: Number(id) },
                data: {
                    name,
                    graduationYear,
                },
            });
            res.json(updatedAlumni);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update alumni' });
        }
    }

    async deleteAlumni(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.alumni.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete alumni' });
        }
    }
}

export default new AlumniController();