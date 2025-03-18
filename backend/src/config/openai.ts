import OpenAI from "openai";

const openai: any = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
