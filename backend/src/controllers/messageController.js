import { getNotificationOpenAI } from "../services/messageService.js";
import database from "../config/mongodb.js";

export async function sendMessage(req, res) {
  try {
    const message = await getNotificationOpenAI();

    if (!message) {
      console.error("Failed to retrieve notification content from OpenAI.");
      return res.status(500).json({
        message: "Error retrieving notification content from OpenAI.",
      });
    }

    message.created_at = new Date();

    // save the message on the database
    await database.collection("messages").insertOne(message);

    res.status(200).json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving message from OpenAI",
      error,
    });
    console.log("Error:", error);
  }
}

export async function getMessages(req, res) {
  try {
    const messages = await database.collection("messages").find({}).toArray();
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving messages from database",
      error,
    });
  }
}
