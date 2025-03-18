import { getNotificationOpenAI } from "../services/messageService.js";
import { Request, Response } from "express";

export async function sendMessage(req: Request, res: Response) {
  try {
    const message = await getNotificationOpenAI();

    if (!message) {
      console.error("Failed to retrieve notification content from OpenAI.");
      return;
    }

    const { title, body } = message;

    const notification = {
      notification: {
        title: title,
        body: body,
      },
    };

    res.status(200).json({
      message: "Notifications sent",
      results: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving FCM tokens or sending messages",
      error,
    });
    console.log("Error:", error);
  }
}
