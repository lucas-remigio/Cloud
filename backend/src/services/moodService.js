import openai from "../config/openai.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import database from "../config/mongodb.js";
import { CATEGORIES } from "../config/dbInit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptFilePath = path.resolve(
  __dirname,
  "../prompts/promptGenerateMood.txt"
);

// Get the category for a specific feeling
async function getEmotionByFeeling(feeling) {
  const emotionsCollection = database.collection("emotions");

  // Try to find an exact match
  const exactMatch = await emotionsCollection.findOne({
    name: { $regex: new RegExp(`^${feeling}$`, "i") },
  });

  if (exactMatch) {
    return exactMatch;
  }

  // If no exact match, try to find a partial match
  const partialMatch = await emotionsCollection.findOne({
    name: { $regex: new RegExp(feeling, "i") },
  });

  if (partialMatch) {
    return partialMatch;
  }

  return null;
}

async function generateMoodOpenAI(feeling) {
  var prompt = fs.readFileSync(promptFilePath, "utf-8");

  prompt = prompt.replace("{feeling}", feeling);

  // get the feelings from the database to replace in the prompt
  const emotions = await database.collection("emotions").find().toArray();
  const feelings = emotions.map((emotion) => emotion.name);

  prompt = prompt.replace("{{emotions}}", feelings.join(", "));

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}

export async function getMoodOpenAI(feeling, maxRetries = 5) {
  for (let tries = 0; tries < maxRetries; tries++) {
    const message = await generateMoodOpenAI(feeling);
    const parsedContent = parseJsonFromMessage(message);

    if (!parsedContent) {
      console.warn(
        `Retrying (${tries + 1}/${maxRetries}) to get valid JSON from OpenAI`
      );
      continue;
    }

    console.log("Feeling:", parsedContent.feeling);
    console.log("Feedback message:", parsedContent.feedback_message);

    // Get the emotion category for the identified feeling
    const category = await getEmotionByFeeling(parsedContent.feeling);
    console.log("Category:", category);

    // Add the category to the result
    return {
      ...parsedContent,
      category,
    };
  }

  console.error("Failed to get mood from OpenAI after multiple attempts");
  return null; // Return null or handle error as needed
}

// Helper function to parse JSON content
function parseJsonFromMessage(message) {
  const jsonMatch = message.match(/{[\s\S]*}/);

  if (!jsonMatch) return null;

  try {
    const jsonString = jsonMatch[0];
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON from message:", error);
    return null;
  }
}
