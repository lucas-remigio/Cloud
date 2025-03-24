import express from "express";
import cors from "cors";
import "dotenv/config";
import messageRoutes from "./routes/messageRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use("/api", messageRoutes);
app.use("/api", moodRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
