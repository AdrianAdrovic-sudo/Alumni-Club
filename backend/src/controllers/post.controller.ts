// backend/src/controllers/post.controller.ts
import { Request, Response } from "express";
import { listPosts, getPostById } from "../services/post.service";

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
