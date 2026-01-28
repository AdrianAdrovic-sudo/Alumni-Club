import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import {
  createPost,
  getApprovedPosts,
  getPendingPosts,
  approvePost,
  deletePost,
  getPostById,
  updatePost,
} from "../services/posts.service";
import { postsImageUpload } from "../utils/postsUpload";

const router = Router();

/**
 * GET /api/posts
 * Javna ruta – vraća samo odobrene postove
 */
router.get("/posts", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await getApprovedPosts(page, limit);
    return res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/posts
 * Ulogovani korisnik kreira novi blog post (ide na odobrenje)
 * Accepts:
 *  - JSON: { title, category, imageUrl?, readTime?, shortDesc, content }
 *  - multipart/form-data: fields + file "image"
 */
router.post(
  "/posts",
  authenticate,
  // This middleware will only act on multipart/form-data. It won't break JSON requests.
  postsImageUpload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user!.id;

      const { title, category, readTime, shortDesc, content } = req.body;

      if (!title || !category || !shortDesc || !content) {
        return res
          .status(400)
          .json({ message: "title, category, shortDesc i content su obavezni" });
      }

      // If uploaded file exists, store local path in DB; otherwise accept old imageUrl.
      let imageUrl: string | undefined = undefined;

      if (req.file) {
        // This path is what frontend can request IF you already serve /uploads statically
        imageUrl = `/uploads/posts/${req.file.filename}`;
      } else if (req.body.imageUrl) {
        imageUrl = req.body.imageUrl;
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
      const message =
        err instanceof Error ? err.message : "Server error";
      return res.status(500).json({ message });
    }
  }
);

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

router.put("/posts/:id", authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = req.user!;
    const { title, category, short_desc, content, read_time } = req.body;

    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (user.role !== "admin" && post.user_id !== user.id) {
      return res.status(403).json({ message: "You can edit only your own posts" });
    }

    const updatedPost = await updatePost(id, {
      title,
      category,
      short_desc,
      content,
      read_time,
    });

    return res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/posts/:id", authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = req.user!;

    if (user.role === "admin") {
      const post = await deletePost(id);
      return res.json(post);
    }

    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== user.id) {
      return res.status(403).json({ message: "You can delete only your own posts" });
    }

    const deleted = await deletePost(id);
    return res.json(deleted);
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
