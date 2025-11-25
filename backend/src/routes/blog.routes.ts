import { Router } from "express";
import {
  listPostsController,
  getPostByIdController,
} from "../controllers/post.controller";
// ako zelimo da bude dostupno samo logovanim korisnicima:
// import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// GET /blog       -> lista postova (za Blog Page)
router.get("/", /* requireAuth, */ listPostsController);

// GET /blog/:id   -> jedan post (kad klikneš na blog)
router.get("/:id", /* requireAuth, */ getPostByIdController);

export default router;
