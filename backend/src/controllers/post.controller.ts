// backend/src/controllers/post.controller.ts
import { Request, Response } from "express";
import { listPosts, getPostById } from "../services/post.service";
import { createPost } from "../services/post.service";

export async function listPostsController(req: Request, res: Response) {
  try {
    const posts = await listPosts();
    return res.json(posts);
  } catch (err) {
    console.error("listPostsController error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getPostByIdController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  } catch (err) {
    console.error("getPostByIdController error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createPostController(req: Request, res: Response) {
  try {
    const userId = req.user?.id; // dolazi iz JWT tokena
    const { content, image_url } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await createPost(userId, content, image_url || null);
    return res.status(201).json(post);
  } catch (err) {
    console.error("createPostController error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
