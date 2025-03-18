import { Router, Request, Response } from "express";
import { sendMessage } from "../controllers/messageController";

const router: Router = Router();

router.get("/messages", sendMessage);

export default router;
