import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  Login,
  Logout,
  Signup,
  getCurrentUser,
} from "../controllers/auth.countroller.js";
router.post("/signup", Signup);
router.post("/logout", Logout);
router.post("/login", Login);

router.get("/checkLoggedInOrNot", protectRoute, getCurrentUser);
export default router;
