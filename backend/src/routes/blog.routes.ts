import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const posts = await prisma.blogPost.findMany();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching blog posts.' });
    }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.blogPost.findUnique({
            where: { id: Number(id) },
        });
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: 'Blog post not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the blog post.' });
    }
});

// Create a new blog post
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    try {
        const newPost = await prisma.blogPost.create({
            data: { title, content },
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the blog post.' });
    }
});

// Update a blog post by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updatedPost = await prisma.blogPost.update({
            where: { id: Number(id) },
            data: { title, content },
        });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the blog post.' });
    }
});

// Delete a blog post by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.blogPost.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the blog post.' });
    }
});

export default router;