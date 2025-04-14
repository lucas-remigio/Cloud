import openai from "../config/openai.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptFilePath = path.resolve(
  __dirname,
  "../prompts/promptGenerateMessage.txt"
);

async function generateMessageOpenAI(feeling) {
  let prompt = fs.readFileSync(promptFilePath, "utf-8");

  prompt = prompt.replace("{{feeling}}", feeling);
  console.log(prompt);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}

export async function getMessageOpenAI(category, maxRetries = 5) {
  for (let tries = 0; tries < maxRetries; tries++) {
    const message = await generateMessageOpenAI(category);
    const parsedContent = parseJsonFromMessage(message);

    if (!parsedContent) {
      console.warn(
        `Retrying (${tries + 1}/${maxRetries}) to get valid JSON from OpenAI`
      );
      continue;
    }

    console.log("Title:", parsedContent.title);
    console.log("Body:", parsedContent.body);
    return parsedContent;
  }

  console.error(
    "Failed to get notification from OpenAI after multiple attempts"
  );
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
