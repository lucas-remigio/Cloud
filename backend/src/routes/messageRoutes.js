// routes/notificationRoutes.js
import express from "express";
import {
  sendMessage,
  getMessages,
  getMessagesByCategory,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/messages", sendMessage);
router.get("/messages", getMessages);
router.get("/messages/:category", getMessagesByCategory);

export default router;
