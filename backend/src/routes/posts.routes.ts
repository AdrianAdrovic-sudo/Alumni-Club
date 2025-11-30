import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.post('/posts', async (req, res) => {
  try {
    const { user_id, content, image_url } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ message: "user_id and content are required" });
    }

    const newPost = await prisma.posts.create({
      data: {
        user_id: Number(user_id),
        content,
        image_url: image_url || null
      }
    });

    res.status(201).json(newPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
