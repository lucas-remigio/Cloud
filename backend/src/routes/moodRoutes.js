// routes/notificationRoutes.js
import express from "express";
import { sendMood } from "../controllers/moodController.js";

const router = express.Router();

router.post("/moods", sendMood);

export default router;
