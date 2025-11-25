import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const AlumniService = {
    async getAllAlumni() {
        return await prisma.alumni.findMany();
    },

    async getAlumniById(id: number) {
        return await prisma.alumni.findUnique({
            where: { id },
        });
    },

    async createAlumni(data: { name: string; email: string; graduationYear: number }) {
        return await prisma.alumni.create({
            data,
        });
    },

    async updateAlumni(id: number, data: { name?: string; email?: string; graduationYear?: number }) {
        return await prisma.alumni.update({
            where: { id },
            data,
        });
    },

    async deleteAlumni(id: number) {
        return await prisma.alumni.delete({
            where: { id },
        });
    },
};