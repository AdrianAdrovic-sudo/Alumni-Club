import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/adminOnly.middleware";
import {
  getAdminInquiries,
  markAdminInquiryRead,
  deleteAdminInquiry,
} from "../controllers/contact.controller";

const router = Router();

router.get("/", authenticate, adminOnly, getAdminInquiries);
router.patch("/:id/read", authenticate, adminOnly, markAdminInquiryRead);
router.delete("/:id", authenticate, adminOnly, deleteAdminInquiry);

export default router;
