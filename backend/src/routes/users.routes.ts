// src/routes/users.routes.ts
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  searchUsers,
  getMyProfile,
  updateMyProfile,
  uploadAvatarHandler,
  uploadCvHandler,
} from "../controllers/users.controller";
import { uploadAvatar, uploadCv } from "../middlewares/upload.middleware";

const router = Router();

router.get("/search", authenticate, searchUsers);

router.get("/me", authenticate, getMyProfile);

router.put("/me", authenticate, updateMyProfile);

router.post("/me/avatar", authenticate, uploadAvatar, uploadAvatarHandler);

router.post("/me/cv", authenticate, uploadCv, uploadCvHandler);

export default router;
