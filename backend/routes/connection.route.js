import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionRequests,
  getUserConnections,
  removeConnection,
  getConnectionStatus,
} from "../controllers/connection.controller.js";
const router = express.Router();

//sending request to accept
router.post("/request/:userId", protectRoute, sendConnectionRequest);

//accept a request
router.put("/accept/:requestId", protectRoute, acceptConnectionRequest);
router.put("/reject/:requestId", protectRoute, rejectConnectionRequest);

//get all connection requests of that user
router.get("/requests", protectRoute, getConnectionRequests);

// get all user connections
router.get("/", protectRoute, getUserConnections);

router.delete("/:userId", protectRoute, removeConnection);

router.get("/status/:userId", protectRoute, getConnectionStatus);
export default router;
