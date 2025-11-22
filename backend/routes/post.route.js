import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getPosts,
  createPost,
  deletePost,
  getPostById,
  commentOnPost,
  LikeOrUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getPosts);
router.get("/:id", protectRoute, getPostById);

router.post("/create", protectRoute, createPost);
router.post("/:id/comment", protectRoute, commentOnPost);
router.post("/:id/like", protectRoute, LikeOrUnlikePost);

router.delete("/delete/:id", protectRoute, deletePost);

export default router;
