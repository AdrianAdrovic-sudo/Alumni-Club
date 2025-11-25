import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PostService = {
    createPost: async (data) => {
        return await prisma.post.create({
            data,
        });
    },

    getAllPosts: async () => {
        return await prisma.post.findMany();
    },

    getPostById: async (id) => {
        return await prisma.post.findUnique({
            where: { id },
        });
    },

    updatePost: async (id, data) => {
        return await prisma.post.update({
            where: { id },
            data,
        });
    },

    deletePost: async (id) => {
        return await prisma.post.delete({
            where: { id },
        });
    },
};