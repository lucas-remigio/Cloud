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

    const { title, body } = message;

    // save the message on the database
    await database.collection("messages").insertOne({ title, body });

    const notification = {
      message: {
        title: title,
        body: body,
      },
    };

    res.status(200).json({
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving message from OpenAI",
      error,
    });
    console.log("Error:", error);
  }
}
