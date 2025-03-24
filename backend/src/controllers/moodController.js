import database from "../config/mongodb.js";
import { getMoodOpenAI } from "../services/moodService.js";

export async function sendMood(req, res) {
  try {
    const { feeling } = req.body;

    if (!feeling) {
      return res.status(400).json({
        message: "Feeling is required",
      });
    }

    if (feeling.length > 100) {
      return res.status(400).json({
        message: "Feeling must be less than 100 characters",
      });
    }

    if (feeling.length < 3) {
      return res.status(400).json({
        message: "Feeling must be at least 3 characters",
      });
    }

    const message = await getMoodOpenAI(feeling);

    if (!message) {
      console.error("Failed to retrieve mood content from OpenAI.");
      return res.status(500).json({
        message: "Error retrieving mood content from OpenAI.",
      });
    }

    res.status(200).json({
      feeling: message.feeling,
      feedback_message: message.feedback_message,
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
