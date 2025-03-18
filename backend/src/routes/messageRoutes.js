// routes/notificationRoutes.js
import express from "express";
import { sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/messages", sendMessage);

export default router;
