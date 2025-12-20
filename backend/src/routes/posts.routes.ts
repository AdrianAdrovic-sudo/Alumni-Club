// src/routes/posts.routes.ts
import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import {
  createPost,
  getApprovedPosts,
  getPendingPosts,
  approvePost,
  deletePost,
  getPostById,
} from "../services/posts.service";

const router = Router();

/**
 * GET /api/posts
 * Javna ruta – vraća samo odobrene postove
 */
router.get("/posts", async (_req, res) => {
  try {
    const posts = await getApprovedPosts();
    return res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/posts
 * Ulogovani korisnik kreira novi blog post (ide na odobrenje)
 */
router.post("/posts", authenticate, async (req, res) => {
  try {
    const userId = req.user!.id; // dolazi iz auth.middleware

    const { title, category, imageUrl, readTime, shortDesc, content } =
      req.body;

    if (!title || !category || !shortDesc || !content) {
      return res
        .status(400)
        .json({ message: "title, category, shortDesc i content su obavezni" });
    }

    const post = await createPost({
      userId,
      title,
      category,
      imageUrl,
      readTime,
      shortDesc,
      content,
    });

    return res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/posts/pending
 * Admin – lista postova na čekanju
 */
router.get("/posts/pending", authenticate, requireAdmin, async (_req, res) => {
  try {
    const posts = await getPendingPosts();
    return res.json(posts);
  } catch (err) {
    console.error("Error fetching pending posts:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/posts/:id/approve
 * Admin – odobrava post
 */
router.patch(
  "/posts/:id/approve",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const post = await approvePost(id);
      return res.json(post);
    } catch (err) {
      console.error("Error approving post:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete("/posts/:id", authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = req.user!; // iz auth.middleware

    // 1) Ako je admin – može brisati bilo koji post
    if (user.role === "admin") {
      const post = await deletePost(id);
      return res.json(post);
    }

    // 2) Ako NIJE admin – može brisati samo SVOJ post
    const post = await getPostById(id);

    if (!post || post.is_deleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== user.id) {
      return res
        .status(403)
        .json({ message: "You can delete only your own posts" });
    }

    const deleted = await deletePost(id);
    return res.json(deleted);
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
