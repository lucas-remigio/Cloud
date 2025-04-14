import { MongoClient } from "mongodb";

const emotionSchema = {
  name: String,
  category: String,
  description: String,
};

export default emotionSchema;
