import database from "./mongodb.js";

// Emotion categories with their color codes
const CATEGORIES = {
  BLUE: "blue", // Low-Energy, Negative
  YELLOW: "yellow", // Low-Energy, Unmotivated
  RED: "red", // High-Energy, Negative
  GREEN: "green", // High-Energy, Positive
};

// List of emotions by category
const emotions = [
  // Blue category - Low-Energy, Negative Emotions
  {
    name: "Sad",
    category: CATEGORIES.BLUE,
    description: "Feeling unhappy or sorrowful",
  },
  {
    name: "Lonely",
    category: CATEGORIES.BLUE,
    description: "Feeling isolated or without companionship",
  },
  {
    name: "Depressed",
    category: CATEGORIES.BLUE,
    description: "Feeling severe despondency and dejection",
  },
  {
    name: "Heartbroken",
    category: CATEGORIES.BLUE,
    description: "Feeling overwhelming sadness, typically after a loss",
  },
  {
    name: "Hopeless",
    category: CATEGORIES.BLUE,
    description: "Feeling like there is no possibility of improvement",
  },
  {
    name: "Burnout",
    category: CATEGORIES.BLUE,
    description: "Feeling exhausted due to prolonged stress",
  },

  // Yellow category - Low-Energy, Unmotivated States
  {
    name: "Unmotivated",
    category: CATEGORIES.YELLOW,
    description: "Lacking enthusiasm or drive",
  },
  {
    name: "Procrastinating",
    category: CATEGORIES.YELLOW,
    description: "Delaying tasks that need attention",
  },
  {
    name: "Overwhelmed",
    category: CATEGORIES.YELLOW,
    description: "Feeling buried or defeated by too many tasks or challenges",
  },
  {
    name: "Stuck",
    category: CATEGORIES.YELLOW,
    description: "Feeling unable to progress or move forward",
  },
  {
    name: "Doubtful",
    category: CATEGORIES.YELLOW,
    description: "Feeling uncertain or questioning one's abilities",
  },
  {
    name: "Bored",
    category: CATEGORIES.YELLOW,
    description: "Feeling weary due to lack of interest",
  },

  // Red category - High-Energy, Negative Emotions
  {
    name: "Angry",
    category: CATEGORIES.RED,
    description: "Feeling strong displeasure or hostility",
  },
  {
    name: "Anxious",
    category: CATEGORIES.RED,
    description: "Feeling worried, nervous, or uneasy",
  },
  {
    name: "Stressed",
    category: CATEGORIES.RED,
    description: "Feeling mental or emotional tension",
  },
  {
    name: "Frustrated",
    category: CATEGORIES.RED,
    description:
      "Feeling upset or annoyed due to inability to change a situation",
  },

  // Green category - High-Energy, Positive States
  {
    name: "Happy",
    category: CATEGORIES.GREEN,
    description: "Feeling joy or contentment",
  },
  {
    name: "Excited",
    category: CATEGORIES.GREEN,
    description: "Feeling enthusiasm and eagerness",
  },
  {
    name: "Confident",
    category: CATEGORIES.GREEN,
    description: "Feeling self-assured and certain",
  },
  {
    name: "Grateful",
    category: CATEGORIES.GREEN,
    description: "Feeling thankful and appreciative",
  },
  {
    name: "Inspired",
    category: CATEGORIES.GREEN,
    description: "Feeling mentally stimulated to do something creative",
  },
  {
    name: "Loving",
    category: CATEGORIES.GREEN,
    description: "Feeling affection or deep attachment",
  },
];

/**
 * Initialize the emotions collection in the database
 * This ensures the emotions are present when the application starts
 */
export async function initializeEmotions() {
  try {
    const emotionsCollection = database.collection("emotions");

    // Check if emotions already exist in the database
    const count = await emotionsCollection.countDocuments();

    // Only seed if the collection is empty
    if (count === 0) {
      console.log("Initializing emotions database...");

      // Insert all emotions
      const result = await emotionsCollection.insertMany(emotions);

      console.log(
        `Successfully seeded ${result.insertedCount} emotions into the database`
      );
    } else {
      console.log(
        `Database already contains ${count} emotions. Skipping initialization.`
      );
    }

    // Create an index on the name field for faster lookups
    await emotionsCollection.createIndex({ name: 1 }, { unique: true });

    // Create an index on the category field for category-based queries
    await emotionsCollection.createIndex({ category: 1 });

    console.log("Emotions database setup complete");
  } catch (error) {
    console.error("Error initializing emotions database:", error);
  }
}

// Export the categories for use elsewhere in the application
export { CATEGORIES };
