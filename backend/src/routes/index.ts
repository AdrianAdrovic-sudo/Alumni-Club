import { Router } from "express";
import health from "./health";
import usersRoutes from "./users";
import alumniRoutes from "./alumni";
import newsRoutes from "./news";
import blogsRoutes from "./blogs";

const router = Router();

router.use(health);
router.use("/users", usersRoutes);
router.use("/alumni", alumniRoutes);
router.use("/news", newsRoutes);
router.use("/blogs", blogsRoutes);

export default router;
