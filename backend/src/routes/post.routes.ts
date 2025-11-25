import { Router } from "express";
import {
  listPostsController,
  getPostByIdController,
  createPostController,
} from "../controllers/post.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// PUBLIC
router.get("/", listPostsController);
router.get("/:id", getPostByIdController);

// PROTECTED (mora login)
router.post("/", requireAuth, createPostController);

export default router;
