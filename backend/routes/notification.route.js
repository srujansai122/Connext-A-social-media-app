import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  readNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/:id/read", protectRoute, readNotification);
router.delete("/:id", protectRoute, deleteNotification);
export default router;
