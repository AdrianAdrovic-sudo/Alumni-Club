import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PostController {
    async createPost(req: Request, res: Response) {
        const { title, content } = req.body;
        try {
            const post = await prisma.post.create({
                data: {
                    title,
                    content,
                },
            });
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create post' });
        }
    }

    async getPosts(req: Request, res: Response) {
        try {
            const posts = await prisma.post.findMany();
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve posts' });
        }
    }

    async getPostById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const post = await prisma.post.findUnique({
                where: { id: Number(id) },
            });
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ error: 'Post not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve post' });
        }
    }

    async updatePost(req: Request, res: Response) {
        const { id } = req.params;
        const { title, content } = req.body;
        try {
            const post = await prisma.post.update({
                where: { id: Number(id) },
                data: { title, content },
            });
            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update post' });
        }
    }

    async deletePost(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.post.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete post' });
        }
    }
}