import { Router } from 'express';
import { PostService } from '../services/post.service';

const router = Router();
const postService = new PostService();

// Create a new post
router.post('/', async (req, res) => {
    try {
        const post = await postService.createPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await postService.getPostById(Number(req.params.id));
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a post by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPost = await postService.updatePost(Number(req.params.id), req.body);
        if (updatedPost) {
            res.status(200).json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a post by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await postService.deletePost(Number(req.params.id));
        if (deletedPost) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;